import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar_admin";

function App() {
  return (
    <Router basename="/Admin_React_Dashboard">
      <Sidebar />
    </Router>
  );
}

export default App;
