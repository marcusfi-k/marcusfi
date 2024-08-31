import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h1>Welcome to Our Service</h1>
        <p>Enter your email to get started</p>
        <div className="email-input-container">
          <input type="email" placeholder="Enter your email" className="email-input" />
          <button className="get-started-button">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
