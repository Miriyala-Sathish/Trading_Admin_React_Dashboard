import React, { useState } from 'react';

const OrderBook = () => {
const orders = [
  ['Reliance EQ', '₹2,945', 'Buy', 'delivered', 'Executed'],
  ['INFY EQ', '₹1,450', 'Sell', 'pending', 'Pending'],
  ['TCS EQ', '₹3,210', 'Buy', 'delivered', 'Executed'],
  ['HDFC Bank EQ', '₹1,600', 'Buy', 'inProgress', 'In Progress'],
  ['BTC-INR', '₹48,00,000', 'Buy', 'delivered', 'Executed'],
  ['ETH-INR', '₹3,20,000', 'Sell', 'pending', 'Pending'],
  ['NIFTY FUT', '₹22,400', 'Buy', 'delivered', 'Executed'],
  ['BANKNIFTY FUT', '₹47,800', 'Sell', 'inProgress', 'In Progress'],
  ['ICICI Bank EQ', '₹1,050', 'Buy', 'pending', 'Pending'],
  ['SBIN EQ', '₹585', 'Sell', 'delivered', 'Executed'],
  ['HUL EQ', '₹2,580', 'Buy', 'inProgress', 'In Progress'],
  ['ITC EQ', '₹440', 'Sell', 'pending', 'Pending'],
  ['Adani Ports EQ', '₹820', 'Buy', 'delivered', 'Executed'],
  ['Maruti EQ', '₹9,800', 'Sell', 'inProgress', 'In Progress'],
  ['Wipro EQ', '₹410', 'Buy', 'pending', 'Pending'],
  ['LT EQ', '₹3,100', 'Buy', 'delivered', 'Executed'],
  ['ONGC EQ', '₹165', 'Sell', 'pending', 'Pending'],
  ['Tata Steel EQ', '₹120', 'Buy', 'inProgress', 'In Progress'],
];


  const [expanded, setExpanded] = useState(false);
  const visibleOrders = expanded ? orders : orders.slice(0, 9);

  const toggleExpand = (e) => {
    e.preventDefault();
    setExpanded((prev) => !prev);
  };

  return (
    <div className={`recentOrders ${expanded ? 'expanded' : ''}`}>
      <div className="cardHeader">
        <h2>Order Book</h2>
        <button className="btn" onClick={toggleExpand}>
          {expanded ? 'Show Less' : 'View All'}
        </button>
      </div>

      <div className="orderTableWrapper">
        <table>
          <thead>
            <tr>
              <td>Instrument</td>
              <td>Price</td>
              <td>Type</td>
              <td>Status</td>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.map(([name, price, type, statusClass, statusText], idx) => (
              <tr key={idx}>
                <td>{name}</td>
                <td>{price}</td>
                <td>{type}</td>
                <td><span className={`status ${statusClass}`}>{statusText}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderBook;
