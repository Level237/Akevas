
import './App.css'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import { LoaderProvider } from './context/LoaderContext'
import { Provider } from 'react-redux'
import { store } from './store'
import * as Sentry from "@sentry/react";

function App() {


  Sentry.init({
    dsn: "https://fa9b468024da5f968eabe4017b7ac1d4@o4508954538082304.ingest.us.sentry.io/4508954540179456",
    integrations: [
      Sentry.browserTracingIntegration()
    ],
    // Tracing
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/]
  });
  return (
    <LoaderProvider>
      <Provider store={store}>
        <RouterProvider router={routes} />
      </Provider>

    </LoaderProvider>
  )
}

export default App