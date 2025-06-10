import { useState, useEffect } from 'react';
import TotalProfitBanner from './TotalProfit/TotalProfitbanner';

const TotalProfit = () => {
    const [dateRange, setDateRange] = useState('Month');
    const [profitType, setProfitType] = useState('Net');
    const [totalProfit, setTotalProfit] = useState(500000);
    const [dailyChange, setDailyChange] = useState(2.5);
    const [weeklyChange, setWeeklyChange] = useState(-1.8);
    const [monthlyChange, setMonthlyChange] = useState(15.0);
    const [yoyGrowth, setYoyGrowth] = useState(20.5);
    const [momGrowth, setMomGrowth] = useState(15.0);
    const [bestTradingDay, setBestTradingDay] = useState({ date: 'Mar 10, 2025', profit: '₹30,000' });
    const [lossRecoveryPeriod, setLossRecoveryPeriod] = useState('7 days (Apr 20 - Apr 27, 2025)');

    const getProfitDataForRange = (range) => {
        switch (range) {
            case 'Day':
                return {
                    totalProfitGross: 25000,
                    totalProfitNet: 20000,
                    dailyChange: (Math.random() * 10 - 5).toFixed(2),
                    weeklyChange: 0,
                    monthlyChange: 0,
                    yoyGrowth: 0,
                    momGrowth: 0,
                    bestTradingDay: { date: 'May 27, 2025', profit: '₹5,000' },
                    lossRecoveryPeriod: '1 day (May 26, 2025)',
                };
            case 'Week':
                return {
                    totalProfitGross: 150000,
                    totalProfitNet: 120000,
                    dailyChange: (Math.random() * 10 - 5).toFixed(2),
                    weeklyChange: (Math.random() * 10 - 5).toFixed(2),
                    monthlyChange: 0,
                    yoyGrowth: 0,
                    momGrowth: 0,
                    bestTradingDay: { date: 'May 20, 2025', profit: '₹15,000' },
                    lossRecoveryPeriod: '3 days (May 18 - May 20, 2025)',
                };
            case 'Month':
                return {
                    totalProfitGross: 650000,
                    totalProfitNet: 500000,
                    dailyChange: (Math.random() * 10 - 5).toFixed(2),
                    weeklyChange: (Math.random() * 10 - 5).toFixed(2),
                    monthlyChange: (Math.random() * 10 - 5).toFixed(2),
                    yoyGrowth: 20.5,
                    momGrowth: 15.0,
                    bestTradingDay: { date: 'Mar 10, 2025', profit: '₹30,000' },
                    lossRecoveryPeriod: '7 days (Apr 20 - Apr 27, 2025)',
                };
            case 'Total':
                return {
                    totalProfitGross: 800000,
                    totalProfitNet: 600000,
                    dailyChange: (Math.random() * 10 - 5).toFixed(2),
                    weeklyChange: (Math.random() * 10 - 5).toFixed(2),
                    monthlyChange: (Math.random() * 10 - 5).toFixed(2),
                    yoyGrowth: 25.0,
                    momGrowth: 18.0,
                    bestTradingDay: { date: 'Jan 15, 2025', profit: '₹40,000' },
                    lossRecoveryPeriod: '10 days (Jan 5 - Jan 15, 2025)',
                };
            default:
                return {
                    totalProfitGross: 650000,
                    totalProfitNet: 500000,
                    dailyChange: 2.5,
                    weeklyChange: -1.8,
                    monthlyChange: 15.0,
                    yoyGrowth: 20.5,
                    momGrowth: 15.0,
                    bestTradingDay: { date: 'Mar 10, 2025', profit: '₹30,000' },
                    lossRecoveryPeriod: '7 days (Apr 20 - Apr 27, 2025)',
                };
        }
    };

    useEffect(() => {
        const data = getProfitDataForRange(dateRange);
        setTotalProfit(profitType === 'Net' ? data.totalProfitNet : data.totalProfitGross);
        setDailyChange(data.dailyChange);
        setWeeklyChange(data.weeklyChange);
        setMonthlyChange(data.monthlyChange);
        setYoyGrowth(data.yoyGrowth);
        setMomGrowth(data.momGrowth);
        setBestTradingDay(data.bestTradingDay);
        setLossRecoveryPeriod(data.lossRecoveryPeriod);
    }, [dateRange, profitType]);

    useEffect(() => {
        const interval = setInterval(() => {
            const data = getProfitDataForRange(dateRange);
            setDailyChange(data.dailyChange);
            setWeeklyChange(data.weeklyChange);
            setMonthlyChange(data.monthlyChange);
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

    const targetProfit = dateRange === 'Day' ? 15000 : dateRange === 'Week' ? 100000 : 400000;
    const actualProfit = totalProfit;
    const progressPercentage = (actualProfit / targetProfit) * 100;

    const monthlyTarget = targetProfit;
    const targetAchievement = (totalProfit / monthlyTarget) * 100;
    const taxEstimate = (totalProfit * 0.3).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });

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
        doc.text('Total Profit Report', 20, 20);

        // Subtitle (Date Range and Profit Type)
        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text(`Date Range: ${dateRange} | Profit Type: ${profitType}`, 20, 30);
        doc.text(`Generated on: ${lastUpdated}`, 20, 38);

        // Section: Core Profit Details
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text('Core Profit Details', 20, 50);

        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text(`Current Total Profit: ${totalProfit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}`, 20, 60);

        let yPos = 70;
        if (dateRange !== 'Day') {
            doc.setTextColor(monthlyChange >= 0 ? successColor : dangerColor);
            doc.text(`Month: ${monthlyChange >= 0 ? '+' : ''}${monthlyChange}%`, 20, yPos);
            yPos += 8;
        }
        if (dateRange !== 'Day' && dateRange !== 'Week') {
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
        if (dateRange === 'Month' || dateRange === 'Total') {
            doc.text('Growth Comparison:', 20, yPos);
            doc.text(`YOY Growth: ${yoyGrowth}%`, 30, yPos + 8);
            doc.text(`MOM Growth: ${momGrowth}%`, 30, yPos + 16);
            yPos += 24;
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
        doc.text(`Profit Spike: +${monthlyChange >= 0 ? monthlyChange : momGrowth}% this ${dateRange.toLowerCase()}`, 20, yPos);
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
        const fileName = `Total_Profit_${dateRange}_${profitType}_${lastUpdated.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        doc.save(fileName);
    };

    return (
        <div className="button-content total-profit">
            {/* Banner */}
            <TotalProfitBanner />

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
                        <option value="Total">Total</option>
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
                    <h2>Current Total Profit</h2>
                    <div className="profit-amount">
                        {totalProfit.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                    </div>
                    <div className="last-updated">
                        Last Updated: {lastUpdated}
                    </div>
                </div>
                <div className="profit-changes">
                    {dateRange !== 'Day' && dateRange !== 'Week' && (
                        <div className="change-item">
                            <span>Month:</span>
                            <span className={monthlyChange >= 0 ? 'change-up' : 'change-down'}>
                                {monthlyChange >= 0 ? '+' : ''}{monthlyChange}%
                                <ion-icon name={monthlyChange >= 0 ? 'arrow-up-outline' : 'arrow-down-outline'}></ion-icon>
                            </span>
                        </div>
                    )}
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
  {(dateRange === 'Month' || dateRange === 'Total') && (
    <div className="insight-box">
      <ion-icon name="trending-up-outline"></ion-icon>
      <h3>Growth Comparison</h3>
      <p>YOY Growth: {yoyGrowth}%</p>
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
                    <p>Profit Spike Detected: +{monthlyChange >= 0 ? monthlyChange : momGrowth}% this {dateRange.toLowerCase()}!</p>
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

export default TotalProfit;