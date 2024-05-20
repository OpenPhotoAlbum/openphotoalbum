import React from "react";
import { Bounce, ToastOptions } from "react-toastify";
import "./App.css";
import Home from "./pages/Home";

import { Routes, Route } from "react-router-dom";
import Recognized from "./pages/Recognized";
import Scans from "./pages/Scans";
import "./pages/Page.styles.scss";

export const toast_config: ToastOptions = {
  position: "bottom-center",
  autoClose: 2000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

function App() {
  return (
    <div>
      <Routes>
        <Route path="/detected" Component={Scans} />
        <Route path="/recognized" Component={Recognized} />
        <Route path="/" Component={Home} />
      </Routes>
    </div>
  );
}

export default App;
