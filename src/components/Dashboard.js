import { useState } from 'react';
import { Bar, Doughnut, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import profileImg from '../Images/profile-1.jpg';
import React, { useEffect, useRef } from "react";
import RevenueChart from './RevenueChart';
import gsap from "gsap";
import DashboardCards from './DashboardCards';
import AdminCharts from './AdminCharts';
import GoalInsights from './GoalInsights';
import DownloadDropdown from './DownloadDropdown';
import DetailsSection from './DetailsSection';
ChartJS.register(...registerables);

const Dashboard = () => {





  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);



  return (
    <section className="main-dashboard">
   
    <DashboardCards />
    
       <RevenueChart />

  <AdminCharts />

   
   <GoalInsights />

   <DownloadDropdown />

 
   <DetailsSection />
    </section>
  );
};

export default Dashboard;