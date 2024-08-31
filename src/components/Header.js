import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faBell, faSignOutAlt, faCaretDown, faCog, faMoon, faBug, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { logout } from '../services/authService';
import { logoutUser } from '../store/userSlice';
import logo from '../assets/images/default/logo_marcusfi.png';
import '../assets/styles/variables.css';
import '../assets/styles/main.css';
import './Header.css';

const Header = ({ showLoginModal, showRegisterModal }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest('.header__profile-avatar') && showMenu) {
      setShowMenu(false);
    }
    if (!e.target.closest('.header__notification-bell') && showNotifications) {
      setShowNotifications(false);
    }
  };

  const handleProfileClick = () => {
    navigate(`/${currentUser.username}`);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLogoutClick = async () => {
    await logout();
    dispatch(logoutUser());
    navigate('/');
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showMenu, showNotifications]);

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications', { withCredentials: true });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <header className="header__container">
      <div className="header__left">
        <div className="header__logo-container">
          <img 
            src={logo} 
            alt="Marcusfi Logo" 
            className="header__logo" 
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="header__search-container">
          <div className="header__search-icon-container">
            <FontAwesomeIcon icon={faSearch} className="header__search-icon" />
          </div>
          <div className="header__search-input-container">
            <input type="text" placeholder="Tìm kiếm trên Marcusfi" className="header__search-input" />
          </div>
        </div>
      </div>
      {currentUser && (
        <div className="header__center">
          <p>Marcusfi</p>
        </div>
      )}
      <div className="header__right">
        {currentUser ? (
          <>
            <div className="header__icon-container header__notification-bell" onClick={toggleNotifications}>
              <FontAwesomeIcon icon={faBell} className="header__icon" />
              {showNotifications && (
                <div className="header__notification-menu">
                  <div className="header__notification-header">
                    <span>Thông báo</span>
                    <span>Đánh dấu đã đọc</span>
                  </div>
                  {notifications.map((notification, index) => (
                    <div key={index} className={`header__notification-item ${notification.read ? '' : 'unread'}`}>
                      <div className="header__notification-content">
                        <img src={notification.icon} alt="Notification Icon" className="header__notification-icon" />
                        <div className="header__notification-text">
                          <p>{notification.message}</p>
                          <span>{notification.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="header__view-all">Xem tất cả thông báo</div>
                </div>
              )}
            </div>
            <div className="header__profile-avatar" onClick={toggleMenu}>
              <div className="header__profile-img-container">
                <img src={currentUser.profileImage} alt="Profile" className="header__profile-img" />
              </div>
              <div className="header__dropdown-icon-container">
                <FontAwesomeIcon icon={faCaretDown} className="header__dropdown-icon" />
              </div>
              {showMenu && (
                <div className="header__profile-menu">
                  <div className="header__profile-menu-header" onClick={handleProfileClick}>
                    <div className="header__profile-info">
                      <img src={currentUser.profileImage} alt="Profile" className="header__profile-img-large" />
                      <span className="header__user-name">{currentUser.displayName}</span>
                    </div>
                  </div>
                  <div className="header__menu-links">
                    <Link to={`/${currentUser.username}`} className="header__menu-item">
                      <div className="header__icon-bg"><FontAwesomeIcon icon={faUser} /></div> Profile
                    </Link>
                    <Link to="/usersettings" className="header__menu-item">
                      <div className="header__icon-bg"><FontAwesomeIcon icon={faCog} /></div> Cài đặt & quyền riêng tư
                    </Link>
                    <Link to="/usersettings" className="header__menu-item">
                      <div className="header__icon-bg"><FontAwesomeIcon icon={faMoon} /></div> Giao diện
                    </Link>
                    <Link to="/usersettings" className="header__menu-item">
                      <div className="header__icon-bg"><FontAwesomeIcon icon={faBug} /></div> Đóng góp ý kiến
                    </Link>
                    <div className="header__menu-item" onClick={handleLogoutClick}>
                      <div className="header__icon-bg"><FontAwesomeIcon icon={faSignOutAlt} /></div> Đăng xuất
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="header__button-container">
              <button className="header__button header__button--signup" onClick={showRegisterModal}>Đăng ký</button>
            </div>
            <div className="header__button-container">
              <button className="header__button header__button--login" onClick={showLoginModal}>Đăng nhập</button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
