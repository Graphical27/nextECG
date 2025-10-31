# NextECG System Architecture

## Overview

NextECG is a real-time medical dashboard that displays ECG (electrocardiogram) data from an Arduino device in a web browser using WebSocket communication.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          NextECG System                              │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────┐      USB         ┌──────────────┐      WebSocket      ┌──────────────┐
│              │  Serial Port      │              │   ws://localhost    │              │
│   Arduino    │ ───────────────>  │   Node.js    │  <─────────────────>│   React      │
│   (Device)   │                   │   Backend    │                     │   Frontend   │
│              │                   │   Server     │                     │  (Browser)   │
└──────────────┘                   └──────────────┘                     └──────────────┘
     │                                    │                                    │
     │                                    │                                    │
 Sends ECG                          1. Reads serial                      1. Connects to
 data as                               data via                            WebSocket
 numbers                               serialport                       2. Receives ECG
 (0-1023)                           2. Broadcasts                          data messages
 via Serial                            via WebSocket                    3. Updates chart
 at 9600 baud                       3. Manages                             in real-time
                                       connections
```

## Data Flow

```
1. Arduino Reading
   ├─> Sensor reads ECG value (or simulation)
   ├─> Serial.println(value) sends to USB
   └─> Data: "512\n"

2. Backend Processing
   ├─> SerialPort reads from USB
   ├─> ReadlineParser splits by newline
   ├─> Converts to number: 512
   └─> Broadcasts JSON: {"ecgValue": 512}

3. Frontend Display
   ├─> WebSocket receives message
   ├─> Updates chart data state
   ├─> React re-renders component
   └─> Chart.js displays new point
```

## Technology Stack

### Frontend (React + Vite)
```
┌────────────────────────────────────┐
│  React 18                          │
│  ├─ Vite (build tool)             │
│  ├─ Tailwind CSS (styling)        │
│  └─ react-chartjs-2 (charts)      │
│                                    │
│  Components:                       │
│  ├─ App.jsx                        │
│  ├─ LiveECGPlotter.jsx (WebSocket)│
│  ├─ Header.jsx                     │
│  ├─ DataCard.jsx                   │
│  └─ BackgroundAnimation.jsx        │
└────────────────────────────────────┘
```

### Backend (Node.js)
```
┌────────────────────────────────────┐
│  Node.js                           │
│  ├─ serialport (USB communication)│
│  └─ ws (WebSocket server)          │
│                                    │
│  Files:                            │
│  ├─ server.js (main)               │
│  └─ list-ports.js (utility)        │
└────────────────────────────────────┘
```

### Arduino
```
┌────────────────────────────────────┐
│  Arduino Uno/Nano/etc.             │
│  ├─ ECG Sensor (e.g., AD8232)      │
│  └─ USB Serial Communication       │
│                                    │
│  Code:                             │
│  └─ arduino_ecg_simulator.ino      │
└────────────────────────────────────┘
```

## Communication Protocol

### Serial (Arduino → Backend)
```
Format:  <value>\n
Example: 512\n
         530\n
         700\n

Baud Rate: 9600
Delimiter: Newline (\n)
```

### WebSocket (Backend → Frontend)
```json
{
  "ecgValue": 512
}
```

```
Protocol: ws://
Port: 8080
Format: JSON
```

## File Structure

```
nextECG/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BackgroundAnimation.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── DataCard.jsx
│   │   │   └── LiveECGPlotter.jsx ← WebSocket client
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/
│   ├── server.js ← Main backend server
│   ├── list-ports.js
│   ├── arduino_ecg_simulator.ino
│   └── package.json
│
├── README.md
├── QUICKSTART.md
└── ARCHITECTURE.md (this file)
```

## Component Responsibilities

### 1. Arduino (`arduino_ecg_simulator.ino`)
- **Input:** Analog sensor or simulation
- **Processing:** Read ECG value
- **Output:** Send via Serial.println()
- **Frequency:** ~20 readings/second (50ms delay)

### 2. Backend Server (`server.js`)
- **Input:** Serial data from Arduino
- **Processing:** 
  - Parse serial data line-by-line
  - Convert to numbers
  - Manage WebSocket connections
- **Output:** Broadcast JSON to all clients
- **Ports:** 
  - Serial: COM3 (Windows) or /dev/ttyACM0 (Linux)
  - WebSocket: 8080

### 3. Frontend (`LiveECGPlotter.jsx`)
- **Input:** WebSocket messages
- **Processing:**
  - Maintain rolling buffer (50 points)
  - Update React state
  - Trigger re-renders
- **Output:** Live updating Chart.js visualization
- **Port:** HTTP 3000 (Vite dev server)

## Connection Sequence

```
1. User starts backend server
   └─> Backend connects to Arduino serial port
       └─> Listens for data

