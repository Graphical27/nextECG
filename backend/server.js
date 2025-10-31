const { SerialPort } = require('serialport');
const { WebSocketServer } = require('ws');

// Vital signs tracking
let vitalSigns = {
  heartRate: 0,
  spo2: 0,
  respirationRate: 0,
  bloodPressure: { systolic: 0, diastolic: 0 },
  temperature: 0,
  ecgQuality: 0,
  leadsOff: false
};

let ecgBuffer = [];
const BUFFER_SIZE = 100;
let lastHeartbeatTime = Date.now();
let peakDetected = false;
let rrIntervals = [];

const SYNC_BYTE_1 = 0xC7;
const SYNC_BYTE_2 = 0x7C;
const END_BYTE = 0x01;
const HEADER_LEN = 3;

const BOARD_CHANNELS = {
  'UNO-R3': 6,
  'GENUINO-UNO': 6,
  'UNO-CLONE': 6,
  'MAKER-UNO': 6,
  'NANO-CLASSIC': 8,
  'NANO-CLONE': 8,
  'MAKER-NANO': 8,
  'MEGA-2560-R3': 16,
  'MEGA-2560-CLONE': 16
};

const DEFAULT_CHANNELS = 8;

// Serial port state
let port = null;
let isConnected = false;
let currentPortPath = null;
let boardIdentity = null;
let channelCount = DEFAULT_CHANNELS;
let expectedPacketLength = channelCount * 2 + HEADER_LEN + 1;
let streamingActive = false;
let handshakeStage = 'idle';
let handshakeRetryTimer = null;
let serialBuffer = Buffer.alloc(0);

// 1. --- WebSocket Server Setup ---
// Create a WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', ws => {
  console.log('Client connected');
  
  // Send current connection status
  ws.send(JSON.stringify({ 
    type: 'connection-status', 
    connected: isConnected,
    port: currentPortPath
  }));
  
  // Send current vitals on connection
  ws.send(JSON.stringify({ type: 'vitals', data: vitalSigns }));
  
  // Handle incoming messages from client
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      if (data.type === 'list-ports') {
        // List available serial ports
        const ports = await SerialPort.list();
        ws.send(JSON.stringify({ 
          type: 'ports-list', 
          ports: ports.map(p => ({
            path: p.path,
            manufacturer: p.manufacturer,
            serialNumber: p.serialNumber,
            pnpId: p.pnpId
          }))
        }));
      } else if (data.type === 'connect') {
        // Connect to specified port
        connectToPort(data.port);
      } else if (data.type === 'disconnect') {
        // Disconnect from current port
        disconnectPort();
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({ 
        type: 'error', 
        message: error.message 
      }));
    }
  });
  
  ws.on('close', () => console.log('Client disconnected'));
});

// Function to broadcast ECG data to all connected clients
function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Calculate heart rate from R-R intervals
function calculateHeartRate() {
  if (rrIntervals.length < 2) return vitalSigns.heartRate;
  
  const avgRRInterval = rrIntervals.reduce((a, b) => a + b, 0) / rrIntervals.length;
  const heartRate = Math.round(60000 / avgRRInterval); // Convert ms to BPM
  
  // Sanity check (30-200 BPM)
  if (heartRate >= 30 && heartRate <= 200) {
    return heartRate;
  }
  return vitalSigns.heartRate;
}

// Detect R-peaks in ECG signal for heart rate calculation
function detectRPeak(value) {
  ecgBuffer.push(value);
  if (ecgBuffer.length > BUFFER_SIZE) {
    ecgBuffer.shift();
  }
  
  if (ecgBuffer.length < 10) return;
  
  // Simple peak detection: value significantly higher than recent average
  const recentAvg = ecgBuffer.slice(-10).reduce((a, b) => a + b, 0) / 10;
  const threshold = recentAvg * 1.3; // 30% above average
  
  if (value > threshold && !peakDetected) {
    peakDetected = true;
    const now = Date.now();
    const rrInterval = now - lastHeartbeatTime;
    
    if (rrInterval > 300 && rrInterval < 2000) { // Valid R-R interval (30-200 BPM)
      rrIntervals.push(rrInterval);
      if (rrIntervals.length > 5) rrIntervals.shift(); // Keep last 5 intervals
      
      vitalSigns.heartRate = calculateHeartRate();
      broadcast({ type: 'vitals', data: vitalSigns });
    }
    
    lastHeartbeatTime = now;
  } else if (value < threshold * 0.8) {
    peakDetected = false;
  }
}

