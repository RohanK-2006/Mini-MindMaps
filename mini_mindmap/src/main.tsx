import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MapProvider from './context/MapProvider.tsx'
import MockProvider from './context/MockProvider.tsx'
import ThemeProvider from './context/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <MockProvider>
        <MapProvider>
          <App />
        </MapProvider>
      </MockProvider>
    </ThemeProvider>
  </StrictMode>,
)
