# NextECG - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd c:\Games\nextECG
npm install
```

### Step 2: Start Frontend
```bash
npm run dev
```
The app will open at: **http://localhost:3001**

### Step 3: Start Backend (Optional - for real Arduino data)
```bash
cd backend
npm install
npm start
```
Backend runs on: **ws://localhost:8080**

---

## 🎨 What's New in This Design?

### ✨ Glassmorphism UI
- Semi-transparent glass panels with backdrop blur
- Smooth depth shadows and subtle glow effects
- No harsh borders - everything is soft and elegant

### 🎯 Clinical Color Scheme
- **#222831** - Deep dark background (professional)
- **#393E46** - Card backgrounds (depth)
- **#00ADB5** - Teal accent (medical tech)
- **#EEEEEE** - Crisp white text (readability)

### 🏥 New Components

#### 1. **Patient Information Panel**
Displays patient demographics, ID, and last checkup date.

#### 2. **AI Prediction Module**
Real-time cardiac analysis with:
- Condition detection
- Confidence level (animated bar)
- Clinical recommendations
- Auto-updates every 15 seconds

#### 3. **Vitals History**
Historical trending chart showing:
- Last 6 hours of heart rate data
- Recent readings table (HR, BP, Temp, SpO2)
- Interactive tooltips

#### 4. **Enhanced Data Cards**
- Icons with gradient backgrounds
- Trend indicators (up/down arrows)
- Status-based color coding (green/yellow/red)
- Hover glow effects

#### 5. **Advanced ECG Monitor**
- Real-time waveform with grid overlay
- Scanning line animation
- 4 live metrics (HR, Avg Signal, Sample Rate, Buffer)
- Connection status indicators

### 🎬 Continuous Heartbeat Animation
Subtle ECG waveform flowing in the background:
- 3 layers with different speeds
- Horizontal movement (15-20 second cycles)
- Opacity: 30% (doesn't distract)
- Grid pattern overlay

---

## 📊 Dashboard Layout

```
┌─────────────────────────────────────────────────┐
│              HEADER (Glass Panel)                │
│  NextECG Logo | Live Clock | System Status      │
└─────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────┐
│   PATIENT INFORMATION    │    QUICK STATS       │
│   • Name, ID, Age        │  ┌────┬────┐         │
│   • Gender, Blood Type   │  │ HR │ BP │         │
│   • Last Checkup         │  ├────┼────┤         │
│                          │  │SpO2│Temp│         │
│                          │  └────┴────┘         │
└──────────────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────┐
│           LIVE ECG MONITOR                       │
│   ╭───────────────────────────────────╮         │
│   │   [ECG Waveform Chart]            │         │
│   │   Scanning line animation         │         │
│   ╰───────────────────────────────────╯         │
│   [HR: 72] [Avg: 512] [Rate: 250ms] [Buf: 50]  │
└─────────────────────────────────────────────────┘

┌──────────────────────────┬──────────────────────┐
│     AI PREDICTION        │   VITALS HISTORY     │
│   • Condition: Normal    │   ╭──────────────╮   │
│   • Confidence: 98%      │   │ [Mini Chart] │   │
│   • Recommendation       │   ╰──────────────╯   │
│   [Confidence Bar]       │   Recent Readings:   │
│                          │   10:45 AM - 72 BPM  │
└──────────────────────────┴──────────────────────┘

