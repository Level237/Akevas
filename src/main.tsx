import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './store'

const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.setAttribute('translate', 'no');        // désactive la traduction automatique
  rootElement.classList.add('notranslate');           // renforcé par la classe CSS
}

if (!rootElement) {
  throw new Error("L'élément racine 'root' n'a pas été trouvé dans le DOM.");
}
createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
