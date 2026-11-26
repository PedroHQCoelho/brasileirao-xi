import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/sofia-sans-extra-condensed/wght.css'
import '@fontsource-variable/sofia-sans-extra-condensed/wght-italic.css'
import '@fontsource-variable/sofia-sans/wght.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
