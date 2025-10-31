# NextECG Backend Server

This is the WebSocket bridge server that connects your Arduino ECG device to the React frontend.

## Architecture

```
Arduino (USB) → Node.js Server (SerialPort) → WebSocket → React Frontend
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `serialport` - For reading data from Arduino via USB
- `ws` - WebSocket server for real-time data streaming

### 2. Configure Your Arduino Port

Open `server.js` and change the `portPath` variable to match your Arduino's port:

**Windows:**
```javascript
const portPath = 'COM3'; // or COM4, COM5, etc.
```

**macOS:**
```javascript
const portPath = '/dev/tty.usbmodem14201'; // or similar
```

**Linux:**
```javascript
const portPath = '/dev/ttyACM0'; // or /dev/ttyUSB0
```

#### How to Find Your Arduino Port:

1. Open Arduino IDE
2. Go to **Tools > Port**
3. Select your Arduino from the list
4. The port name is shown there

Alternatively, run this command:

**Windows PowerShell:**
```powershell
[System.IO.Ports.SerialPort]::getportnames()
```

**macOS/Linux:**
```bash
ls /dev/tty.*        # macOS
ls /dev/ttyACM*      # Linux
ls /dev/ttyUSB*      # Linux (alternative)
```

### 3. Upload Arduino Code

1. Open `arduino_ecg_simulator.ino` in the Arduino IDE
2. Select your board: **Tools > Board**
3. Select your port: **Tools > Port**
4. Click **Upload** (→ button)
5. Wait for "Done uploading" message

### 4. Start the Backend Server

```bash
npm start
```

You should see:
```
WebSocket server running on ws://localhost:8080
Attempting to connect to Arduino on COM3...
Serial port COM3 open
```

When data starts flowing:
```
Arduino Data: 512
Arduino Data: 530
Arduino Data: 700
...
```

## Testing Without Arduino

If you don't have an Arduino yet, you can test the WebSocket server by modifying `server.js` to send simulated data:

```javascript
// Comment out the SerialPort code and add this:
setInterval(() => {
  const simulatedValue = Math.floor(Math.random() * 1024);
  broadcast(simulatedValue);
}, 50);
```

## Troubleshooting

### Error: "Cannot find module 'serialport'"
```bash
cd backend
npm install
```

### Error: "Error: No such file or directory, cannot open COM3"
- Check that your Arduino is plugged in via USB
- Verify the correct port in Arduino IDE
- Update the `portPath` in `server.js`

### Error: "Access denied" or "Permission denied"
- **Windows**: Close Arduino IDE Serial Monitor
- **macOS/Linux**: Add yourself to the dialout group:
  ```bash
  sudo usermod -a -G dialout $USER
  ```
  Then log out and back in.

### No data appearing in console
- Make sure your Arduino code includes `Serial.println()`, not just `Serial.print()`
- Verify the baud rate matches (9600 in both Arduino and server.js)
- Check Arduino IDE Serial Monitor to see if data is being sent

## WebSocket Protocol

The server broadcasts JSON messages to all connected clients:

```json
{
  "ecgValue": 512
}
```

## Running Both Frontend and Backend

Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

Then open http://localhost:3000 in your browser.

## Production Deployment

For production, you'll want to:
1. Use environment variables for configuration
2. Add error recovery and reconnection logic
3. Consider using HTTPS/WSS for secure connections
4. Add authentication if needed

## License

MIT