┌─────┬─────┬─────┬─────────────────────────────┐
│ QRS │ PR  │ QT  │ Heart Variability           │
│ 95ms│165ms│385ms│ High                        │
└─────┴─────┴─────┴─────────────────────────────┘
```

---

## 🎨 Color Usage Guide

### Status Colors
```javascript
// Normal / Healthy
status="normal"   → Green (#00ff88)

// Warning / Attention Needed
status="warning"  → Yellow (#ffb800)

// Critical / Danger
status="danger"   → Red (#ff4757)

// Information
status="info"     → Teal (#00ADB5)
```

### Example:
```jsx
<DataCard 
  title="Heart Rate"
  value="72"
  unit="BPM"
  status="normal"   // Green accent
  trend={2}         // +2% with up arrow
/>
```

---

## 🔌 WebSocket Integration

The frontend automatically connects to `ws://localhost:8080` for real-time ECG data.

### Without Backend (Simulation Mode)
The app will show:
- Connection Status: "Connecting..." or "Error"
- ECG chart will be empty or static

### With Backend Running
The app will show:
- Connection Status: "Connected" (green)
- Live indicator with pulse animation
- Real-time ECG waveform updating
- Heart rate calculations

### To Enable Real Data:
1. Upload `backend/arduino_ecg_simulator.ino` to Arduino
2. Connect Arduino via USB
3. Run `cd backend && npm start`
4. Frontend will auto-connect

---

## ⚡ Performance Tips

### Fast Loading
- All fonts loaded from Google Fonts CDN
- Chart animations disabled for performance
- 50-point rolling buffer (minimal memory)

### Smooth Animations
- CSS transforms (GPU accelerated)
- 0.3s transitions with cubic-bezier easing
- Background animations at 30% opacity

### Real-time Updates
- WebSocket for efficient data streaming
- React state updates batched
- No unnecessary re-renders

---

## 🎯 Key Features at a Glance

✅ **Glassmorphism Design** - Modern, elegant, professional  
✅ **Real-time ECG Monitoring** - WebSocket integration  
✅ **AI-Powered Analysis** - Condition detection with confidence  
✅ **Patient Management** - Demographics and history  
✅ **Vitals Trending** - Historical charts and tables  
✅ **Status Indicators** - Color-coded health metrics  
✅ **Responsive Layout** - Mobile, tablet, desktop  
✅ **Continuous Background Animation** - Subtle heartbeat flow  
✅ **Live Clock** - Always shows current time  
✅ **System Status** - Connection monitoring  

---

## 🎬 Interactions

### Hover Effects
- **Data Cards**: Lift up 2px with glow
- **Glass Panels**: Border brightens, shadow deepens
- **Buttons**: Smooth color transitions

### Real-time Updates
- **ECG Chart**: Updates every 250ms
- **Heart Rate**: Calculated from waveform
- **AI Analysis**: Re-runs every 15 seconds
- **Clock**: Updates every second

### Visual Feedback
- **Pulse Glow**: Green dot on "System Active"
- **Scanning Line**: Moves across ECG chart
- **Confidence Bar**: Animated fill on AI predictions
- **Loading Spinner**: During AI analysis

---

## 📱 Responsive Breakpoints

### Mobile (< 768px)
- Single column layout
- Stacked components
- Simplified header (logo only)

### Tablet (768px - 1024px)
- 2-column grid
- Side-by-side AI + History
- Compact stat cards

### Desktop (> 1024px)
- 3-4 column grid
- Full header with clock
- Optimal spacing

---

## 🛠️ Customization

### Change Accent Color
Edit `src/context/ThemeContext.jsx`:
```javascript
accent: '#00ADB5',  // Change to your color
```

### Adjust Animation Speed
Edit `src/index.css`:
```css
.heartbeat-line {
  animation: heartbeatFlow 15s linear infinite;
}
```
Change `15s` to make faster or slower.

### Modify Chart Colors
Edit `src/components/LiveECGPlotter.jsx`:
```javascript
borderColor: theme.ecgLine,  // Uses theme accent
backgroundColor: `${theme.accent}10`,  // 10% opacity fill
```

---

## 🐛 Troubleshooting

### "Port 3000 is in use"
✅ **Normal** - Vite will use port 3001 automatically

### "WebSocket connection failed"
❌ **Solution**: Start backend server
```bash
cd backend
npm start
```

### "Cannot find module"
❌ **Solution**: Reinstall dependencies
```bash
npm install
cd backend
npm install
```

### Fonts not loading
❌ **Solution**: Check internet connection (Google Fonts CDN)
Fonts imported in `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@400;500;700;900&display=swap');
```

---

## 📊 Sample Data

### Simulated Metrics
- **Heart Rate**: 60-80 BPM (randomized)
- **Blood Pressure**: 120/80 mmHg
- **SpO2**: 97-99%
- **Temperature**: 98.4-98.6°F
- **ECG Intervals**: QRS (95ms), PR (165ms), QT (385ms)

### AI Predictions (Rotating)
1. Normal Sinus Rhythm (98% confidence)
2. Mild Tachycardia (85% confidence)
3. Atrial Fibrillation Risk (72% confidence)

---

## 🎓 Learning Resources

### Technologies Used
- **React 18** - Component framework
- **Vite 6** - Build tool
- **Tailwind CSS 4** - Utility-first CSS
- **Chart.js 4** - Data visualization
- **WebSocket** - Real-time communication

### Design Concepts
- **Glassmorphism** - Semi-transparent UI elements
- **Depth Shadows** - Elevation hierarchy
- **Glow Effects** - Accent highlights
- **Continuous Animation** - Ambient movement

---

## 📞 Support

### Check Console
Open browser DevTools (F12) to see:
- WebSocket connection logs
- Chart render status
- Any JavaScript errors

### Check Files
Ensure all files are present:
```
src/
├── components/
│   ├── BackgroundAnimation.jsx ✅
│   ├── Header.jsx ✅
│   ├── DataCard.jsx ✅
│   ├── LiveECGPlotter.jsx ✅
│   ├── PatientInfo.jsx ✅
│   ├── AIPrediction.jsx ✅
│   └── VitalsHistory.jsx ✅
├── context/
│   └── ThemeContext.jsx ✅
├── App.jsx ✅
├── main.jsx ✅
└── index.css ✅
```

---

## 🎉 Success Checklist

After starting the app, you should see:

✅ Dark background (#222831)  
✅ Glassmorphism panels with blur  
✅ Teal accent color (#00ADB5)  
✅ Continuous heartbeat animation in background  
✅ Live clock in header  
✅ Patient information panel  
✅ ECG monitor (empty if no backend)  
✅ AI prediction module  
✅ Vitals history chart  
✅ Data cards with icons and trends  
✅ Smooth hover effects  
✅ No console errors  

---

**Enjoy your new clinical glassmorphism dashboard! 🏥💙**

For detailed design documentation, see `DESIGN_GUIDE.md`
