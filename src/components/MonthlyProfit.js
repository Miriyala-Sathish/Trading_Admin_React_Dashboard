import { useState, useEffect } from 'react';

const MonthlyProfit = () => {
    const [dateRange, setDateRange] = useState('Month');
    const [profitType, setProfitType] = useState('Net');
    const [monthlyProfit, setMonthlyProfit] = useState(45000);
    const [dailyChange, setDailyChange] = useState(3.2);
    const [weeklyChange, setWeeklyChange] = useState(10.5);
    const [momGrowth, setMomGrowth] = useState(10.0);
    const [bestTradingDay, setBestTradingDay] = useState({ date: 'May 7, 2025', profit: '₹3,500' });
    const [lossRecoveryPeriod, setLossRecoveryPeriod] = useState('3 days (May 5 - May 8, 2025)');

    const getProfitDataForRange = (range) => {
        switch (range) {
            case 'Day':
                return {
                    monthlyProfitGross: 4000,
                    monthlyProfitNet: 3000,
                    dailyChange: (Math.random() * 10 - 5).toFixed(2),
                    weeklyChange: 0,
                    momGrowth: 0,
                    bestTradingDay: { date: 'May 27, 2025', profit: '₹1,000' },
                    lossRecoveryPeriod: '1 day (May 26, 2025)',
                };
            case 'Week':
                return {
                    monthlyProfitGross: 20000,
                    monthlyProfitNet: 15000,
                    dailyChange: (Math.random() * 10 - 5).toFixed(2),
                    weeklyChange: (Math.random() * 10 - 5).toFixed(2),
                    momGrowth: 0,
                    bestTradingDay: { date: 'May 20, 2025', profit: '₹2,500' },
                    lossRecoveryPeriod: '2 days (May 18 - May 20, 2025)',
                };
            case 'Month':
                return {
                    monthlyProfitGross: 60000,
                    monthlyProfitNet: 45000,
                    dailyChange: (Math.random() * 10 - 5).toFixed(2),
                    weeklyChange: (Math.random() * 10 - 5).toFixed(2),
                    momGrowth: 10.0,
                    bestTradingDay: { date: 'May 7, 2025', profit: '₹3,500' },
                    lossRecoveryPeriod: '3 days (May 5 - May 8, 2025)',
                };
            case 'Custom':
                return {
                    monthlyProfitGross: 80000,
                    monthlyProfitNet: 60000,
                    dailyChange: (Math.random() * 10 - 5).toFixed(2),
                    weeklyChange: (Math.random() * 10 - 5).toFixed(2),
                    momGrowth: 12.0,
                    bestTradingDay: { date: 'Apr 15, 2025', profit: '₹4,000' },
                    lossRecoveryPeriod: '5 days (Apr 10 - Apr 15, 2025)',
                };
            default:
                return {
                    monthlyProfitGross: 60000,
                    monthlyProfitNet: 45000,
                    dailyChange: 3.2,
                    weeklyChange: 10.5,
                    momGrowth: 10.0,
                    bestTradingDay: { date: 'May 7, 2025', profit: '₹3,500' },
                    lossRecoveryPeriod: '3 days (May 5 - May 8, 2025)',
                };
        }
    };

    useEffect(() => {
        const data = getProfitDataForRange(dateRange);
        setMonthlyProfit(profitType === 'Net' ? data.monthlyProfitNet : data.monthlyProfitGross);
        setDailyChange(data.dailyChange);
        setWeeklyChange(data.weeklyChange);
        setMomGrowth(data.momGrowth);
        setBestTradingDay(data.bestTradingDay);
        setLossRecoveryPeriod(data.lossRecoveryPeriod);
    }, [dateRange, profitType]);

    useEffect(() => {
        const interval = setInterval(() => {
            const data = getProfitDataForRange(dateRange);
            setDailyChange(data.dailyChange);
            setWeeklyChange(data.weeklyChange);
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

    const targetProfit = dateRange === 'Day' ? 2000 : dateRange === 'Week' ? 10000 : 40000;
    const actualProfit = monthlyProfit;
    const targetAchievement = (actualProfit / targetProfit) * 100;
    const taxEstimate = (monthlyProfit * 0.3).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

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
        doc.text('Monthly Profit Report', 20, 20);

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
        doc.text(`Profit: ${monthlyProfit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`, 20, 60);

        let yPos = 70;
        if (dateRange !== 'Day') {
            doc.setTextColor(weeklyChange >= 0 ? successColor : dangerColor);
            doc.text(`Week: ${weeklyChange >= 0 ? '+' : ''}${weeklyChange}%`, 20, yPos);
            yPos += 8;
        }
        doc.setTextColor(dailyChange >= 0 ? successColor : dangerColor);
        doc.text(`Day: ${dailyChange >= 0 ? '+' : ''}${dailyChange}%`, 20, yPos);
        yPos += 10;

        // Section: Insights/Analysis
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text('Insights & Analysis', 20, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.setTextColor(textColor);
        if (dateRange === 'Month' || dateRange === 'Custom') {
            doc.text('Growth Comparison:', 20, yPos);
            doc.text(`MOM Growth: ${momGrowth}%`, 30, yPos + 8);
            yPos += 16;
        }
        doc.text('Best Trading Day:', 20, yPos);
        doc.text(`${bestTradingDay.date}: ${bestTradingDay.profit}`, 30, yPos + 8);
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
        doc.text(`Profit Spike: +${weeklyChange >= 0 ? weeklyChange : momGrowth}% this ${dateRange.toLowerCase()}`, 20, yPos);
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
        const fileName = `Monthly_Profit_${dateRange}_${profitType}_${lastUpdated.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        doc.save(fileName);
    };

    return (
        <div className="button-content profit-page">
            {/* Banner */}
            <div className="banner">
                <div className="banner-content">
                    <h1>Monthly Profit Overview</h1>
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
                        <option value="Day">Day</option>
                        <option value="Week">Week</option>
                        <option value="Month">Month</option>
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
                        {monthlyProfit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </div>
                    <div className="last-updated">
                        Last Updated: {lastUpdated}
                    </div>
                </div>
                <div className="profit-changes">
                    {dateRange !== 'Day' && (
                        <div className="change-item">
                            <span>Week:</span>
                            <span className={weeklyChange >= 0 ? 'change-up' : 'change-down'}>
                                {weeklyChange >= 0 ? '+' : ''}{weeklyChange}%
                                <ion-icon name={weeklyChange >= 0 ? 'arrow-up-outline' : 'arrow-down-outline'}></ion-icon>
                            </span>
                        </div>
                    )}
                    <div className="change-item">
                        <span>Day:</span>
                        <span className={dailyChange >= 0 ? 'change-up' : 'change-down'}>
                            {dailyChange >= 0 ? '+' : ''}{dailyChange}%
                            <ion-icon name={dailyChange >= 0 ? 'arrow-up-outline' : 'arrow-down-outline'}></ion-icon>
                        </span>
                    </div>
                </div>
            </div>

        {/* Insights/Analysis */}
<div className="insights-section">
    {(dateRange === 'Month' || dateRange === 'Custom') && (
        <div className="insight-box">
            <ion-icon name="trending-up-outline"></ion-icon>
            <h3>Growth Comparison</h3>
            <p>MOM Growth: {momGrowth}%</p>
        </div>
    )}
    <div className="insight-box">
        <ion-icon name="trophy-outline"></ion-icon>
        <h3>Best Trading Day</h3>
        <p>{bestTradingDay.date}: {bestTradingDay.profit}</p>
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
                    <p>Profit Spike Detected: +{weeklyChange >= 0 ? weeklyChange : momGrowth}% this {dateRange.toLowerCase()}!</p>
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

export default MonthlyProfit;