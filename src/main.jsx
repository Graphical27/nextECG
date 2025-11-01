import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { DatabaseProvider } from './context/DatabaseContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { VitalsProvider } from './context/VitalsContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <DatabaseProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <VitalsProvider>
                <App />
              </VitalsProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </DatabaseProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
