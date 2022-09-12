import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { IPFSContextProvider } from './IPFSContextProvider';

ReactDOM.render(
  <StrictMode>
    <BrowserRouter>
      <IPFSContextProvider>
        <App />
      </IPFSContextProvider>
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
);
