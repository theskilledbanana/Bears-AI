import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Global error handler for debugging white screen
window.onerror = (msg, url, line, col, error) => {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="color:#ef4444; background:#0f172a; padding:40px; font-family:sans-serif; height:100vh;">
      <h1 style="font-size:24px; font-weight:900; margin-bottom:16px;">CRITICAL_SYSTEM_ERROR</h1>
      <p style="font-size:14px; opacity:0.7; margin-bottom:24px;">${msg}</p>
      <pre style="font-size:12px; background:rgba(0,0,0,0.3); padding:20px; border-radius:12px; overflow:auto;">${error?.stack || 'No stack trace available'}</pre>
    </div>`;
  }
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
