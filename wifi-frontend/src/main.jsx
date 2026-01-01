import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import QRPrint from "./QRPrint";

// Simple routing based on URL
const getComponent = () => {
  const path = window.location.pathname;
  if (path === "/qr") {
    return <QRPrint />;
  }
  return <App />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {getComponent()}
  </React.StrictMode>
);
