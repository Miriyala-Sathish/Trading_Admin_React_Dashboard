import React from 'react';
import PropTypes from 'prop-types';

import profileImg from '../../Images/profile-1.jpg'; // Update path as needed

const RecentlyWatched = () => {
  const items = [
    ['Reliance', '₹2,945.10'],
    ['Infosys', '₹1,450.55'],
    ['TCS', '₹3,210.30'],
    ['HDFC Bank', '₹1,600.25'],
    ['Bitcoin', '₹48L'],
    ['Ethereum', '₹3.2L'],
    ['NIFTY 50', '₹22,400'],
    ['BANKNIFTY', '₹47,800'],
  ];

  return (
    <div className="recentCustomers" >
      <div className="cardHeader">
        <h2>Recently Watched</h2>
      </div>
      <table>
        <tbody>
          {items.map(([name, price], idx) => (
            <tr key={idx}>
              <td>
                <div className="imgBx">
                  <img src={profileImg} alt={name} />
                </div>
              </td>
              <td>
                <h4>{name}<br /><span>{price}</span></h4>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};



export default RecentlyWatched;
