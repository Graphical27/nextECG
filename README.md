# NextECG - Clinical Glassmorphism Dashboard

A **professional, clinical-grade medical dashboard** for real-time ECG monitoring with a modern **Glassmorphism + Glass & Glow** design aesthetic.

![Version](https://img.shields.io/badge/version-2.0-00ADB5)
![React](https://img.shields.io/badge/React-18.3-61DAFB)
![Vite](https://img.shields.io/badge/Vite-6.4-646CFF)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Functionality
- 🫀 **Real-time ECG Monitoring** - Live waveform via WebSocket from Arduino
- 🤖 **AI-Powered Predictions** - Cardiac condition analysis with confidence levels
- 📊 **Vitals History** - Trending charts and recent readings
- � **Patient Information** - Demographics, blood type, last checkup
- 📈 **Advanced Metrics** - QRS, PR, QT intervals, heart variability
- ⚙️ **Control Panel** - Settings, export options, quick actions

### Design & UX
- 🎨 **Glassmorphism UI** - Semi-transparent panels with backdrop blur
- 🌊 **Continuous Heartbeat Animation** - Subtle ECG flow in background
- 🎯 **Clinical Color Palette** - Professional medical tech aesthetics
- 📱 **Fully Responsive** - Mobile, tablet, and desktop optimized
- ⚡ **Smooth Animations** - GPU-accelerated, 60fps transitions
- 🎭 **Status Indicators** - Color-coded health metrics

## 🎨 Design System

### Color Palette
```css
Primary:    #222831  /* Dark background */
Secondary:  #393E46  /* Card backgrounds */
Accent:     #00ADB5  /* Teal - medical tech */
Light:      #EEEEEE  /* High contrast text */

Status:
Success:    #00ff88  /* Green - healthy */
Warning:    #ffb800  /* Yellow - attention */
Danger:     #ff4757  /* Red - critical */
Info:       #00ADB5  /* Teal - information */
```

### Typography
- **Body**: Inter (300-800 weights)
- **Technical/Numbers**: Orbitron (400-900 weights)
- **Loaded from**: Google Fonts CDN

## 🏗️ Architecture

```
Arduino (USB) → Node.js Backend (SerialPort) → WebSocket → React Frontend
                                    ↓
                              Chart.js Visualization
```

**Three-Tier Architecture**:
1. **Arduino** - Sends ECG data over USB serial (COM3, 9600 baud)
2. **Node.js Backend** - Reads serial data, broadcasts via WebSocket (port 8080)
3. **React Frontend** - Real-time visualization with Chart.js (port 3001)

## 🛠️ Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 6.4
- **Styling**: Tailwind CSS 4
- **Charts**: Chart.js 4.4 + react-chartjs-2 5.2
- **Design**: Glassmorphism + Clinical MedTech UI
- **Backend**: Node.js + SerialPort 12 + WebSocket (ws 8.18)
- **Fonts**: Inter, Orbitron (Google Fonts)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Arduino board with ECG sensor (optional - can use simulator)
- USB cable for Arduino connection

### Installation

**1. Clone and Install Frontend:**
```bash
cd c:\Games\nextECG
npm install
```

**2. Install Backend (for real Arduino data):**
```bash
cd backend
npm install
```
npm install
cd ..
```

### Arduino Setup

1. Open `backend/arduino_ecg_simulator.ino` in Arduino IDE
2. Upload to your Arduino board
3. Note the COM port (Tools > Port in Arduino IDE)
4. Update `backend/server.js` with your port (e.g., `COM3`, `/dev/ttyACM0`)

See `backend/README.md` for detailed Arduino setup instructions.

### Running the Application

You need to run both the backend server and the frontend:

**Terminal 1 - Backend Server:**
```bash
cd backend
npm start
```

You should see:
```
WebSocket server running on ws://localhost:8080
Serial port COM3 open
Arduino Data: 512
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Development (Without Arduino)

To test without Arduino, modify `backend/server.js` to simulate data:

```javascript
// Replace SerialPort code with:
setInterval(() => {
  broadcast(Math.floor(Math.random() * 1024));
}, 50);
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
/
├── /backend                     # Node.js WebSocket server
│   ├── server.js               # Main server file
│   ├── arduino_ecg_simulator.ino  # Arduino sketch
│   ├── package.json            # Backend dependencies
│   └── README.md               # Backend documentation
├── /src
│   ├── /components
│   │   ├── BackgroundAnimation.jsx  # Subtle ECG background
│   │   ├── LiveECGPlotter.jsx      # Real-time WebSocket chart
│   │   ├── DataCard.jsx            # Reusable metric card
│   │   └── Header.jsx              # Dashboard header
│   ├── App.jsx                 # Main application component
│   ├── index.css              # Global styles & animations
│   └── main.jsx               # Application entry point
├── package.json               # Frontend dependencies
├── vite.config.js            # Vite configuration
└── tailwind.config.js        # Tailwind CSS configuration
```

## Design System

### Color Palette
- **Background**: White (`bg-white`) / Light Gray (`bg-gray-100`)
- **Text**: Black (`text-black`)
- **Primary Accent**: Bright Red (`bg-red-500`, `border-red-500`)
- **Secondary Accents**: Yellow (`bg-yellow-300`), Blue (`bg-blue-400`)

### Neobrutalism Style
- Thick borders: `border-2 border-black`
- Hard shadows: `shadow-[4px_4px_0px_#000]`
- Bold typography: `font-extrabold text-2xl`
- Hover effects: `hover:translate-x-[2px] hover:translate-y-[2px]`

## Components

### BackgroundAnimation
Displays a subtle, full-screen background animation of glowing ECG lines.

### Header
Navigation header with the NextECG branding and connection status indicator.

### LiveECGPlotter
Real-time streaming ECG chart that receives data from Arduino via WebSocket.
- Shows connection status (Connected/Connecting/Disconnected/Error)
- Auto-reconnects on connection loss
- Displays last 50 data points

### DataCard
Reusable card component for displaying health metrics with title, value, and optional unit.

## WebSocket Communication

The backend broadcasts ECG values as JSON:
```json
{
  "ecgValue": 512
}
```

Frontend connects to `ws://localhost:8080` and updates the chart in real-time.

## Troubleshooting

### Backend won't start
- Check that the COM port is correct in `backend/server.js`
- Make sure Arduino is connected via USB
- Close Arduino IDE Serial Monitor (it locks the port)

### Frontend shows "Disconnected"
- Ensure backend server is running (`cd backend && npm start`)
- Check that WebSocket port 8080 is not blocked by firewall
- Look for errors in browser console (F12)

### No data appearing on chart
- Verify Arduino is sending data (check backend console for "Arduino Data: ...")
- Ensure Arduino sketch uses `Serial.println()` not `Serial.print()`
- Check baud rate matches (9600) in both Arduino and `server.js`

For more troubleshooting, see `backend/README.md`.

## License

MIT
