# Chords Serial Plotter Data Formats
## Quick Reference for Arduino ECG Output Formats

> **2025 update**: The shipping Arduino sketch now streams the native Chords binary packet (`0xC7 0x7C` sync, 1-byte counter, `NUM_CHANNELS`×2-byte values, `0x01` terminator). The legacy text formats are documented below for backwards compatibility or custom forks.

## 🧬 Binary Packet (Default in v2+)

- **Sync bytes**: `0xC7 0x7C`
- **Counter**: 1 byte (increments per frame)
- **Payload**: `NUM_CHANNELS` pairs of bytes (big-endian 10-bit ADC readings)
- **Terminator**: `0x01`
- **Nano build**: `NUM_CHANNELS = 8` (channel 0 is ECG)

---

## 📡 Legacy Supported Formats

### Format 1: Single Value
**Description**: Simplest format - just the raw ECG value  
**Use Case**: Arduino Serial Plotter, basic applications  
**Configuration**: `#define OUTPUT_FORMAT 1`

**Output Example:**
```
512
530
700
480
512
```

**Pros:**
- ✅ Simplest to parse
- ✅ Minimal bandwidth
- ✅ Works with any serial plotter

**Cons:**
- ❌ No metadata
- ❌ Single channel only

---

### Format 2: Labeled (Recommended)
**Description**: Values with labels (Chords preferred format)  
**Use Case**: Chords Serial Plotter, self-documenting data  
**Configuration**: `#define OUTPUT_FORMAT 2`

**Output Example:**
```
ECG:512
ECG:530
ECG:700
ECG:480
ECG:512
```

**Pros:**
- ✅ Self-documenting
- ✅ Chords compatible
- ✅ Easy to parse
- ✅ Extensible (add more labels)

**Cons:**
- ❌ Slightly more bandwidth

**Extended Example:**
```
ECG:512 HR:72
ECG:530 HR:72
ECG:700 HR:73
```

---

### Format 3: Multi-Channel
**Description**: Space/tab separated values for multiple channels  
**Use Case**: Multi-signal monitoring, advanced applications  
**Configuration**: `#define OUTPUT_FORMAT 3`

**Output Example:**
```
512 0 0
530 0 0
700 1 0
480 0 0
512 0 0
```

**Channel Map:**
- **Ch1**: ECG value (0-1023)
- **Ch2**: Leads-off indicator (0=connected, 1=off)
- **Ch3**: Reserved for future use

**Pros:**
- ✅ Multiple channels
- ✅ Parallel data streams
- ✅ Efficient for multi-signal

**Cons:**
- ❌ Requires channel mapping
- ❌ Less self-documenting

---

## 🎛️ Chords Configuration

### Using Format 1 (Single Value)
```
Chords Settings:
- Baud Rate: 115200
- Data Format: Single Value
- Channels: 1
```

### Using Format 2 (Labeled)
```
Chords Settings:
- Baud Rate: 115200
- Data Format: Labeled
- Auto-detect labels: ON
```

### Using Format 3 (Multi-Channel)
```
Chords Settings:
- Baud Rate: 115200
- Data Format: Space-separated
- Channels: 3
- Channel Names: ECG, LeadsOff, Reserved
```

---

## 🔧 Arduino Code Snippets

### Sending Format 1
```cpp
void sendData(int ecgValue) {
  Serial.println(ecgValue);
}
```

### Sending Format 2
```cpp
void sendData(int ecgValue, int heartRate) {
  Serial.print("ECG:");
  Serial.print(ecgValue);
  Serial.print(" HR:");
  Serial.println(heartRate);
}
```

### Sending Format 3
```cpp
void sendData(int ecgValue, bool leadsOff, int reserved) {
  Serial.print(ecgValue);
  Serial.print(" ");
  Serial.print(leadsOff ? 1 : 0);
  Serial.print(" ");
  Serial.println(reserved);
}
```

---

## 📊 Backend Parsing (Node.js)

### Our server supports all three formats!

**Format 1 Detection:**
```javascript
const value = parseFloat(trimmedData);
if (!isNaN(value)) {
  ecgValue = value;
}
```

**Format 2 Detection:**
```javascript
if (trimmedData.includes(':')) {
  const [label, value] = pair.split(':');
  if (label.toUpperCase().includes('ECG')) {
    ecgValue = parseFloat(value);
  }
}
```

**Format 3 Detection:**
```javascript
if (trimmedData.includes(' ')) {
  const values = trimmedData.split(/\s+/);
  ecgValue = parseFloat(values[0]);
}
```

---

## 🎨 Visualization Comparison

### Arduino Serial Plotter
- ✅ Format 1: Single line
- ✅ Format 2: Single line (ignores labels)
- ✅ Format 3: Multiple lines (one per channel)

### Chords Serial Plotter
- ✅ Format 1: Single channel
- ✅✅✅ Format 2: Auto-labeled channels (BEST)
- ✅ Format 3: Multiple channels

### NextECG Dashboard
- ✅ Format 1: Supported
- ✅✅✅ Format 2: Recommended
- ✅ Format 3: Supported

---

## 💡 Best Practices

### For Beginners
**Use Format 1**
- Easiest to understand
- Quick to set up
- Good for learning

### For Production
**Use Format 2**
- Self-documenting
- Chords compatible
- Easy to debug
- Future-proof

### For Multi-Signal
**Use Format 3**
- ECG + EMG + EEG simultaneously
- Efficient data packing
- Requires clear documentation

---

## 🔍 Debugging Tips

### Check Serial Output
```bash
# Arduino IDE
Tools > Serial Monitor
Baud: 115200

# Expected output (Format 2):
ECG:512
ECG:530
ECG:700
```

### Verify Parsing
```bash
# Backend console
cd backend
npm start

# Expected output:
ECG: 512
ECG: 530
ECG: 700
```

### Test in Chords
1. Open Chords
2. Select COM port
3. Set baud: 115200
4. Connect
5. ✅ Should see waveform

---

## 📝 Summary

| Format | Complexity | Bandwidth | Chords | Recommended |
|--------|-----------|-----------|--------|-------------|
| **1: Single** | ⭐ Easy | 🟢 Low | ✅ Yes | Beginners |
| **2: Labeled** | ⭐⭐ Medium | 🟡 Medium | ✅✅✅ Best | **Production** |
| **3: Multi-Channel** | ⭐⭐⭐ Advanced | 🟢 Low | ✅ Yes | Multi-signal |

**Our recommendation: Format 2 (Labeled)** ✅

---

## 🔗 Related Documentation

- [ARDUINO_NANO_SETUP.md](./ARDUINO_NANO_SETUP.md) - Complete setup guide
- [QUICKSTART.md](./QUICKSTART.md) - Get started in 5 minutes
- [UPDATE_NOTES.md](./UPDATE_NOTES.md) - What's new in v2.0

---

**Happy coding! 🎉**
