import { HashRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar_admin";

function App() {
  return (
    <Router>
      <Sidebar />
    </Router>
  );
}

export default App;
