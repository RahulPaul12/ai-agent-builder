import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import ParticlesComponent from '../components/ParticlesComponent.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ParticlesComponent/>
    <App />
  </StrictMode>,
)
