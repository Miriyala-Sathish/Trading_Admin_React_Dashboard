import { useState } from 'react';
import CountUp from 'react-countup';

const DailyPaidSubscribers = () => {
    // State for filters
    const [selectedPlan, setSelectedPlan] = useState('All');
    const [selectedDate, setSelectedDate] = useState('May 14, 2025');

    // Primary Data (May 14, 2025 baseline)
    const may14TotalSubscribers = 4752; // Total subscribers as of May 14, 2025
    const lastUpdated = "May 28, 2025, 03:47 PM IST"; // Updated to current date and time

    // Subscriber Breakdown: By Subscription Plan (used for filtering)
    const subscribersByPlan = {
        labels: ['Basic', 'Pro', 'Elite'],
        datasets: [
            {
                data: [3000, 1200, 552],
                backgroundColor: ['#4a3aff', '#28a745', '#dc3545'],
            },
        ],
    };

    // Daily Net Growth (May 11-14)
    const dailyNetGrowth = [
        { day: "May 11, 2025", growth: 15 },
        { day: "May 12, 2025", growth: 12 },
        { day: "May 13, 2025", growth: 25 },
        { day: "May 14, 2025", growth: 87 },
    ];

    // Dynamic Calculations Based on Filters
    // 1. Total Subscribers and Net Change based on selectedDate
    const dateOrder = ["May 11, 2025", "May 12, 2025", "May 13, 2025", "May 14, 2025"];
    const selectedDateIndex = dateOrder.indexOf(selectedDate);
    const may14Index = dateOrder.indexOf("May 14, 2025");

    // Calculate total subscribers for the selected date by working backward from May 14, 2025
    let currentSubscribers = may14TotalSubscribers;
    const subscriberHistory = [];
    for (let i = may14Index; i >= 0; i--) {
        subscriberHistory[dateOrder[i]] = currentSubscribers;
        if (i > 0) {
            const growth = dailyNetGrowth.find(d => d.day === dateOrder[i]).growth;
            currentSubscribers -= growth;
        }
    }

    const totalSubscribersAllPlans = subscriberHistory[selectedDate] || 0;
    const netChangeAllPlans = dailyNetGrowth.find(d => d.day === selectedDate)?.growth || 0;

    // 2. Total Subscribers based on selectedPlan
    const planSubscribers = {
        Basic: subscribersByPlan.datasets[0].data[0], // 3000
        Pro: subscribersByPlan.datasets[0].data[1],   // 1200
        Elite: subscribersByPlan.datasets[0].data[2], // 552
        All: may14TotalSubscribers,                   // 4752 (May 14, 2025)
    };
    const planProportions = {
        Basic: subscribersByPlan.datasets[0].data[0] / may14TotalSubscribers, // 3000 / 4752 ≈ 0.631
        Pro: subscribersByPlan.datasets[0].data[1] / may14TotalSubscribers,   // 1200 / 4752 ≈ 0.253
        Elite: subscribersByPlan.datasets[0].data[2] / may14TotalSubscribers, // 552 / 4752 ≈ 0.116
        All: 1,
    };
    const totalSubscribers = selectedPlan === 'All' ? totalSubscribersAllPlans : Math.round(totalSubscribersAllPlans * planProportions[selectedPlan]);
    const netChange = selectedPlan === 'All' ? netChangeAllPlans : Math.round(netChangeAllPlans * planProportions[selectedPlan]);

    // 3. Other Metrics
    const dailyChurnRate = 0.05; // 0.05% daily churn (consistent across dates and plans)
    const dailyRevenue = 9000; // ₹9,000 for May 14, 2025
    const revenueHistory = {
        "May 11, 2025": 8500, // Hypothetical, slightly lower
        "May 12, 2025": 8600, // Hypothetical, slightly lower
        "May 13, 2025": 8700, // Hypothetical, slightly lower
        "May 14, 2025": dailyRevenue,
    };
    const selectedRevenue = revenueHistory[selectedDate] || 0;
    const arps = totalSubscribers > 0 ? (selectedRevenue * (planProportions[selectedPlan] || 1) / totalSubscribers).toFixed(2) : 0;
    const ltv = (arps * 365 * 0.92).toFixed(0); // 1 year avg lifespan, 92% renewal
    const renewalRate = 92; // 92%
    const bestPerformingPlan = 'Basic'; // Most subscribed: 3,000
    const subscriberMilestone = 5000; // Next milestone (for "All" plan)
    const trialToPaidConversion = 70; // 70% (assumed consistent daily)
    const inactivityRate = 2; // 2% inactive today (assumed consistent daily)

    const handleExport = () => {
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
        const neutralColor = '#6b7280';
        doc.setFont('Helvetica', 'normal');

        // Title
        doc.setFontSize(20);
        doc.setTextColor(primaryColor);
        doc.text('Daily Paid Subscribers Report', 20, 20);

        // Subtitle (Filters and Timestamp)
        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text(`Plan: ${selectedPlan}`, 20, 30);
        doc.text(`Date: ${selectedDate}`, 20, 38);
        doc.text(`Generated on: ${lastUpdated}`, 20, 46);

        // Section: Primary Data
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text('Primary Data', 20, 56);

        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text(`Total Paid Subscribers: ${totalSubscribers.toLocaleString('en-US')}`, 20, 66);
        doc.setTextColor(successColor);
        doc.text(`Net Change (${selectedDate}): +${netChange}`, 20, 74);
        doc.setTextColor(neutralColor);
        doc.text(`Churn Rate (Daily): ${dailyChurnRate}%`, 20, 82);

        // Section: Insights & Metrics
        let yPos = 96;
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text('Insights & Metrics', 20, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text('Average Revenue Per Subscriber (ARPS):', 20, yPos);
        doc.text(`${parseFloat(arps).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} / subscriber`, 30, yPos + 8);
        yPos += 16;

        doc.text('Lifetime Value (LTV) Estimate:', 20, yPos);
        doc.text(`${parseInt(ltv).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} / subscriber`, 30, yPos + 8);
        yPos += 16;

        doc.text('Subscription Renewal Rate:', 20, yPos);
        doc.text(`${renewalRate}%`, 30, yPos + 8);
        yPos += 16;

        if (selectedPlan === 'All') {
            doc.text('Best Performing Plan:', 20, yPos);
            doc.text(`${bestPerformingPlan}: ${subscribersByPlan.datasets[0].data[0].toLocaleString('en-US')} subscribers`, 30, yPos + 8);
            yPos += 16;
        }

        // Section: Advanced Content
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text('Advanced Content', 20, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.setTextColor(textColor);
        if (selectedPlan === 'All') {
            doc.text('Subscriber Milestones:', 20, yPos);
            doc.text(`Approaching Milestone: ${(subscriberMilestone - totalSubscribers).toLocaleString('en-US')} subscribers to ${subscriberMilestone}!`, 30, yPos + 8);
            yPos += 16;
        }
        doc.text('Trial-to-Paid Conversion Rate (Daily):', 20, yPos);
        doc.text(`${trialToPaidConversion}%`, 30, yPos + 8);
        yPos += 16;

        doc.text('Inactivity Tracker (Daily):', 20, yPos);
        doc.text(`${inactivityRate}% inactive today`, 30, yPos + 8);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor('#666666');
        doc.text('Generated by Admin Dashboard', 20, 280);
        doc.text('Page 1 of 1', 180, 280);

        // Download the PDF
        const fileName = `Daily_Paid_Subscribers_${selectedPlan}_${selectedDate.replace(/[^a-zA-Z0-9]/g, '_')}_${lastUpdated.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        doc.save(fileName);
    };

    return (
        <div className="button-content profit-page">
            {/* Banner */}
            <div className="banner">
                <div className="banner-content">
                    <h1>Daily Paid Subscribers Overview</h1>
                    <p>A detailed overview of Daily paid subscribers.</p>
                </div>
            </div>

            {/* Controls/Filters */}
            <div className="controls">
                <div className="filter-group">
                    <label htmlFor="planSelector">Filter by Plan: </label>
                    <select
                        id="planSelector"
                        value={selectedPlan}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Basic">Basic</option>
                        <option value="Pro">Pro</option>
                        <option value="Elite">Elite</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="dateSelector">Select Date: </label>
                    <select
                        id="dateSelector"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    >
                        <option value="May 14, 2025">May 14, 2025</option>
                        <option value="May 13, 2025">May 13, 2025</option>
                        <option value="May 12, 2025">May 12, 2025</option>
                        <option value="May 11, 2025">May 11, 2025</option>
                    </select>
                </div>
                <button className="export-btn" onClick={handleExport}>
                    <ion-icon name="download-outline"></ion-icon> Export Report
                </button>
            </div>

            {/* Primary Data */}
            <div className="profit-header revenue-header">
                <div className="profit-main">
                    <h2>Total Paid Subscribers ({selectedDate})</h2>
                    <div className="profit-amount subscribers-amount">
                        <CountUp
                            start={0}
                            end={totalSubscribers}
                            duration={2.5}
                            separator=","
                        />
                    </div>
                    <div className="last-updated">
                        Last Updated: {lastUpdated}
                    </div>
                </div>
                <div className="profit-changes">
                    <div className="change-item">
                        <span>Net Change ({selectedDate}):</span>
                        <span className="change-up">
                            +{netChange} <ion-icon name="arrow-up-outline"></ion-icon>
                        </span>
                    </div>
                    <div className="change-item">
                        <span>Churn Rate (Daily):</span>
                        <span className="change-neutral">{dailyChurnRate}%</span>
                    </div>
                </div>
            </div>

             {/* Insights & Metrics */}
<div className="subscription-insights-section">
    <div className="arps-box">
        <ion-icon name="cash-outline"></ion-icon>
        <div>
            <h3>Average Revenue Per Subscriber (ARPS)</h3>
            <p>{parseInt(arps).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} / subscriber</p>
        </div>
    </div>
    <div className="ltv-box">
        <ion-icon name="diamond-outline"></ion-icon>
        <div>
            <h3>Lifetime Value (LTV) Estimate</h3>
            <p>{parseInt(ltv).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} / subscriber</p>
        </div>
    </div>
    <div className="renewal-rate-box">
        <ion-icon name="sync-outline"></ion-icon>
        <div>
            <h3>Subscription Renewal Rate</h3>
            <p>{renewalRate}%</p>
        </div>
    </div>
    {selectedPlan === 'All' && (
        <div className="best-plan-box">
            <ion-icon name="trophy-outline"></ion-icon>
            <div>
                <h3>Best Performing Plan</h3>
                <p>{bestPerformingPlan}: {subscribersByPlan.datasets[0].data[0]} subscribers</p>
            </div>
        </div>
    )}
</div>

        {/* Optional Advanced Content */}
<div className="advanced-insights-section">
    {selectedPlan === 'All' && (
        <div className="subscriber-milestone-box">
            <ion-icon name="flag-outline"></ion-icon>
            <div>
                <h3>Subscriber Milestones</h3>
                <p>Approaching Milestone: {(subscriberMilestone - totalSubscribers).toLocaleString('en-US')} subscribers to {subscriberMilestone}!</p>
            </div>
        </div>
    )}
    <div className="trial-conversion-box">
        <ion-icon name="swap-horizontal-outline"></ion-icon>
        <div>
            <h3>Trial-to-Paid Conversion Rate</h3>
            <p>{trialToPaidConversion}%</p>
        </div>
    </div>
    <div className="inactivity-tracker-box">
        <ion-icon name="timer-outline"></ion-icon>
        <div>
            <h3>Inactivity Tracker</h3>
            <p>{inactivityRate}% inactive in last 30 days</p>
        </div>
    </div>
</div>
        </div>
    );
};

export default DailyPaidSubscribers;