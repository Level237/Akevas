import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.setAttribute('translate', 'no');        // désactive la traduction automatique
  rootElement.classList.add('notranslate');           // renforcé par la classe CSS
}

createRoot(rootElement!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)