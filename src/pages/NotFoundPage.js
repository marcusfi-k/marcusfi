import React from 'react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <div className="not-found__container">
        <h1 className="not-found__title">404</h1>
        <p className="not-found__subtitle">Oops! The page you're looking for doesn't exist.</p>
        <div className="not-found__actions">
          <Link to="/" className="not-found__button not-found__button--home">
            Go to Homepage
          </Link>
          <Link to="/search" className="not-found__button not-found__button--search">
            Search for content
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