// Simulate other vitals based on heart rate (for demo purposes)
function updateVitals() {
  if (vitalSigns.heartRate > 0) {
    // SpO2: simulate normal range
    vitalSigns.spo2 = Math.min(100, 95 + Math.floor(Math.random() * 4));
    
    // Blood pressure: correlate with HR
    const baselineSystolic = 120;
    const hrVariation = (vitalSigns.heartRate - 70) * 0.5;
    vitalSigns.bloodPressure.systolic = Math.round(baselineSystolic + hrVariation + (Math.random() * 10 - 5));
    vitalSigns.bloodPressure.diastolic = Math.round(vitalSigns.bloodPressure.systolic * 0.65);
    
    // Temperature: simulate normal range
    vitalSigns.temperature = (36.5 + Math.random() * 0.5).toFixed(1);
    
    // Respiration rate: typically 1/4 of heart rate
    vitalSigns.respirationRate = Math.round(vitalSigns.heartRate / 4);
    
    // ECG quality indicator
    vitalSigns.ecgQuality = ecgBuffer.length > 50 ? 85 + Math.floor(Math.random() * 15) : 0;
  }
}

// Update vitals every 2 seconds
setInterval(updateVitals, 2000);

function resetVitals() {
  vitalSigns = {
    heartRate: 0,
    spo2: 0,
    respirationRate: 0,
    bloodPressure: { systolic: 0, diastolic: 0 },
    temperature: 0,
    ecgQuality: 0,
    leadsOff: false
  };
}

function resetSerialState() {
  serialBuffer = Buffer.alloc(0);
  streamingActive = false;
  boardIdentity = null;
  channelCount = DEFAULT_CHANNELS;
  expectedPacketLength = channelCount * 2 + HEADER_LEN + 1;
  handshakeStage = 'idle';
  if (handshakeRetryTimer) {
    clearTimeout(handshakeRetryTimer);
    handshakeRetryTimer = null;
  }
}

function scheduleHandshakeRetry() {
  if (handshakeRetryTimer) {
    clearTimeout(handshakeRetryTimer);
  }

  if (!port || !port.isOpen) {
    return;
  }

  const command = handshakeStage === 'awaiting-board'
    ? 'WHORU\n'
    : handshakeStage === 'awaiting-running'
      ? 'STATUS\n'
      : null;

  if (!command) {
    return;
  }

  handshakeRetryTimer = setTimeout(() => {
    if (!port || !port.isOpen) {
      return;
    }

    port.write(command, err => {
      if (err) {
        console.warn('Handshake write failed:', err.message);
      }
    });

    scheduleHandshakeRetry();
  }, 500);
}

function handleSerialData(chunk) {
  if (!chunk || chunk.length === 0) {
    return;
  }

  serialBuffer = Buffer.concat([serialBuffer, chunk]);

  if (handshakeStage !== 'streaming') {
    let newlineIndex;
    while ((newlineIndex = serialBuffer.indexOf(0x0A)) !== -1) {
      const lineBuffer = serialBuffer.slice(0, newlineIndex);
      serialBuffer = serialBuffer.slice(newlineIndex + 1);
      const line = lineBuffer.toString('utf8').replace(/\r$/, '').trim();
      if (line.length === 0) {
        continue;
      }

      handleHandshakeLine(line);

      if (handshakeStage === 'streaming') {
        break;
      }
    }
  }

  if (handshakeStage === 'streaming' && serialBuffer.length > 0) {
    processBinaryPackets();
  }
}

function handleHandshakeLine(line) {
  if (line === 'UNKNOWN COMMAND') {
    console.warn('Arduino reported UNKNOWN COMMAND during handshake');
    return;
  }

  if (handshakeStage === 'awaiting-board') {
    boardIdentity = line;
    channelCount = BOARD_CHANNELS[boardIdentity] || DEFAULT_CHANNELS;
    expectedPacketLength = channelCount * 2 + HEADER_LEN + 1;
    console.log(`Chords firmware detected: ${boardIdentity} (${channelCount} channels)`);

    broadcast({
      type: 'connection-status',
      connected: true,
      port: currentPortPath,
      message: `Connected to ${boardIdentity}`
    });

    handshakeStage = 'awaiting-running';

    if (port && port.isOpen) {
      port.write('START\n', err => {
        if (err) {
          console.warn('Error sending START command:', err.message);
        }
      });
    }

    scheduleHandshakeRetry();
    return;
  }

  if (handshakeStage === 'awaiting-running') {
    if (line === 'RUNNING') {
      handshakeStage = 'streaming';
      streamingActive = true;
      serialBuffer = Buffer.alloc(0);
      if (handshakeRetryTimer) {
        clearTimeout(handshakeRetryTimer);
        handshakeRetryTimer = null;
      }
      console.log('Chords firmware streaming started (RUNNING).');
      return;
    }

    if (line === 'STOPPED') {
      if (port && port.isOpen) {
        port.write('START\n', err => {
          if (err) {
            console.warn('Error reissuing START command:', err.message);
          }
        });
      }
      scheduleHandshakeRetry();
      return;
    }
  }

  console.log(`Arduino: ${line}`);
}

