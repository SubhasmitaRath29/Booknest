import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App.tsx';
import './index.css';

// 1. Access your Clerk Publishable Key from the .env.local file
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL); 
console.log('Clerk Key:', PUBLISHABLE_KEY); // This should show the key if loaded
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Did you forget to create a .env.local file and restart your server?");
}

// 2. Render your application
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);