import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-toastify/ReactToastify.css";
import "./styles/global.css";
import { ToastContainer } from "react-toastify";
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />

      {/* Toast Notification */}
      <ToastContainer 
          postion ="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme='colored'
      />

  </StrictMode>,
);
