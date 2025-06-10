import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const cards = [
  { amount: "₹12L", name: "Total Equity", icon: "cash-outline", className: "card1" },
  { amount: "8", name: "Open Positions", icon: "analytics-outline", className: "card2" },
  { amount: "120", name: "Orders Executed", icon: "repeat-outline", className: "card3" },
  { amount: "₹23,400", name: "Net P&L", icon: "trending-up-outline", className: "card4" },
];

const DashboardCards = () => {
  const cardRefs = useRef([]);
  const numberRefs = useRef([]);
  const nameRefs = useRef([]);
  const iconRefs = useRef([]);

  // Entry animation on load
  useEffect(() => {
    gsap.fromTo(
      cardRefs.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power4.out",
        stagger: 0.15,
      }
    );
  }, []);

  // Hover animations
  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      const number = numberRefs.current[i];
      const name = nameRefs.current[i];
      const icon = iconRefs.current[i];

      const handleEnter = () => {
        gsap.to(number, {
          y: -8,
          scale: 1.05,
          duration: 0.4,
          ease: "power2.out",
          color: "#fff",
        });
        gsap.to(name, {
          y: 5,
          opacity: 1,
          duration: 0.4,
          delay: 0.1,
          ease: "power2.out",
          color: "#fff",
        });
        gsap.to(icon, {
          rotateZ: 10,
          scale: 1.1,
          duration: 0.4,
          ease: "back.out(1.7)",
          color: "#fff",
        });
      };

      const handleLeave = () => {
        gsap.to([number, name, icon], {
          y: 0,
          scale: 1,
          rotateZ: 0,
          duration: 0.3,
          ease: "power2.inOut",
          color: "",
        });
      };

      card.addEventListener("mouseenter", handleEnter);
      card.addEventListener("mouseleave", handleLeave);

      return () => {
        card.removeEventListener("mouseenter", handleEnter);
        card.removeEventListener("mouseleave", handleLeave);
      };
    });
  }, []);

  return (
    <div className="cardBox">
      {cards.map((item, index) => (
        <div
          key={index}
          className={`card ${item.className}`}
          ref={(el) => (cardRefs.current[index] = el)}
        >
          <div>
            <div
              className="numbers"
              ref={(el) => (numberRefs.current[index] = el)}
            >
              {item.amount}
            </div>
            <div
              className="cardName"
              ref={(el) => (nameRefs.current[index] = el)}
            >
              {item.name}
            </div>
          </div>
          <div
            className="iconBx"
            ref={(el) => (iconRefs.current[index] = el)}
          >
            <ion-icon name={item.icon}></ion-icon>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
