# Arduino Nano Setup Guide for NextECG
## Complete guide for using Arduino Nano with Chords Serial Plotter compatibility

---

## 📋 Table of Contents
1. [Hardware Requirements](#hardware-requirements)
2. [Software Requirements](#software-requirements)
3. [Arduino Nano Setup](#arduino-nano-setup)
4. [Chords Compatibility](#chords-compatibility)
5. [Real ECG Sensor Integration](#real-ecg-sensor-integration)
6. [Backend Configuration](#backend-configuration)
7. [Testing & Troubleshooting](#testing--troubleshooting)

---

## 🔌 Hardware Requirements

### Required:
- **Arduino Nano** (or compatible board with ATmega328P)
- **USB Mini-B Cable** (for Nano connection)
- **Computer** with USB port

### Optional (for real ECG):
- **ECG Sensor Module** (choose one):
  - AD8232 Heart Rate Monitor
  - Upside Down Labs BioAmp EXG Pill
  - Upside Down Labs Muscle BioAmp Shield
  - Any other analog ECG sensor outputting 0-3.3V

- **ECG Electrodes** (3-lead or 5-lead)
- **Jumper Wires** (if using breadboard)

---

## 💻 Software Requirements

### Install:
1. **Arduino IDE** (version 1.8.x or 2.x)
   - Download: https://www.arduino.cc/en/software

2. **Chords Serial Plotter** (optional, for visualization)
   - Download from Upside Down Labs
   - Alternative: Use Arduino Serial Plotter (Tools > Serial Plotter)

3. **Node.js** (for backend server)
   - Already required for NextECG

---

## 🎯 Arduino Nano Setup

### Step 1: Connect Arduino Nano

1. **Plug Arduino Nano** into your computer via USB cable
2. **Install Drivers** (if needed):
   - **CH340 Driver** (for clone boards): Download from manufacturer
   - **FTDI Driver** (for original Nano): Usually auto-installed

3. **Verify Connection**:
   - Windows: Device Manager > Ports (COM & LPT) > Look for "USB-SERIAL CH340 (COMx)"
   - macOS: Terminal > `ls /dev/tty.*` > Look for `/dev/tty.usbserial-*`
   - Linux: Terminal > `ls /dev/tty*` > Look for `/dev/ttyUSB0` or `/dev/ttyACM0`

### Step 2: Configure Arduino IDE

1. **Open Arduino IDE**
2. **Select Board**:
   - Go to: `Tools > Board > Arduino AVR Boards > Arduino Nano`
   
3. **Select Processor**:
   - For **Old Bootloader**: `Tools > Processor > ATmega328P (Old Bootloader)`
   - For **New Bootloader**: `Tools > Processor > ATmega328P`
   - **Tip**: If upload fails, try the other bootloader option

4. **Select Port**:
   - `Tools > Port > COM3` (Windows)
   - `Tools > Port > /dev/tty.usbserial-XXXXX` (macOS)
   - `Tools > Port > /dev/ttyUSB0` (Linux)

### Step 3: Upload the Code

1. **Open** `backend/arduino_ecg_simulator.ino` in Arduino IDE

2. **Configure Settings** (top of file):
   ```cpp
   #define BOARD_NANO_CLONE    // uncomment the board you are using
   // #define BOARD_NANO_CLASSIC
   // #define BOARD_UNO_R3
   // #define BOARD_MEGA_2560_R3

   #define ENABLE_SIMULATION 0 // set to 1 for the built-in ECG waveform
   ```
   - Leave `ENABLE_SIMULATION` at `0` for real sensors (AD8232, BioAmp, etc.).
   - Set `ENABLE_SIMULATION` to `1` to generate a software ECG for demos.

3. **Verify Code**: Click ✓ (Verify) button
   - Should say: "Done compiling"

4. **Upload Code**: Click → (Upload) button
   - Progress: "Uploading..."
   - Success: "Done uploading"

5. **Test Output**:
    - Open: `Tools > Serial Monitor`
    - Set baud rate: **115200**
    - Expected handshake:
       ```
       NANO-CLONE
       RUNNING
       ```
    - After `RUNNING` the stream switches to Chords **binary packets**, so any extra characters will look like gibberish—this is normal. Close the Serial Monitor before starting the backend.

---

## 🎨 Chords Compatibility

### What is Chords?

Chords is a serial plotter application by **Upside Down Labs** designed for visualizing bioelectric signals (ECG, EMG, EEG, etc.) in real-time.

> **2025 firmware update**: The Arduino sketch now streams the official Chords binary packet (sync bytes `0xC7 0x7C`, counter, eight 10-bit channels, `0x01` terminator). Chords auto-detects the packet structure, so no `OUTPUT_FORMAT` setting is required. The legacy text formats documented below are retained for reference when working with older firmware.

### Supported Data Formats (legacy reference)

If you revert to the pre-2025 text-based sketch, these were the three serial formats controlled by `OUTPUT_FORMAT`. The default firmware now streams the binary packet described above, so treat the notes below as historical context only:

#### Format 1: Single Value
```
512
530
700
```
- **Use case**: Simplest format, single channel
- **Legacy switch**: `#define OUTPUT_FORMAT 1`

#### Format 2: Labeled (Recommended)
```
ECG:512
ECG:530
ECG:700
```
- **Use case**: Best for Chords, self-documenting
- **Legacy switch**: `#define OUTPUT_FORMAT 2`

#### Format 3: Multi-Channel
```
512 0 0
530 0 0
700 0 0
```
- **Use case**: Multiple channels (ECG + others)
- **Format**: `ECG LeadsOff Reserved`
- **Legacy switch**: `#define OUTPUT_FORMAT 3`

### Using with Chords Serial Plotter

1. **Open Chords** application
2. **Select Port**: Choose your Arduino's COM port
3. **Set Baud Rate**: 115200
4. **Start Plotting**: Click "Connect" or "Start"
5. **View ECG**: Real-time waveform appears

### Alternative: Arduino Serial Plotter

If you don't have Chords:
1. Arduino IDE > `Tools > Serial Plotter`
2. Set baud: **115200**
3. View real-time graph

---

## 🫀 Real ECG Sensor Integration

### Using AD8232 ECG Sensor

#### Wiring:

| AD8232 Pin | Arduino Nano Pin | Notes |
|------------|------------------|-------|
| **GND**    | GND              | Ground |
| **3.3V**   | 3.3V             | Power (NOT 5V!) |
| **OUTPUT** | A0               | ECG signal |
| **LO+**    | D10              | Leads-off detect + |
| **LO-**    | D11              | Leads-off detect - |
| **SDN**    | Not connected    | Leave floating |

#### Electrode Placement (3-lead):

- **RA (Right Arm)**: Right shoulder or right wrist
- **LA (Left Arm)**: Left shoulder or left wrist  
- **RL (Right Leg/Ground)**: Right lower abdomen or right ankle

#### Code Configuration:

```cpp
bool useRealSensor = true;  // Enable real sensor mode
```

Upload the modified code to Arduino Nano.

### Using Upside Down Labs BioAmp

For **BioAmp EXG Pill** or **Muscle BioAmp Shield**:

1. **Follow manufacturer wiring guide**
2. **Connect analog output** to Arduino A0
3. **Adjust pin definitions** if needed:
   ```cpp
   #define ECG_PIN A0  // Change if using different analog pin
   ```

---

## ⚙️ Backend Configuration

### Step 1: Find Your COM Port

**Windows (PowerShell):**
```powershell
cd backend
npm run list-ports
```

**macOS/Linux:**
```bash
cd backend
npm run list-ports
```

Output example:
```
Available serial ports:
1. COM3
   Manufacturer: wch.cn
   
Suggested Arduino port: COM3
```

### Step 2: Update Backend Server

Edit `backend/server.js` (line ~116):

```javascript
const portPath = 'COM3'; // <-- CHANGE to your port!
```

**Examples:**
- Windows: `'COM3'`, `'COM4'`, `'COM5'`
- macOS: `'/dev/tty.usbserial-14420'`
- Linux: `'/dev/ttyUSB0'`, `'/dev/ttyACM0'`

### Step 3: Start Backend

```bash
cd backend
npm start
```

**Success output:**
```
WebSocket server running on ws://localhost:8080
Attempting to connect to Arduino Nano on COM3...
Serial port COM3 open
Chords-compatible serial plotter ready
ECG: 512
ECG: 530
```

---

## 🧪 Testing & Troubleshooting

### ✅ Quick Test Checklist

- [ ] Arduino Nano connected via USB
- [ ] Correct COM port selected in Arduino IDE
- [ ] Code uploaded successfully (no errors)
- [ ] Serial Monitor shows ECG data at 115200 baud
- [ ] Backend server shows "ECG: ..." messages
- [ ] Frontend shows "Connected" status
- [ ] Live ECG waveform visible on chart

### ❌ Common Issues

#### "Serial port cannot be opened"

**Causes:**
- Port already in use
- Wrong port selected
- Driver not installed

**Solutions:**
1. **Close** Arduino Serial Monitor/Plotter
2. **Close** Chords if running
3. **Verify** port in Arduino IDE
4. **Restart** Arduino IDE
5. **Replug** USB cable

#### "avrdude: stk500_recv(): programmer is not responding"

**Cause:** Wrong bootloader selected

**Solution:**
- Try: `Tools > Processor > ATmega328P (Old Bootloader)`
- Or: `Tools > Processor > ATmega328P`

#### Frontend shows "Disconnected"

**Causes:**
- Backend not running
- Wrong COM port in server.js

**Solutions:**
1. **Start backend**: `cd backend && npm start`
2. **Check port** in `server.js`
3. **Verify** Arduino is sending data (check backend console)

#### Flat line on ECG chart

**Causes:**
- Simulated mode (normal behavior)
- Sensor not connected properly
- Leads off (electrodes not attached)

**Solutions:**
1. **Simulator mode**: This is normal - creates repeating pattern
2. **Real sensor**: Check wiring and electrode placement
3. **Check** backend console for "leads off" messages

#### Heart rate shows 0

**Cause:** Not enough data or weak signal

**Solutions:**
- **Wait** 5-10 seconds for algorithm to detect peaks
- **Check** ECG signal amplitude (should vary, not flat)
- **Adjust** electrode placement for stronger signal

---

## 📊 Data Flow Summary

```
Arduino Nano (ECG Sensor)
    ↓ USB Serial @ 115200 baud
   ↓ Format: Chords binary packet (0xC7 0x7C … 0x01)
Node.js Backend (server.js)
    ↓ Parse serial data
    ↓ Calculate vitals (HR, etc.)
    ↓ WebSocket @ ws://localhost:8080
    ↓ Format: JSON messages
React Frontend (LiveECGPlotter.jsx)
    ↓ Display real-time chart
    ↓ Update vitals display
User sees live ECG!
```

---

## 🎛️ Advanced Configuration

### Adjust Sample Rate

In Arduino code:
```cpp
#define SAMPLE_RATE 250  // Hz (samples per second)
```

**Common rates:**
- **250 Hz**: Standard for ECG (recommended)
- **500 Hz**: High resolution
- **125 Hz**: Lower bandwidth

**Note:** Backend auto-adapts to any rate.

### Board & Simulation Options

```cpp
#define BOARD_NANO_CLONE
#define ENABLE_SIMULATION 0
```

- Uncomment the `BOARD_*` macro that matches your hardware (Nano, Uno, Mega).
- Set `ENABLE_SIMULATION` to `1` to stream the built-in ECG waveform without hardware.
- Leave `ENABLE_SIMULATION` at `0` when using a physical sensor.

### Enable Debug Output

In Arduino code, add comments starting with `#`:
```cpp
Serial.println("# Debug: R-peak detected");
```

Lines starting with `#` are ignored by backend but visible in Serial Monitor.

---

## 🔗 Useful Resources

### Official Documentation
- [Arduino Nano Documentation](https://docs.arduino.cc/hardware/nano)
- [Upside Down Labs GitHub](https://github.com/upsidedownlabs)
- [AD8232 Datasheet](https://www.analog.com/media/en/technical-documentation/data-sheets/ad8232.pdf)

### Community
- [Arduino Forum](https://forum.arduino.cc/)
- [Upside Down Labs Discord](https://discord.gg/upsidedownlabs)

---

## 📝 Next Steps

1. ✅ **Test with simulator** (default mode)
2. ✅ **Verify data in Chords** (optional)
3. ✅ **Connect real ECG sensor** (if available)
4. ✅ **Start NextECG dashboard**
5. 🎉 **Monitor live cardiac data!**

---

**Happy monitoring! 💓**
