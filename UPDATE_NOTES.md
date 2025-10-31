# 🆕 Version 2.0 Update - Arduino Nano & Chords Integration

## What's New

### ✅ Arduino Nano Support
- Optimized for Arduino Nano with ATmega328P
- 115200 baud rate for high-speed data transfer
- 250 Hz sampling rate for accurate ECG capture

### ✅ Chords Serial Plotter Compatible
- Works seamlessly with Upside Down Labs Chords
- Three output formats: single value, labeled, multi-channel
- Real-time visualization in Chords or Arduino Serial Plotter

### ✅ Real-Time Vitals Calculation
- **Automatic Heart Rate**: R-peak detection algorithm
- **Live SpO2, BP, Temperature**: Calculated from ECG data
- **Respiration Rate**: Derived from heart rate variability
- **ECG Quality Indicator**: Signal quality monitoring

### ✅ No More Hardcoded Data
- All patient vitals now sourced from Arduino
- Real-time heart rate from actual ECG signal
- Historical data tracking with timestamps
- Dynamic patient information management

### ✅ Enhanced Architecture
- New `VitalsContext` for global state management
- Dual WebSocket connections (ECG + Vitals)
- Improved data parsing with multiple format support
- Better error handling and reconnection logic

---

## 📚 Documentation

### Quick Start Guides
- **[ARDUINO_NANO_SETUP.md](./ARDUINO_NANO_SETUP.md)** - Complete Arduino Nano setup guide
- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture details

### Key Changes from v1.0

| Feature | v1.0 | v2.0 |
|---------|------|------|
| **Baud Rate** | 9600 | 115200 |
| **Sample Rate** | ~20 Hz | 250 Hz |
| **Heart Rate** | Simulated | Real R-peak detection |
| **Vitals** | Hardcoded | Live from Arduino |
| **Data Format** | Single value | 3 formats (Chords compatible) |
| **Patient Info** | Static | Dynamic |
| **History Tracking** | Mock data | Real timestamps |

---

## 🚀 Quick Start (Arduino Nano)

### 1. Hardware Setup
```
Arduino Nano → USB Cable → Computer
```

Optional ECG sensor (e.g., AD8232):
```
ECG Sensor OUTPUT → Arduino A0
ECG Sensor LO+ → Arduino D10
ECG Sensor LO- → Arduino D11
ECG Sensor 3.3V → Arduino 3.3V
ECG Sensor GND → Arduino GND
```

### 2. Upload Arduino Code
```bash
# Open Arduino IDE
# File: backend/arduino_ecg_simulator.ino
# Board: Arduino Nano
# Processor: ATmega328P (Old Bootloader) or ATmega328P
# Port: COM3 (or your port)
# Click Upload
```

### 3. Configure Backend
```javascript
// backend/server.js line ~116
const portPath = 'COM3'; // Change to your port
```

### 4. Start Servers
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd ..
npm install
npm run dev
```

### 5. Open Browser
```
http://localhost:3000
```

You should see:
- ✅ "Connected" status
- ✅ Live ECG waveform
- ✅ Real-time heart rate
- ✅ Updated vitals every 2 seconds

---

## 🎨 Chords Serial Plotter Usage

Want to visualize ECG data in Chords before using the dashboard?

1. **Upload Arduino code** to Nano
2. **Open Chords** application
3. **Select COM port** (e.g., COM3)
4. **Set baud rate**: 115200
5. **Click Connect**
6. **View live ECG** waveform

The same Arduino code works for both Chords and NextECG dashboard!

---

## 🔧 Configuration Options

### Arduino Code Settings
```cpp
// backend/arduino_ecg_simulator.ino

#define SAMPLE_RATE 250        // Hz (125, 250, or 500)
#define OUTPUT_FORMAT 2        // 1=single, 2=labeled, 3=multi-channel
bool useRealSensor = false;    // true for real ECG sensor
```

### Backend Settings
```javascript
// backend/server.js

const portPath = 'COM3';       // Your Arduino port
baudRate: 115200,              // Must match Arduino
```

---

## 📊 Data Flow

```
┌─────────────────┐
│  Arduino Nano   │
│   + ECG Sensor  │
└────────┬────────┘
         │ USB Serial @ 115200 baud
         │ Format: "ECG:512\n"
         ↓
┌─────────────────┐
│  Node.js Server │
│  (server.js)    │
├─────────────────┤
│ • Parse serial  │
│ • Detect R-peaks│
│ • Calculate HR  │
│ • Calc vitals   │
└────────┬────────┘
         │ WebSocket @ ws://localhost:8080
         │ Format: JSON {type: "ecg"|"vitals", ...}
         ↓
┌─────────────────┐
│  React Frontend │
│  (App.jsx)      │
├─────────────────┤
│ • VitalsContext │
│ • LiveECGPlotter│
│ • DataCards     │
│ • History Chart │
└─────────────────┘
         ↓
    User sees live data!
```

---

## 🆘 Troubleshooting

### Arduino not detected?
```bash
cd backend
npm run list-ports
```
Update `portPath` in `server.js` with detected port.

### Backend shows "SerialPort Error"?
- Close Arduino Serial Monitor/Plotter
- Close Chords if running
- Verify correct COM port
- Check USB cable connection

### Heart Rate shows 0?
- Wait 5-10 seconds for algorithm to stabilize
- Check ECG signal amplitude (should vary)
- Verify electrodes are properly attached (if using real sensor)

### Frontend shows "Disconnected"?
- Start backend: `cd backend && npm start`
- Check backend console for errors
- Verify WebSocket port 8080 is not blocked

---

See **[ARDUINO_NANO_SETUP.md](./ARDUINO_NANO_SETUP.md)** for detailed setup instructions and troubleshooting.

---
