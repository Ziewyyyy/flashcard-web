import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { StudyProvider } from "./context/StudyContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LanguageProvider } from "./context/LanguageContext";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="591018459960-sbvbs143it9eoi2hl1k9ca0ms8gsvfln.apps.googleusercontent.com">
      <LanguageProvider>
        <StudyProvider>
          <App />
        </StudyProvider>
      </LanguageProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
