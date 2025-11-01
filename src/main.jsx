import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { VitalsProvider } from './context/VitalsContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <VitalsProvider>
          <App />
        </VitalsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
