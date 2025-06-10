import React, { useState, useEffect } from 'react';

const DailyProfit = () => {
    const [dateRange, setDateRange] = useState('Day');
    const [profitType, setProfitType] = useState('Net');
    const [dailyProfit, setDailyProfit] = useState(3500);
    const [hourlyChange, setHourlyChange] = useState(1.8);
    const [dailyChange, setDailyChange] = useState(5.0);
    const [dodGrowth, setDodGrowth] = useState(5.0);
    const [bestTradingHour, setBestTradingHour] = useState({ hour: '14:00', profit: '₹300' });
    const [lossRecoveryPeriod, setLossRecoveryPeriod] = useState('2 hours (May 14, 2025, 10:00-12:00)');

    const getProfitDataForRange = (range) => {
        switch (range) {
            case 'Hour':
                return {
                    dailyProfitGross: 500,
                    dailyProfitNet: 350,
                    hourlyChange: (Math.random() * 10 - 5).toFixed(2),
                    dailyChange: 0,
                    dodGrowth: 0,
                    bestTradingHour: { hour: '17:00', profit: '₹100' },
                    lossRecoveryPeriod: '30 min (May 27, 2025, 16:30-17:00)',
                };
            case 'Day':
                return {
                    dailyProfitGross: 4500,
                    dailyProfitNet: 3500,
                    hourlyChange: (Math.random() * 10 - 5).toFixed(2),
                    dailyChange: (Math.random() * 10 - 5).toFixed(2),
                    dodGrowth: 5.0,
                    bestTradingHour: { hour: '14:00', profit: '₹300' },
                    lossRecoveryPeriod: '2 hours (May 14, 2025, 10:00-12:00)',
                };
            case 'Custom':
                return {
                    dailyProfitGross: 6000,
                    dailyProfitNet: 4500,
                    hourlyChange: (Math.random() * 10 - 5).toFixed(2),
                    dailyChange: (Math.random() * 10 - 5).toFixed(2),
                    dodGrowth: 7.0,
                    bestTradingHour: { hour: '12:00', profit: '₹400' },
                    lossRecoveryPeriod: '3 hours (May 13, 2025, 09:00-12:00)',
                };
            default:
                return {
                    dailyProfitGross: 4500,
                    dailyProfitNet: 3500,
                    hourlyChange: 1.8,
                    dailyChange: 5.0,
                    dodGrowth: 5.0,
                    bestTradingHour: { hour: '14:00', profit: '₹300' },
                    lossRecoveryPeriod: '2 hours (May 14, 2025, 10:00-12:00)',
                };
        }
    };

    useEffect(() => {
        const data = getProfitDataForRange(dateRange);
        setDailyProfit(profitType === 'Net' ? data.dailyProfitNet : data.dailyProfitGross);
        setHourlyChange(data.hourlyChange);
        setDailyChange(data.dailyChange);
        setDodGrowth(data.dodGrowth);
        setBestTradingHour(data.bestTradingHour);
        setLossRecoveryPeriod(data.lossRecoveryPeriod);
    }, [dateRange, profitType]);

    useEffect(() => {
        const interval = setInterval(() => {
            const data = getProfitDataForRange(dateRange);
            setHourlyChange(data.hourlyChange);
            setDailyChange(data.dailyChange);
        }, 2000);

        return () => clearInterval(interval);
    }, [dateRange]);

    const getISTTimeString = () => {
        const options = {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        };

        const formatter = new Intl.DateTimeFormat('en-IN', options);
        const dateParts = formatter.formatToParts(new Date());

        let formattedDate = '';
        for (const part of dateParts) {
            if (part.type !== 'literal') {
                formattedDate += part.value;
            } else if (part.value === ', ') {
                formattedDate += ', ';
            } else {
                formattedDate += part.value;
            }
        }

        return `${formattedDate} IST`;
    };

    const lastUpdated = getISTTimeString();

    const targetProfit = dateRange === 'Hour' ? 200 : dateRange === 'Day' ? 3000 : 4000;
    const actualProfit = dailyProfit;
    const targetAchievement = (actualProfit / targetProfit) * 100;
    const taxEstimate = (dailyProfit * 0.3).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

    const handleExport = () => {
        // Ensure jsPDF is available in the window object
        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            alert('jsPDF library is not loaded. Please ensure it is included in your project.');
            return;
        }

        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        // Colors and Fonts
        const primaryColor = '#3b82f6';
        const textColor = '#333333';
        const successColor = '#16a34a';
        const dangerColor = '#ef4444';
        doc.setFont('Helvetica', 'normal');

        // Title
        doc.setFontSize(20);
        doc.setTextColor(primaryColor);
        doc.text('Daily Profit Report', 20, 20);

        // Subtitle (Date Range and Profit Type)
        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text(`Date Range: ${dateRange} | Profit Type: ${profitType}`, 20, 30);
        doc.text(`Generated on: ${lastUpdated}`, 20, 38);

        // Section: Core Profit Details
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text(`Current Profit (${dateRange})`, 20, 50);

        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text(`Profit: ${dailyProfit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`, 20, 60);

        let yPos = 70;
        doc.setTextColor(hourlyChange >= 0 ? successColor : dangerColor);
        doc.text(`Hour: ${hourlyChange >= 0 ? '+' : ''}${hourlyChange}%`, 20, yPos);
        yPos += 8;

        if (dateRange !== 'Hour') {
            doc.setTextColor(dailyChange >= 0 ? successColor : dangerColor);
            doc.text(`Day: ${dailyChange >= 0 ? '+' : ''}${dailyChange}%`, 20, yPos);
            yPos += 8;
        }

        // Section: Insights/Analysis
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text('Insights & Analysis', 20, yPos + 10);
        yPos += 20;

        doc.setFontSize(12);
        doc.setTextColor(textColor);
        if (dateRange === 'Day' || dateRange === 'Custom') {
            doc.text('Growth Comparison:', 20, yPos);
            doc.text(`Day-over-Day Growth: ${dodGrowth}%`, 30, yPos + 8);
            yPos += 16;
        }
        doc.text('Best Trading Hour:', 20, yPos);
        doc.text(`${bestTradingHour.hour}: ${bestTradingHour.profit}`, 30, yPos + 8);
        yPos += 16;

        doc.text('Loss Recovery Period:', 20, yPos);
        doc.text(lossRecoveryPeriod, 30, yPos + 8);
        yPos += 16;

        // Section: Alerts/Flags
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text('Alerts & Flags', 20, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text(`Profit Spike: +${hourlyChange >= 0 ? hourlyChange : dodGrowth}% this ${dateRange.toLowerCase()}`, 20, yPos);
        yPos += 8;
        doc.text(`Target Achievement: ${targetAchievement.toFixed(1)}% of ${dateRange.toLowerCase()} goal`, 20, yPos);
        yPos += 8;
        doc.text(`Estimated Taxes: ${taxEstimate} (30% of ${profitType} Profit)`, 20, yPos);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor('#666666');
        doc.text('Generated by Admin Dashboard', 20, 280);
        doc.text('Page 1 of 1', 180, 280);

        // Download the PDF
        const fileName = `Daily_Profit_${dateRange}_${profitType}_${lastUpdated.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        doc.save(fileName);
    };

    return (
        <div className="button-content profit-page">
            {/* Banner */}
            <div className="banner">
                <div className="banner-content">
                    <h1>Daily Profit Overview</h1>
                    <p>A detailed overview of your profit.</p>
                </div>
            </div>

            {/* Controls/Filters */}
            <div className="controls">
                <div className="filter-group">
                    <label htmlFor="dateRange">Date Range: </label>
                    <select
                        id="dateRange"
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                    >
                        <option value="Hour">Hour</option>
                        <option value="Day">Day</option>
                        <option value="Custom">Custom</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label>Profit Type: </label>
                    <div className="toggle-switch">
                        <span>Gross</span>
                        <input
                            type="checkbox"
                            id="profitType"
                            checked={profitType === 'Net'}
                            onChange={() => setProfitType(profitType === 'Net' ? 'Gross' : 'Net')}
                        />
                        <label htmlFor="profitType" className="switch"></label>
                        <span>Net</span>
                    </div>
                </div>
                <button className="export-btn" onClick={handleExport}>
                    <ion-icon name="download-outline"></ion-icon> Export Data
                </button>
            </div>

            {/* Core Profit Details */}
            <div className="profit-header">
                <div className="profit-main">
                    <h2>Current Profit ({dateRange})</h2>
                    <div className="profit-amount">
                        {dailyProfit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </div>
                    <div className="last-updated">
                        Last Updated: {lastUpdated}
                    </div>
                </div>
                <div className="profit-changes">
                    <div className="change-item">
                        <span>Hour:</span>
                        <span className={hourlyChange >= 0 ? 'change-up' : 'change-down'}>
                            {hourlyChange >= 0 ? '+' : ''}{hourlyChange}%
                            <ion-icon name={hourlyChange >= 0 ? 'arrow-up-outline' : 'arrow-down-outline'}></ion-icon>
                        </span>
                    </div>
                    {dateRange !== 'Hour' && (
                        <div className="change-item">
                            <span>Day:</span>
                            <span className={dailyChange >= 0 ? 'change-up' : 'change-down'}>
                                {dailyChange >= 0 ? '+' : ''}{dailyChange}%
                                <ion-icon name={dailyChange >= 0 ? 'arrow-up-outline' : 'arrow-down-outline'}></ion-icon>
                            </span>
                        </div>
                    )}
                </div>
            </div>

      {/* Insights/Analysis */}
<div className="insights-section">
    {(dateRange === 'Day' || dateRange === 'Custom') && (
        <div className="insight-box">
            <ion-icon name="trending-up-outline"></ion-icon>
            <h3>Growth Comparison</h3>
            <p>Day-over-Day Growth: {dodGrowth}%</p>
        </div>
    )}
    <div className="insight-box">
        <ion-icon name="time-outline"></ion-icon>
        <h3>Best Trading Hour</h3>
        <p>{bestTradingHour.hour}: {bestTradingHour.profit}</p>
    </div>
    <div className="insight-box">
        <ion-icon name="reload-outline"></ion-icon>
        <h3>Loss Recovery Period</h3>
        <p>{lossRecoveryPeriod}</p>
    </div>
</div>

            {/* Alerts/Flags */}
            <div className="alerts-section">
                <div className="alert-box spike">
                    <ion-icon name="warning-outline"></ion-icon>
                    <p>Profit Spike Detected: +{hourlyChange >= 0 ? hourlyChange : dodGrowth}% this {dateRange.toLowerCase()}!</p>
                </div>
                <div className="alert-box target">
                    <ion-icon name="trophy-outline"></ion-icon>
                    <p>Target Achievement: {targetAchievement.toFixed(1)}% of {dateRange.toLowerCase()} goal achieved</p>
                </div>
                <div className="alert-box tax">
                    <ion-icon name="calculator-outline"></ion-icon>
                    <p>Estimated Taxes: {taxEstimate} (30% of {profitType} Profit)</p>
                </div>
            </div>
        </div>
    );
};

export default DailyProfit;