2. User starts frontend
   └─> Vite serves React app on port 3000

3. User opens browser
   └─> React app loads
       └─> LiveECGPlotter mounts
           └─> WebSocket connects to localhost:8080
               └─> Backend accepts connection

4. Arduino sends data
   └─> Backend receives via serial
       └─> Backend broadcasts via WebSocket
           └─> Frontend receives message
               └─> Chart updates
                   └─> User sees new ECG point
```

## Error Handling

### Frontend
```javascript
ws.onerror = (error) => {
  console.error('WebSocket error:', error);
  setConnectionStatus('Error');
};

ws.onclose = () => {
  setConnectionStatus('Disconnected');
};
```

### Backend
```javascript
port.on('error', err => {
  console.error('SerialPort Error: ', err.message);
});

// WebSocket connections are managed per-client
wss.on('connection', ws => {
  ws.on('close', () => console.log('Client disconnected'));
});
```

## Performance Considerations

### Data Rate
- Arduino: 20 readings/second (50ms interval)
- WebSocket: Real-time broadcast (< 1ms latency)
- Chart: 50-point rolling window (2.5 seconds of data)

### Memory
- Frontend: ~50 data points in state (~1KB)
- Backend: Minimal buffering (line-by-line parsing)
- Arduino: No buffering (streaming only)

### CPU
- Chart.js: animation disabled for performance
- React: State updates trigger efficient re-renders
- Backend: Event-driven (non-blocking I/O)

## Security Considerations

⚠️ **Development Setup - Not Production Ready**

This is a local development setup. For production:

1. **Authentication:** Add WebSocket authentication
2. **Encryption:** Use WSS (WebSocket Secure)
3. **CORS:** Configure proper CORS policies
4. **Input Validation:** Validate all incoming data
5. **Rate Limiting:** Prevent data flooding
6. **Error Handling:** Graceful degradation

## Scaling

### Current Limitations
- Single Arduino device
- Local network only
- One concurrent data stream

### Future Enhancements
1. **Multi-device support:** Multiple Arduinos
2. **Cloud deployment:** Remote monitoring
3. **Data persistence:** Store ECG history
4. **Analytics:** Heart rate calculation, anomaly detection
5. **Mobile app:** React Native version

## Development vs Production

| Feature | Development | Production |
|---------|------------|------------|
| Protocol | WS | WSS (encrypted) |
| Backend | Local Node.js | Cloud server (AWS/Azure) |
| Frontend | Vite dev server | Static build (nginx) |
| Database | None | TimescaleDB/PostgreSQL |
| Auth | None | JWT/OAuth |
| Monitoring | Console logs | Cloud monitoring |

## Troubleshooting Flow

```
Issue: No data on chart
├─> Check: Is frontend showing "Connected"?
│   ├─ No → Check backend is running
│   └─ Yes → Continue
│
├─> Check: Are there "Arduino Data" logs in backend?
│   ├─ No → Check Arduino connection
│   │   ├─ Verify correct COM port
│   │   ├─ Close Arduino Serial Monitor
│   │   └─ Check USB cable
│   └─ Yes → Check frontend WebSocket
│       └─ Look for browser console errors
```

## Summary

NextECG uses a simple but effective architecture:
- **Hardware Layer:** Arduino reads/simulates ECG data
- **Bridge Layer:** Node.js connects serial to WebSocket
- **Presentation Layer:** React displays real-time charts

This separation allows each component to focus on its specialty while maintaining loose coupling through standard protocols (Serial, WebSocket).
