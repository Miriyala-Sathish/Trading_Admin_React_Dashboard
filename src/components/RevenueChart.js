import React, { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import gsap from "gsap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [{
    label: 'Monthly Revenue (₹)',
    data: [120000, 50000, 130000, 60000, 140000, 75000, 150000, 85000, 110000, 95000, 105000, 100000],
    backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E74C3C', '#3498DB', '#2ECC71', '#9B59B6', '#F39C12', '#D35400', '#1ABC9C'],
    borderColor: ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E74C3C', '#3498DB', '#2ECC71', '#9B59B6', '#F39C12', '#D35400', '#1ABC9C'],
    borderWidth: 1,
    hoverBackgroundColor: ['#FF7844', '#44FF68', '#4468FF', '#FFD120', '#9F55BE', '#F85D4D', '#45A9EC', '#3FDD82', '#AC6AC7', '#FFAD23', '#E46511', '#2BCDAD'],
  }]
};

const options = {
  responsive: true,
  animation: {
    duration: 0, // Disable Chart.js native animation to rely on GSAP
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { callback: (value) => '₹' + value.toLocaleString() },
      grid: { color: 'rgba(0, 0, 0, 0.1)' },
    },
    x: {
      title: { display: true, text: 'Monthly Revenue', font: { size: 16 } },
      grid: { display: false },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: { label: (tooltipItem) => '₹' + tooltipItem.raw.toLocaleString() },
    },
  },
  onHover: (event, chartElement) => {
    event.native.target.style.cursor = chartElement.length ? 'pointer' : 'default';
  },
};

const RevenueChart = () => {
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = chartRef.current;
    const ctx = containerRef.current;

    // Entrance animation for the container
   

    // Animate bars with stagger
    if (chart) {
      const bars = chart.canvas.getElementsByClassName('chartjs-bar');
    

 
    }

    // Hover animation for bars
    const handleHover = (event) => {
      if (!chart || !chart.chart) return;
      const elements = chart.chart.getElementsAtEventForMode(
        event,
        'nearest',
        { intersect: true },
        false
      );
      const bars = chart.canvas.getElementsByClassName('chartjs-bar');
  

      if (elements.length > 0) {
        const barIndex = elements[0].index;
        const bar = bars[barIndex];
     
      }
    };

    const handleHoverOut = () => {
      if (!chart) return;
      const bars = chart.canvas.getElementsByClassName('chartjs-bar');
 
    };

    if (chart && chart.canvas) {
      chart.canvas.addEventListener('mousemove', handleHover);
      chart.canvas.addEventListener('mouseout', handleHoverOut);
    }

    // Cleanup event listeners
    return () => {
      if (chart && chart.canvas) {
        chart.canvas.removeEventListener('mousemove', handleHover);
        chart.canvas.removeEventListener('mouseout', handleHoverOut);
      }
    };
  }, []);

  return (
    <div
      className="chart-container"
      ref={containerRef}
      style={{
        
        margin: '2rem auto',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '1rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Bar ref={chartRef} data={revenueData} options={options} />
    </div>
  );
};

export default RevenueChart;