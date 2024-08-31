import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBookOpenReader, faFireFlameCurved, faWrench } from '@fortawesome/free-solid-svg-icons';
import '../assets/styles/variables.css';
import '../assets/styles/main.css';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar__container">
      <ul className="sidebar__wrapper">
        <div className="sidebar__list">
          <li className="sidebar__item">
            <NavLink 
              to="/" 
              end 
              className={({ isActive }) => isActive ? "sidebar__itemBtn sidebar__item--active" : "sidebar__itemBtn"}
            >
              <FontAwesomeIcon icon={faHome} className="sidebar__icon" />
              <span className="sidebar__text">Trang chủ</span>
            </NavLink>
          </li>
          <li className="sidebar__item">
            <NavLink 
              to="/content" 
              className={({ isActive }) => isActive ? "sidebar__itemBtn sidebar__item--active" : "sidebar__itemBtn"}
            >
              <FontAwesomeIcon icon={faBookOpenReader} className="sidebar__icon" />
              <span className="sidebar__text">Nội dung</span>
            </NavLink>
          </li>
          <li className="sidebar__item">
            <NavLink 
              to="/motivation" 
              className={({ isActive }) => isActive ? "sidebar__itemBtn sidebar__item--active" : "sidebar__itemBtn"}
            >
              <FontAwesomeIcon icon={faFireFlameCurved} className="sidebar__icon" />
              <span className="sidebar__text">Truyền lửa</span>
            </NavLink>
          </li>
          <li className="sidebar__item">
            {/* Chú thích: Đường dẫn đã được cập nhật */}
            <NavLink 
              to="/tools"
              className={({ isActive }) => isActive ? "sidebar__itemBtn sidebar__item--active" : "sidebar__itemBtn"}
            >
              <FontAwesomeIcon icon={faWrench} className="sidebar__icon" />
              <span className="sidebar__text">Tools</span>
            </NavLink>
          </li>
        </div>
      </ul>
    </div>
  );
}

export default Sidebar;
