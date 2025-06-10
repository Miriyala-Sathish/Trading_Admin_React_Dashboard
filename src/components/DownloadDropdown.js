import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const DownloadDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const itemsRef = useRef([]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const menu = menuRef.current;
    const items = itemsRef.current;

    // Dropdown menu animation
    gsap.to(menu, {
      height: isDropdownOpen ? 'auto' : 0,
      opacity: isDropdownOpen ? 1 : 0,
      duration: 0.3,
      ease: 'power2.out',
      visibility: isDropdownOpen ? 'visible' : 'hidden',
    });

    // Staggered list item animation
    gsap.fromTo(
      items,
      { opacity: 0, y: 10 },
      {
        opacity: isDropdownOpen ? 1 : 0,
        y: isDropdownOpen ? 0 : 10,
        duration: 0.3,
        stagger: 0.1,
        ease: 'power2.out',
        delay: isDropdownOpen ? 0.1 : 0,
      }
    );

    // Button click animation
    const button = dropdownRef.current.querySelector('.download-btn');
    const arrow = button.querySelector('.arrow');
    gsap.to(button, {
      scale: isDropdownOpen ? 1.05 : 1,
      duration: 0.2,
      ease: 'power2.out',
    });
    gsap.to(arrow, {
      rotation: isDropdownOpen ? 180 : 0,
      duration: 0.3,
      ease: 'power2.out',
    });

    // Hover animations for menu items
    items.forEach((item) => {
      const hoverTimeline = gsap.timeline({ paused: true });
      hoverTimeline
        .to(item, {
          x: 5,
          backgroundColor: '#f0f0f0',
          duration: 0.2,
          ease: 'power2.out',
        })
        .to(
          item.querySelector('ion-icon'),
          {
            scale: 1.2,
            duration: 0.2,
            ease: 'power2.out',
          },
          0
        );

      item.addEventListener('mouseenter', () => hoverTimeline.play());
      item.addEventListener('mouseleave', () => hoverTimeline.reverse());

      return () => {
        item.removeEventListener('mouseenter', () => hoverTimeline.play());
        item.removeEventListener('mouseleave', () => hoverTimeline.reverse());
      };
    });
  }, [isDropdownOpen]);

  // Dummy data generation functions (all as PDFs)
  const generateDailyTradeReport = () => {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      console.error('jsPDF not found. Please include the jsPDF library.');
      alert('Failed to generate PDF: jsPDF library not loaded.');
      return null;
    }
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Daily Trade Report', 20, 20);
    doc.setFontSize(12);
    doc.text('Generated on: May 27, 2025', 20, 30);
    
    // Table data
    const headers = ['Date', 'Symbol', 'Action', 'Quantity', 'Price', 'Total'];
    const data = [
      ['2025-05-27', 'AAPL', 'Buy', '100', '$150.25', '$15,025.00'],
      ['2025-05-27', 'GOOGL', 'Sell', '50', '$2,750.10', '$137,505.00'],
      ['2025-05-26', 'TSLA', 'Buy', '200', '$900.75', '$180,150.00'],
    ];
    
    // Simple table rendering
    let y = 40;
    doc.setFontSize(10);
    doc.text(headers.join('  '), 20, y);
    y += 10;
    data.forEach(row => {
      doc.text(row.join('  '), 20, y);
      y += 10;
    });
    
    return doc.output('blob');
  };

  const generateTaxSummary = () => {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      console.error('jsPDF not found. Please include the jsPDF library.');
      alert('Failed to generate PDF: jsPDF library not loaded.');
      return null;
    }
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Tax Summary Report', 20, 20);
    doc.setFontSize(12);
    doc.text('Period: January 2025 - May 2025', 20, 30);
    doc.text('Total Capital Gains: $12,345.67', 20, 40);
    doc.text('Total Dividends: $2,890.12', 20, 50);
    doc.text('Taxable Income: $15,235.79', 20, 60);
    return doc.output('blob');
  };

  const generatePortfolio = () => {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      console.error('jsPDF not found. Please include the jsPDF library.');
      alert('Failed to generate PDF: jsPDF library not loaded.');
      return null;
    }
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Portfolio Report', 20, 20);
    doc.setFontSize(12);
    doc.text('Generated on: May 27, 2025', 20, 30);
    
    // Table data
    const headers = ['Symbol', 'Shares', 'Avg Price', 'Current Price', 'Total Value'];
    const data = [
      ['AAPL', '100', '$145.50', '$150.25', '$15,025.00'],
      ['GOOGL', '50', '$2,700.00', '$2,750.10', '$137,505.00'],
      ['TSLA', '200', '$850.00', '$900.75', '$180,150.00'],
    ];
    
    // Simple table rendering
    let y = 40;
    doc.setFontSize(10);
    doc.text(headers.join('  '), 20, y);
    y += 10;
    data.forEach(row => {
      doc.text(row.join('  '), 20, y);
      y += 10;
    });
    
    return doc.output('blob');
  };

  // Download handler
  const handleDownload = (e, item) => {
    e.preventDefault();
    let blob, fileName;
    if (item.text === 'Daily Trade Report') {
      blob = generateDailyTradeReport();
      fileName = 'daily-trade-report.pdf';
    } else if (item.text === 'Tax Summary') {
      blob = generateTaxSummary();
      fileName = 'tax-summary.pdf';
    } else if (item.text === 'Portfolio') {
      blob = generatePortfolio();
      fileName = 'portfolio.pdf';
    }
    if (blob) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const dropdownItems = [
    {
      href: '#',
      icon: 'calendar-outline',
      text: 'Daily Trade Report',
    },
    {
      href: '#',
      icon: 'document-text-outline',
      text: 'Tax Summary',
    },
    {
      href: '#',
      icon: 'pie-chart-outline',
      text: 'Portfolio',
    },
  ];

  return (
    <div className={`download-dropdown ${isDropdownOpen ? 'open' : ''}`} ref={dropdownRef}>
      <button className="download-btn" onClick={toggleDropdown}>
        <ion-icon name="download-outline"></ion-icon>
        Download Reports
        <ion-icon name="chevron-down-outline" className="arrow"></ion-icon>
      </button>
      <ul className="dropdown-menu" ref={menuRef}>
        {dropdownItems.map((item, index) => (
          <li key={index} ref={(el) => (itemsRef.current[index] = el)}>
            <a href={item.href} onClick={(e) => handleDownload(e, item)}>
              <ion-icon name={item.icon}></ion-icon>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DownloadDropdown;