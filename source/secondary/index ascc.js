import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Keep console clean but always show ASCII header
const ASCII = `              _   _             _     _ _      
             | | (_)           | |   | (_)     
   __ _ _ __ | |_ _ _ __  _   _| |__ | |_  ___ 
  / _\` | '_ \\| __| | '_ \\| | | | '_ \\| | |/ __|
 | (_| | | | | |_| | |_) | |_| | |_) | | | (__ 
  \\__,_|_| |_|\\__|_| .__/ \\__,_|_.__/|_|_|\\___|
                   | |                         
                   |_|                         `;

const logAscii = () => {
  try {
    console.log('%c%s', 'color: white; font: 12px "Courier New", monospace; line-height: 12px; background: transparent;', ASCII);
  } catch {}
};

const clearAndLog = () => { try { console.clear(); } catch {} logAscii(); };

if (process.env.NODE_ENV === 'production') {
  clearAndLog();
  setInterval(clearAndLog, 1000);
} else {
  clearAndLog();
  setTimeout(clearAndLog, 100);
  setTimeout(clearAndLog, 500);
  setTimeout(clearAndLog, 1000);
  setInterval(clearAndLog, 2000);
}

// SW
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        // OK
      })
      .catch(registrationError => {
        // FAIL
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
