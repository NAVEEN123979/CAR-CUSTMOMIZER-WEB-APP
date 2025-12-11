import '../src/styles/globals.css'
import type { AppProps } from 'next/app'
import { AppProvider } from '../src/context/AppContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>

      {/* --- Cinematic Galaxy Background Layers --- */}
      <div className="nebula"></div>
      <div className="aurora"></div>
      <div className="planet"></div>

      <div className="stars"></div>
      <div className="stars2"></div>
      <div className="stars3"></div>

      {/* Shooting stars */}
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>

      {/* --- Your Actual App --- */}
      <Component {...pageProps} />
      
    </AppProvider>
  )
}

