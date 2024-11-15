import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "ol/ol.css";
import './globals.css';

createRoot(document.getElementById('root')).render(
  <App />
);
