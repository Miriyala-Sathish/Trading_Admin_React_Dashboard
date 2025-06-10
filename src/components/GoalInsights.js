import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';


const GoalInsights = () => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start((i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }));
  }, [controls]);

  const progressVariants = {
    hidden: { strokeDasharray: '0 226' },
    visible: (percentage) => ({
      strokeDasharray: `${(percentage / 100) * 226} 226`,
      transition: { duration: 1.5, ease: 'easeInOut' },
    }),
  };

  const goalItems = [
    {
      icon: 'trending_up',
      title: 'Daily Profit',
      value: '₹12,000 / ₹15,000',
      percentage: 80,
      updated: 'Updated Today',
      className: '',
    },
    {
      icon: 'stacked_bar_chart',
      title: 'Monthly Volume',
      value: '₹3.5Cr / ₹5Cr',
      percentage: 70,
      updated: 'This Month',
      className: 'expenses',
    },
    {
      icon: 'emoji_events',
      title: 'Challenge Target',
      value: '₹45,000 / ₹50,000',
      percentage: 90,
      updated: 'Challenge Progress',
      className: 'income',
    },
  ];

  return (
    <div className="insights">
      {goalItems.map((item, index) => (
        <motion.div
          key={index}
          className={`goal-item ${item.className}`}
          custom={index}
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
        >
          <span className="material-icons-sharp">{item.icon}</span>
          <div className="middle">
            <div className="left">
              <h3>{item.title}</h3>
              <h1>{item.value}</h1>
            </div>
            <div className="progress">
              <svg>
                <circle cx="38" cy="38" r="36" className="bg-circle" />
                <motion.circle
                  cx="38"
                  cy="38"
                  r="36"
                  className="progress-circle"
                  initial="hidden"
                  animate="visible"
                  custom={item.percentage}
                  variants={progressVariants}
                />
              </svg>
              <div className="number">
                <p>{item.percentage}%</p>
              </div>
            </div>
          </div>
          <small className="text-muted">{item.updated}</small>
        </motion.div>
      ))}
    </div>
  );
};

export default GoalInsights;