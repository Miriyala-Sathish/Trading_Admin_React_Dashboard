import { useState } from 'react';
import CountUp from 'react-countup';

const DailyDemoSubscribers = () => {
    // State for filters
    const [selectedTimeRange, setSelectedTimeRange] = useState('Today');
    const [selectedSource, setSelectedSource] = useState('All');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [selectedDevice, setSelectedDevice] = useState('All');

    // Primary Data (May 14, 2025 baseline)
    const todaySignupsMay14 = 173; // +173 on May 14, 2025
    const yesterdaySignupsMay13 = 160; // May 13
    const lastUpdated = "May 28, 2025, 03:50 PM IST"; // Updated to current date and time

    // Daily Signups Over the Past 7 Days (May 8-14)
    const dailySignups = [
        { day: "May 8, 2025", signups: 145 },
        { day: "May 9, 2025", signups: 150 },
        { day: "May 10, 2025", signups: 140 },
        { day: "May 11, 2025", signups: 135 },
        { day: "May 12, 2025", signups: 155 },
        { day: "May 13, 2025", signups: 160 },
        { day: "May 14, 2025", signups: 173 },
    ];

    // Signup Sources Breakdown (May 14, 2025)
    const signupSources = {
        "Organic/Google": 70,
        "Social Media": 50,
        Referral: 30,
        Ads: 23,
        All: 173,
    };

    // Geographic Breakdown (May 14, 2025)
    const geoBreakdown = {
        Asia: 80,
        Europe: 50,
        "North America": 30,
        Others: 13,
        All: 173,
    };

    // Device Breakdown (Hypothetical for May 14, 2025)
    const deviceBreakdown = {
        Desktop: 90,  // ~52%
        Mobile: 70,   // ~40%
        Tablet: 13,   // ~8%
        All: 173,
    };

    // Dynamic Calculations Based on Filters
    // 1. Base Signups based on selectedTimeRange
    let baseSignups, growthPercentage;
    if (selectedTimeRange === 'Today') {
        baseSignups = todaySignupsMay14;
        growthPercentage = ((todaySignupsMay14 - yesterdaySignupsMay13) / yesterdaySignupsMay13 * 100).toFixed(1); // +8.2%
    } else if (selectedTimeRange === 'Last 7 Days') {
        baseSignups = dailySignups.reduce((sum, d) => sum + d.signups, 0); // 145 + 150 + 140 + 135 + 155 + 160 + 173 = 1058
        const previous7DaysSignups = 950; // Hypothetical, assuming a slight decrease
        growthPercentage = ((baseSignups - previous7DaysSignups) / previous7DaysSignups * 100).toFixed(1); // +11.4%
    } else if (selectedTimeRange === 'Last 30 Days') {
        baseSignups = 4500; // Hypothetical, based on ~150 average daily signups
        const previous30DaysSignups = 4200; // Hypothetical, assuming a slight increase
        growthPercentage = ((baseSignups - previous30DaysSignups) / previous30DaysSignups * 100).toFixed(1); // +7.1%
    } else {
        // Custom Date Range (placeholder)
        baseSignups = todaySignupsMay14;
        growthPercentage = ((todaySignupsMay14 - yesterdaySignupsMay13) / yesterdaySignupsMay13 * 100).toFixed(1);
    }

    // 2. Adjust Signups based on selectedSource
    let filteredSignups = selectedSource === 'All' ? baseSignups : (baseSignups * (signupSources[selectedSource] / signupSources.All));
    filteredSignups = Math.round(filteredSignups);

    // 3. Adjust Signups based on selectedRegion
    filteredSignups = selectedRegion === 'All' ? filteredSignups : (filteredSignups * (geoBreakdown[selectedRegion] / geoBreakdown.All));
    filteredSignups = Math.round(filteredSignups);

    // 4. Adjust Signups based on selectedDevice
    filteredSignups = selectedDevice === 'All' ? filteredSignups : (filteredSignups * (deviceBreakdown[selectedDevice] / deviceBreakdown.All));
    filteredSignups = Math.round(filteredSignups);

    // 5. Adjust Growth Percentage (assuming growth scales proportionally)
    const adjustedGrowthPercentage = filteredSignups === baseSignups ? growthPercentage : (growthPercentage * (filteredSignups / baseSignups)).toFixed(1);

    // Conversion Funnel (assumed consistent, but scaled for filtered signups)
    const funnelMetrics = {
        activated: 85, // 85% activated their account
        startedTrading: 60, // 60% started trading
        upgradedToPaid: 20, // 20% upgraded to paid
        abandoned: 15, // 15% abandoned
    };

    // Retention Tracker (assumed consistent)
    const retentionRate = 70; // 70% of demo users returned the next day

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
        doc.setFont('Helvetica', 'normal');

        // Title
        doc.setFontSize(20);
        doc.setTextColor(primaryColor);
        doc.text('Daily Demo Subscribers Report', 20, 20);

        // Subtitle (Filters and Timestamp)
        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text(`Time Range: ${selectedTimeRange}`, 20, 30);
        doc.text(`Source: ${selectedSource}`, 20, 38);
        doc.text(`Region: ${selectedRegion}`, 20, 46);
        doc.text(`Device: ${selectedDevice}`, 20, 54);
        doc.text(`Generated on: ${lastUpdated}`, 20, 62);

        // Section: Demo Signups
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text('Demo Signups', 20, 72);

        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text(`Total Signups: +${filteredSignups.toLocaleString('en-US')}`, 20, 82);
        doc.setTextColor(successColor);
        doc.text(`Growth: +${adjustedGrowthPercentage}%`, 20, 90);

        // Section: Conversion Funnel
        let yPos = 104;
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text('Conversion Funnel', 20, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text(`Activated Account: ${funnelMetrics.activated}%`, 20, yPos);
        yPos += 8;
        doc.text(`Started Trading: ${funnelMetrics.startedTrading}%`, 20, yPos);
        yPos += 8;
        doc.text(`Upgraded to Paid: ${funnelMetrics.upgradedToPaid}%`, 20, yPos);
        yPos += 8;
        doc.text(`Abandoned: ${funnelMetrics.abandoned}%`, 20, yPos);
        yPos += 16;

        // Section: Retention Tracker
        doc.setFontSize(16);
        doc.setTextColor(primaryColor);
        doc.text('Retention Tracker', 20, yPos);
        yPos += 10;

        doc.setFontSize(12);
        doc.setTextColor(textColor);
        doc.text(`${retentionRate}% of demo users returned the next day`, 20, yPos);

        // Footer
        doc.setFontSize(10);
        doc.setTextColor('#666666');
        doc.text('Generated by Admin Dashboard', 20, 280);
        doc.text('Page 1 of 1', 180, 280);

        // Download the PDF
        const fileName = `Daily_Demo_Subscribers_${selectedTimeRange}_${selectedSource}_${selectedRegion}_${selectedDevice}_${lastUpdated.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        doc.save(fileName);
    };

    return (
        <div className="button-content profit-page">
            {/* Banner */}
            <div className="banner">
                <div className="banner-content">
                    <h1>Daily Demo Subscribers Overview</h1>
                    <p>
                        A detailed overview of demo signups.
                    </p>
                </div>
            </div>

            {/* Time-Based Trends & Quick Tools */}
            <div className="controls">
                <div className="filter-group">
                    <label htmlFor="timeRangeSelector">Time Range: </label>
                    <select
                        id="timeRangeSelector"
                        value={selectedTimeRange}
                        onChange={(e) => setSelectedTimeRange(e.target.value)}
                    >
                        <option value="Today">Today</option>
                        <option value="Last 7 Days">Last 7 Days</option>
                        <option value="Last 30 Days">Last 30 Days</option>
                        <option value="Custom">Custom Date Range</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="sourceSelector">Filter by Source: </label>
                    <select
                        id="sourceSelector"
                        value={selectedSource}
                        onChange={(e) => setSelectedSource(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Organic/Google">Organic/Google</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Referral">Referral</option>
                        <option value="Ads">Ads</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="regionSelector">Filter by Region: </label>
                    <select
                        id="regionSelector"
                        value={selectedRegion}
                        onChange={(e) => setSelectedRegion(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Asia">Asia</option>
                        <option value="Europe">Europe</option>
                        <option value="North America">North America</option>
                        <option value="Others">Others</option>
                    </select>
                </div>
                <div className="filter-group">
                    <label htmlFor="deviceSelector">Filter by Device: </label>
                    <select
                        id="deviceSelector"
                        value={selectedDevice}
                        onChange={(e) => setSelectedDevice(e.target.value)}
                    >
                        <option value="All">All</option>
                        <option value="Desktop">Desktop</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Tablet">Tablet</option>
                    </select>
                </div>
                <button className="export-btn" onClick={handleExport}>
                    <ion-icon name="download-outline"></ion-icon> Export Report
                </button>
            </div>

            {/* Demo Signups */}
            <div className="profit-header revenue-header">
                <div className="profit-main">
                    <h2>Demo Signups ({selectedTimeRange})</h2>
                    <div className="profit-amount demo-signups-amount">
                        <CountUp
                            start={0}
                            end={filteredSignups}
                            duration={2.5}
                            prefix="+"
                        />
                    </div>
                    <div className="last-updated">
                        Last Updated: {lastUpdated}
                    </div>
                </div>
                <div className="profit-changes">
                    <div className="change-item">
                        <span>Growth:</span>
                        <span className="change-up">
                            +{adjustedGrowthPercentage}% <ion-icon name="arrow-up-outline"></ion-icon>
                        </span>
                    </div>
                </div>
            </div>

            {/* Conversion Funnel */}
         <div className="funnel-insights-section">
    <div className="conversion-funnel-box">
        <ion-icon name="funnel-outline"></ion-icon>
        <div>
            <h3>Conversion Funnel</h3>
            <p>Activated Account: {funnelMetrics.activated}%</p>
            <p>Started Trading: {funnelMetrics.startedTrading}%</p>
            <p>Upgraded to Paid: {funnelMetrics.upgradedToPaid}%</p>
            <p>Abandoned: {funnelMetrics.abandoned}%</p>
        </div>
    </div>
    <div className="retention-tracker-box">
        <ion-icon name="repeat-outline"></ion-icon>
        <div>
            <h3>Retention Tracker</h3>
            <p>{retentionRate}% of demo users returned the next day</p>
        </div>
    </div>
</div>
        </div>
    );
};

export default DailyDemoSubscribers;