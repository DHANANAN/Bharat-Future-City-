import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ThemeProvider } from '@/components/theme-provider'

// Global animated splash/ripple effect for all clicks
document.addEventListener('click', (e) => {
  const splash = document.createElement('span');
  splash.classList.add('global-splash');
  
  // Calculate size based on target or default to 100px
  const target = e.target as HTMLElement;
  const size = target ? Math.max(100, Math.min(Math.max(target.clientWidth, target.clientHeight) * 1.5, 300)) : 100;
  
  splash.style.width = splash.style.height = `${size}px`;
  splash.style.left = `${e.pageX - size / 2}px`;
  splash.style.top = `${e.pageY - size / 2}px`;
  
  document.body.appendChild(splash);
  
  // Clean up element after animation
  setTimeout(() => {
    splash.remove();
  }, 600);
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
