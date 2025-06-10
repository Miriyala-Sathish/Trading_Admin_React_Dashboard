import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import profileImg from '../Images/profile-1.jpg'; // Update path accordingly
import OrderBook from './DetailSection/OrderBook';
import RecentlyWatched from './DetailSection/RecentlyWatched';

const DetailsSection = () => {


  return (
    <div className="details">
    <OrderBook />

   <RecentlyWatched />
    </div>
  );
};

export default DetailsSection;
