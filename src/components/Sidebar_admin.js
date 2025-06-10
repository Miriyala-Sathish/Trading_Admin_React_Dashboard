import React, { useState } from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import MainUsers from './MainUsers';
import DailyDemo from './DailyDemo';
import TotalDemo from './TotalDemo';
import DailyPaid from './DailyPaid';
import TotalPaid from './TotalPaid';
import TotalProfit from './TotalProfit';
import MonthlyProfit from './MonthlyProfit';
import DailyProfit from './DailyProfit';
import MonthlyRevenue from './MonthlyRevenue';
import DailyRevenue from './DailyRevenue';
import MonthlyCommission from './MonthlyCommission';
import DailyCommission from './DailyCommission';
import TotalPaidSubscribers from './TotalPaidSubscribers';
import MonthlyPaidSubscribers from './MonthlyPaidSubscribers';
import DailyPaidSubscribers from './DailyPaidSubscribers';
import DailyDemoSubscribers from './DailyDemoSubscribers';

import ProfileImg from '../Images/profile-1.jpg'; // Update with your actual image path

const Sidebar = () => {
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [lastActiveRoute, setLastActiveRoute] = useState('/dashboard');
  const [activeContent, setActiveContent] = useState('route'); // 'route' or 'button'

  const toggleSidebar = () => {
    setIsSidebarActive(!isSidebarActive);
  };

  const handleButtonClick = (buttonName) => {
    if (activeButton === buttonName) {
      setActiveButton(null);
      setActiveContent('route');
    } else {
      setLastActiveRoute(window.location.pathname);
      setActiveButton(buttonName);
      setActiveContent('button');
    }
  };

  const handleNavLinkClick = (route) => {
    setActiveButton(null);
    setActiveContent('route');
    setLastActiveRoute(route);
  };

  const buttonComponents = {
    'Total Profit': <TotalProfit />,
    'Monthly Profit': <MonthlyProfit />,
    'Daily Profit': <DailyProfit />,
    'Monthly Revenue': <MonthlyRevenue />,
    'Daily Revenue': <DailyRevenue />,
    'Monthly Commission': <MonthlyCommission />,
    'Daily Commission': <DailyCommission />,
    'Total Paid Subscribers': <TotalPaidSubscribers />,
    'Monthly Paid Subscribers': <MonthlyPaidSubscribers />,
    'Daily Paid Subscribers': <DailyPaidSubscribers />,
    'Daily Demo Subscribers': <DailyDemoSubscribers />,
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className={`navigation ${isSidebarActive ? 'active' : ''}`}>
        <ul>
          <li>
            <a href="#">
              <span className="icon">
                <img src={ProfileImg} alt="Profile" />
              </span>
              <div>
                <span className="title name">Miriyala Sathish</span>
                <span className="title1 role">Admin Dashboard</span>
              </div>
            </a>
          </li>
          <li className="nav-item">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-item ${isActive && activeContent === 'route' ? 'active hovered' : ''}`
              }
              onClick={() => handleNavLinkClick('/dashboard')}
            >
              <span className="icon"><ion-icon name="home-outline"></ion-icon></span>
              <span className="title">Dashboard</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/main-users"
              className={({ isActive }) =>
                `nav-item ${isActive && activeContent === 'route' ? 'active hovered' : ''}`
              }
              onClick={() => handleNavLinkClick('/main-users')}
            >
              <span className="icon"><ion-icon name="people-outline"></ion-icon></span>
              <span className="title">Main Users</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/daily-demo"
              className={({ isActive }) =>
                `nav-item ${isActive && activeContent === 'route' ? 'active hovered' : ''}`
              }
              onClick={() => handleNavLinkClick('/daily-demo')}
            >
              <span className="icon"><ion-icon name="trending-up-outline"></ion-icon></span>
              <span className="title">Daily Demo Subs</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/total-demo"
              className={({ isActive }) =>
                `nav-item ${isActive && activeContent === 'route' ? 'active hovered' : ''}`
              }
              onClick={() => handleNavLinkClick('/total-demo')}
            >
              <span className="icon"><ion-icon name="albums-outline"></ion-icon></span>
              <span className="title">Total Demo Subs</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/daily-paid"
              className={({ isActive }) =>
                `nav-item ${isActive && activeContent === 'route' ? 'active hovered' : ''}`
              }
              onClick={() => handleNavLinkClick('/daily-paid')}
            >
              <span className="icon"><ion-icon name="cash-outline"></ion-icon></span>
              <span className="title">Daily Paid Subs</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              to="/total-paid"
              className={({ isActive }) =>
                `nav-item ${isActive && activeContent === 'route' ? 'active hovered' : ''}`
              }
              onClick={() => handleNavLinkClick('/total-paid')}
            >
              <span className="icon"><ion-icon name="card-outline"></ion-icon></span>
              <span className="title">Total Paid Subs</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <a href="#">
              <span className="icon"><ion-icon name="globe-outline"></ion-icon></span>
              <span className="title">Home Page</span>
            </a>
          </li>
          <li>
            <a href="#">
              <span className="icon"><ion-icon name="log-out-outline"></ion-icon></span>
              <span className="title">Sign Out</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className={`main ${isSidebarActive ? 'active' : ''}`}>
        <div className="topbar">
          <div className="toggle" onClick={toggleSidebar}>
            <ion-icon name="menu-outline"></ion-icon>
          </div>
          <div className="button-container">
            {Object.keys(buttonComponents).map((btn) => (
              <button
                key={btn}
                className={activeButton === btn ? 'active hovered' : ''}
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="content-area">
          {activeContent === 'route' ? (
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/main-users" element={<MainUsers />} />
              <Route path="/daily-demo" element={<DailyDemo />} />
              <Route path="/total-demo" element={<TotalDemo />} />
              <Route path="/daily-paid" element={<DailyPaid />} />
              <Route path="/total-paid" element={<TotalPaid />} />
              <Route path="/" element={<Dashboard />} />
            </Routes>
          ) : (
            buttonComponents[activeButton]
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
