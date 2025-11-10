import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// This script runs on every page. We need to create a host for our React app.

// --- Bug Fix: Prevent multiple injections on the same page ---
// Check if our root element already exists. If so, do nothing.
const DOCK_ROOT_ID = 'react-scroll-dock-root-v1';
if (document.getElementById(DOCK_ROOT_ID)) {
    // Dock already exists, exit the script.
} else {
    // 1. Inject the Tailwind CSS script into the page's head
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);

    // 2. Create a div that will serve as the root for our React app
    const rootDiv = document.createElement('div');
    rootDiv.id = DOCK_ROOT_ID;
    document.body.appendChild(rootDiv);

    // 3. Mount the React app into the newly created div
    const root = ReactDOM.createRoot(rootDiv);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
}
