import React from 'react';
import logo from './logo.svg';
import './App.css';
import Home from './components/Home';

import {
  Routes,
  Route,
} from "react-router-dom";
import Recognized from './components/Recognized';
import Detected from './components/Detected';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/detected" Component={Detected} />
        <Route path="/recognized" Component={Recognized} />
        <Route path="/" Component={Home} />
      </Routes>
    </div>
  );
}

export default App;
