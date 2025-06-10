import React, { useRef, useEffect } from "react";
import { Doughnut, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import { motion, useAnimationControls } from "framer-motion";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const AdminCharts = () => {
  const chartRefs = useRef([]);
  const controls = useAnimationControls();

  useEffect(() => {
    // Animate cards on mount with stagger
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99], delay: i * 0.2 },
    }));

    // Animate chart elements
    chartRefs.current.forEach((chart, index) => {
      if (!chart) return;
      if (index === 2) {
        // Line chart: Animate points and line
        const points = chart.canvas.getElementsByClassName('chartjs-point');
        const line = chart.canvas.getElementsByClassName('chartjs-line');
        controls.start({
          scale: 1,
          opacity: 1,
          transition: { duration: 1, ease: [0.4, 0, 0.2, 1], staggerChildren: 0.1 },
        });
      } else {
        // Doughnut/Pie: Animate segments
        const segments = chart.canvas.getElementsByClassName('chartjs-arc');
        controls.start({
          scale: 1,
          rotate: 0,
          opacity: 1,
          transition: { duration: 1, ease: [0.6, -0.05, 0.01, 0.99], staggerChildren: 0.15 },
        });
      }
    });
  }, [controls]);

  const donutData = {
    labels: ["Equity", "Derivatives", "Crypto", "Mutual Funds"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#4CAF50", "#2196F3", "#FF9800", "#9C27B0"],
        hoverBackgroundColor: ["#66BB6A", "#42A5F5", "#FFB300", "#AB47BC"],
      },
    ],
  };

  const pieData = {
    labels: ["Retail Traders", "Institutional", "HNIs", "Others"],
    datasets: [
      {
        data: [60, 25, 10, 5],
        backgroundColor: ["#3F51B5", "#E91E63", "#FF5722", "#00BCD4"],
        hoverBackgroundColor: ["#5C6BC0", "#F06292", "#FF7043", "#26C6DA"],
      },
    ],
  };

  const lineData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Trade Volume",
        data: [120, 180, 160, 210, 200, 150, 190],
        fill: false,
        borderColor: "#4CAF50",
        pointBackgroundColor: "#4CAF50",
        pointHoverBackgroundColor: "#66BB6A",
        tension: 0.4,
      },
    ],
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99], delay: i * 0.2 },
    }),
    hover: {
      scale: 1.03,
      boxShadow: "0 0 20px rgba(0, 255, 255, 0.4)",
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <div className="admin-charts-grid">
      <motion.div
        className="chart-card"
        custom={0}
        initial="hidden"
        animate={controls}
        variants={cardVariants}
        whileHover="hover"
      >
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Portfolio Allocation
        </motion.h3>
        <Doughnut
          ref={(el) => (chartRefs.current[0] = el)}
          data={donutData}
          options={{
            responsive: true,
            cutout: "70%",
            animation: { duration: 0 }, // Disable Chart.js animation
            plugins: {
              legend: { position: "bottom" },
            },
          }}
        />
      </motion.div>

      <motion.div
        className="chart-card"
        custom={1}
        initial="hidden"
        animate={controls}
        variants={cardVariants}
        whileHover="hover"
      >
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Client Distribution
        </motion.h3>
        <Pie
          ref={(el) => (chartRefs.current[1] = el)}
          data={pieData}
          options={{
            responsive: true,
            animation: { duration: 0 }, // Disable Chart.js animation
            plugins: {
              legend: { position: "bottom" },
            },
          }}
        />
      </motion.div>

      <motion.div
        className="chart-card"
        custom={2}
        initial="hidden"
        animate={controls}
        variants={cardVariants}
        whileHover="hover"
      >
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Daily Trade Volume
        </motion.h3>
        <Line
          ref={(el) => (chartRefs.current[2] = el)}
          data={lineData}
          options={{
            responsive: true,
            animation: { duration: 0 }, // Disable Chart.js animation
            plugins: {
              legend: { display: false },
            },
            scales: {
              y: { beginAtZero: true, grid: { color: "rgba(0, 0, 0, 0.1)" } },
              x: { grid: { display: false } },
            },
          }}
        />
      </motion.div>
    </div>
  );
};

export default AdminCharts;