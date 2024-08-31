import React from 'react';
import Modal from 'react-modal';
import './TwoFactorAuthModal.scss';

const TwoFactorAuthModal = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="two-factor-auth-modal" overlayClassName="two-factor-auth-modal__overlay">
      <div className="two-factor-auth-modal__content">
        <h2>Two Factor Authentication</h2>
        <p>Please enter the code sent to your device:</p>
        <input type="text" placeholder="Enter code" />
        <button onClick={onConfirm}>Verify</button>
        <button onClick={onRequestClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default TwoFactorAuthModal;