function processBinaryPackets() {
  if (!expectedPacketLength || expectedPacketLength <= HEADER_LEN + 1) {
    return;
  }

  while (serialBuffer.length >= expectedPacketLength) {
    const syncIndex = serialBuffer.indexOf(SYNC_BYTE_1);

    if (syncIndex === -1) {
      serialBuffer = Buffer.alloc(0);
      return;
    }

    if (syncIndex > 0) {
      serialBuffer = serialBuffer.slice(syncIndex);
    }

    if (serialBuffer.length < expectedPacketLength) {
      return;
    }

    if (serialBuffer[1] !== SYNC_BYTE_2) {
      serialBuffer = serialBuffer.slice(1);
      continue;
    }

    const endByte = serialBuffer[expectedPacketLength - 1];
    if (endByte !== END_BYTE) {
      serialBuffer = serialBuffer.slice(1);
      continue;
    }

    const packet = serialBuffer.slice(0, expectedPacketLength);
    serialBuffer = serialBuffer.slice(expectedPacketLength);
    handlePacket(packet);
  }
}

function handlePacket(packet) {
  if (!packet || packet.length < expectedPacketLength) {
    return;
  }

  const values = [];
  for (let index = 0; index < channelCount; index++) {
    const base = HEADER_LEN + index * 2;
    const value = (packet[base] << 8) | packet[base + 1];
    values.push(value);
  }

  const ecgValue = values[0];
  vitalSigns.leadsOff = false;

  detectRPeak(ecgValue);

  broadcast({
    type: 'ecg',
    ecgValue,
    timestamp: Date.now()
  });
}

// Function to connect to a serial port
function connectToPort(portPath) {
  if (port && port.isOpen) {
    disconnectPort();
  }

  console.log(`Attempting to connect to ${portPath}...`);
  resetSerialState();
  currentPortPath = portPath;

  try {
    port = new SerialPort({
      path: portPath,
      baudRate: 115200
    });

    port.on('open', () => {
      console.log(`Serial port ${portPath} open`);
      console.log('Chords binary bridge ready');
      isConnected = true;

      broadcast({
        type: 'connection-status',
        connected: true,
        port: portPath,
        message: 'Connected successfully'
      });

      handshakeStage = 'awaiting-board';
      scheduleHandshakeRetry();

      if (port && port.isOpen) {
        port.write('STOP\n', err => {
          if (err) {
            console.warn('Error sending STOP command:', err.message);
          }

          port.write('WHORU\n', err2 => {
            if (err2) {
              console.warn('Error requesting board identity:', err2.message);
            }
          });
        });
      }
    });

    port.on('data', handleSerialData);

    port.on('error', err => {
      console.error('SerialPort Error:', err.message);
      isConnected = false;
      resetSerialState();
      resetVitals();

      broadcast({
        type: 'connection-status',
        connected: false,
        error: err.message
      });
    });

    port.on('close', () => {
      console.log('Serial port closed');
      if (port) {
        port.off('data', handleSerialData);
        port = null;
      }
      isConnected = false;
      resetSerialState();
      currentPortPath = null;
      resetVitals();

      broadcast({
        type: 'connection-status',
        connected: false,
        message: 'Disconnected'
      });
    });
  } catch (error) {
    console.error('Error connecting to port:', error);
    isConnected = false;
    resetSerialState();
    resetVitals();

    broadcast({
      type: 'connection-status',
      connected: false,
      error: error.message
    });
  }
}

// Function to disconnect from serial port
function disconnectPort() {
  if (port && port.isOpen) {
    console.log('Disconnecting from serial port...');
    try {
      port.write('STOP\n');
    } catch (err) {
      console.warn('Error sending STOP command during disconnect:', err.message);
    }
    port.off('data', handleSerialData);
    port.close(err => {
      if (err) {
        console.error('Error closing port:', err);
      }
    });
    return;
  }

  port = null;
  currentPortPath = null;
  isConnected = false;
  resetSerialState();
  resetVitals();

  broadcast({
    type: 'connection-status',
    connected: false,
    message: 'Disconnected'
  });
}

console.log('WebSocket server running on ws://localhost:8080');
console.log('Waiting for client to select Arduino port...');
