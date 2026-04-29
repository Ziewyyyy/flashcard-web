import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { StudyProvider } from "./context/StudyContext";
import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="591018459960-sbvbs143it9eoi2hl1k9ca0ms8gsvfln.apps.googleusercontent.com">
      <StudyProvider>
        <App />
      </StudyProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
