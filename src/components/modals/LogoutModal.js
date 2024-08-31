import React from 'react';
import { logout } from '../../services/authService';
import { useHistory } from 'react-router-dom';
import './LogoutModal.scss';

const LogoutModal = ({ isOpen, onClose }) => {
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await logout();
      // Chuyển hướng trang sau khi đăng xuất
      history.push('/login');
      onClose(); // Đóng modal sau khi đăng xuất
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className={`logout-modal__overlay ${isOpen ? 'is-active' : ''}`}>
      <div className="logout-modal__background" onClick={onClose}></div>
      <div className="logout-modal__content">
        <div className="logout-modal__box">
          <h1 className="logout-modal__title">Bạn có chắc chắn muốn đăng xuất?</h1>
          <div className="logout-modal__buttons">
            <button className="logout-modal__button logout-modal__button--danger" onClick={handleLogout}>Đăng xuất</button>
            <button className="logout-modal__button" onClick={onClose}>Hủy</button>
          </div>
        </div>
      </div>
      <button className="logout-modal__close-button" aria-label="close" onClick={onClose}></button>
    </div>
  );
};

export default LogoutModal;
