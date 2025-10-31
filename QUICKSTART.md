# Quick Start Guide - NextECG with Arduino

Follow these steps to get your ECG dashboard running with real Arduino data.

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 2: Find Your Arduino Port

```bash
cd backend
npm run list-ports
```

This will show something like:
```
Available serial ports:
1. COM3
2. COM4
```

### Step 3: Update Backend Configuration

Open `backend/server.js` and change line 29:

```javascript
const portPath = 'COM3'; // <-- Change to YOUR port from Step 2
```

### Step 4: Upload Arduino Code

1. Open Arduino IDE
2. Open `backend/arduino_ecg_simulator.ino`
3. Select your board: **Tools > Board > Arduino Uno** (or your board)
4. Select your port: **Tools > Port > COM3** (or your port)
5. Click Upload (→ button)
6. Wait for "Done uploading"

### Step 5: Start the Backend Server

Open a new terminal:

```bash
cd backend
npm start
```

You should see:
```
WebSocket server running on ws://localhost:8080
Attempting to connect to Arduino on COM3...
Serial port COM3 open
Arduino Data: 512
Arduino Data: 530
```

✅ If you see "Arduino Data" messages, it's working!

### Step 6: Start the Frontend

Open another terminal (keep backend running):

```bash
npm run dev
```

### Step 7: Open in Browser

Navigate to: **http://localhost:3000**

You should see:
- ✅ Header shows "Status: Connected"
- ✅ ECG Monitor shows "Connected" and "LIVE"
- ✅ Graph is updating in real-time with Arduino data

## 🎯 You're Done!

Your ECG dashboard is now displaying live data from your Arduino!

---

## 🔧 Troubleshooting

### ❌ "Serial port COM3 cannot be opened"

**Problem:** Port is in use or wrong port selected

**Solutions:**
1. Close Arduino IDE Serial Monitor
2. Run `npm run list-ports` to find correct port
3. Update `server.js` with correct port
4. Make sure Arduino is plugged in via USB

### ❌ Frontend shows "Disconnected"

**Problem:** Backend server is not running

**Solution:**
1. Open a separate terminal
2. Run `cd backend && npm start`
3. Keep it running while using the app

### ❌ No data on the graph

**Problem:** Arduino isn't sending data

**Solution:**
1. Check backend terminal for "Arduino Data: ..." messages
2. Verify Arduino code uploaded successfully
3. Make sure baud rate is 9600 in both Arduino sketch and `server.js`

### ❌ Graph shows data but it's just a flat line

**Problem:** Arduino is sending the same value repeatedly

**Solution:**
- If using simulator: This is normal - it creates a pattern
- If using real sensor: Check sensor connections

---

## 📱 Testing Without Arduino

Don't have an Arduino yet? Test the system with simulated data:

**Edit `backend/server.js`:** Comment out lines 30-48 and add:

```javascript
// Simulate data for testing
setInterval(() => {
  const value = Math.floor(Math.random() * 1024);
  broadcast(value);
}, 50);

console.log('Running in simulation mode (no Arduino needed)');
```

Then start the backend normally.

---

## 🔗 Next Steps

- Connect a real ECG sensor (e.g., AD8232)
- Customize the dashboard colors and layout
- Add data logging and export features
- Implement heart rate calculation from ECG data

---

## 📚 More Information

- Frontend README: `../README.md`
- Backend README: `backend/README.md`
- Arduino Code: `backend/arduino_ecg_simulator.ino`

Happy monitoring! 🫀
