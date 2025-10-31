# 🚀 NextECG v2.0 - Developer Quick Reference

## 📌 Quick Commands

### Start the System
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend  
npm run dev

# Browser
http://localhost:3000
```

### Find Arduino Port
```bash
cd backend && npm run list-ports
```

---

## 🔧 Configuration Checklist

### Arduino Code (`backend/arduino_ecg_simulator.ino`)
```cpp
#define SAMPLE_RATE 250        // 125, 250, or 500 Hz
#define OUTPUT_FORMAT 2        // 1, 2, or 3 (use 2 for Chords)
bool useRealSensor = false;    // true for real ECG sensor
```

### Backend (`backend/server.js`)
```javascript
const portPath = 'COM3';       // YOUR Arduino port!
baudRate: 115200,              // Must match Arduino
```

---

## 📡 Data Formats

### Format 1: Single Value
```
512
530
```

### Format 2: Labeled (Recommended)
```
ECG:512
ECG:530
```

### Format 3: Multi-Channel
```
512 0 0
530 0 0
```

---

## 🎯 Key Components

### Backend
- **server.js**: WebSocket server + Serial parser + R-peak detection

### Frontend
- **VitalsContext.jsx**: Global state for vitals data
- **LiveECGPlotter.jsx**: Real-time ECG chart
- **PatientInfo.jsx**: Patient demographics
- **VitalsHistory.jsx**: Historical trends
- **App.jsx**: Main dashboard layout

---

## 🔍 Debugging

### Check Arduino Output
```bash
# Arduino IDE > Tools > Serial Monitor
# Baud: 115200
# Expected: ECG:512
```

### Check Backend
```bash
cd backend && npm start
# Expected: "ECG: 512"
```

### Check Frontend
```bash
# Browser Console (F12)
# Expected: "Connected to Arduino Nano"
```

---

## 📊 Message Types

### ECG Data (High Frequency)
```javascript
{
  type: 'ecg',
  ecgValue: 512,
  timestamp: 1234567890
}
```

### Vitals Update (Low Frequency)
```javascript
{
  type: 'vitals',
  data: {
    heartRate: 72,
    spo2: 98,
    bloodPressure: { systolic: 120, diastolic: 80 },
    temperature: 98.6,
    respirationRate: 18,
    ecgQuality: 95,
    leadsOff: false
  }
}
```

---

## 🛠️ Common Fixes

### "Serial port cannot be opened"
```bash
# Close Arduino Serial Monitor/Plotter
# Close Chords
# Restart backend
```

### "Frontend shows Disconnected"
```bash
# Ensure backend is running
# Check port in server.js
# Verify Arduino is connected
```

### "Heart Rate shows 0"
```bash
# Wait 5-10 seconds
# Check ECG signal amplitude
# Verify R-peaks are visible
```

---

## 📦 Dependencies

### Backend
```json
{
  "serialport": "^12.0.0",
  "ws": "^8.18.0"
}
```

### Frontend
```json
{
  "react": "^18.3",
  "chart.js": "^4.4",
  "react-chartjs-2": "^5.2",
  "tailwindcss": "^4.0"
}
```

---

## 🎨 Chords Setup

1. **Open Chords**
2. **Select Port**: COM3 (your port)
3. **Baud Rate**: 115200
4. **Connect**
5. **View**: Live ECG waveform

---

## 🔗 File Locations

```
nextECG/
├── backend/
│   ├── server.js                  ← WebSocket + Serial
│   ├── arduino_ecg_simulator.ino  ← Upload to Nano
│   └── package.json
├── src/
│   ├── App.jsx                    ← Main dashboard
│   ├── context/
│   │   ├── VitalsContext.jsx      ← Global vitals state
│   │   └── ThemeContext.jsx       ← Theme management
│   └── components/
│       ├── LiveECGPlotter.jsx     ← ECG chart
│       ├── PatientInfo.jsx        ← Patient data
│       └── VitalsHistory.jsx      ← Historical trends
└── docs/
    ├── ARDUINO_NANO_SETUP.md      ← Full setup guide
    ├── QUICKSTART.md              ← 5-min start
    ├── UPDATE_NOTES.md            ← v2.0 changes
    └── CHORDS_FORMATS.md          ← Data formats
```

---

## 💡 Pro Tips

### Optimize Performance
- Use Format 2 (labeled) for best compatibility
- Keep sample rate at 250 Hz for standard ECG
- Limit historical data to 100 points

### Real Sensor Setup
- Use 3.3V NOT 5V for ECG sensors
- Ensure good electrode contact
- Use leads-off detection pins

### Debugging Serial Issues
- Check baud rate matches (115200)
- Verify line endings (\n)
- Use Serial Monitor to verify output

---

## 🎓 Learning Resources

- [Arduino Nano Docs](https://docs.arduino.cc/hardware/nano)
- [Upside Down Labs](https://github.com/upsidedownlabs)
- [Chart.js Docs](https://www.chartjs.org/docs/)
- [React Context API](https://react.dev/reference/react/useContext)

---

## 📞 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't find port | `npm run list-ports` |
| Upload fails | Try other bootloader |
| No data | Check Serial Monitor |
| Disconnected | Start backend |
| HR = 0 | Wait or check signal |

---

## ✅ Pre-Flight Checklist

Before starting:
- [ ] Arduino Nano connected via USB
- [ ] Drivers installed
- [ ] Code uploaded successfully
- [ ] Port configured in server.js
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed

---

## 🎯 Success Indicators

You should see:
- ✅ Arduino Serial Monitor: "ECG:512..."
- ✅ Backend console: "Serial port COM3 open"
- ✅ Backend console: "ECG: 512"
- ✅ Frontend status: "Connected"
- ✅ Live waveform updating
- ✅ Heart rate > 0 (after 5-10 sec)

---

**Happy coding! 💓**

*For detailed documentation, see [ARDUINO_NANO_SETUP.md](./ARDUINO_NANO_SETUP.md)*
