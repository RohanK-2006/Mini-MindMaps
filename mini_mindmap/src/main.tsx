import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import MapProvider from './context/MapProvider.tsx'
import MockProvider from './context/MockProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MockProvider>
      <MapProvider>
        <App />
      </MapProvider>
    </MockProvider>
  </StrictMode>,
)
