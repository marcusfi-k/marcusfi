import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../services/authService';
import './LoginModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faXmark, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/userSlice';

const LoginModal = ({ closeForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      password: Yup.string().required('Required')
    }),
    onSubmit: async (values) => {
      try {
        const { user } = await login(values); // Đảm bảo chỉ lấy thông tin người dùng từ hàm login
        dispatch(setUser(user)); // Lưu thông tin người dùng vào Redux state
        closeForm();
        toast.success('Login successful!');
        navigate('/');
      } catch (error) {
        toast.error(error.response ? error.response.data.message : 'An error occurred. Please try again.');
        console.error('Error during login:', error);
      }
    }
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-modal__overlay" onClick={closeForm}>
      <div className="login-modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal__close-button-container">
          <button className="login-modal__close-button" onClick={closeForm}><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <div className="login-modal__form">
          <div className="login-modal__title-container">
            <h2 className="login-modal__title">Login</h2>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="login-modal__auth-input-container">
              <div className="login-modal__input-icon-container">
                <FontAwesomeIcon icon={faUser} className="login-modal__input-icon" />
              </div>
              <input
                type="text"
                className="login-modal__auth-input"
                placeholder="Username"
                {...formik.getFieldProps('username')}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="login-modal__error-message">{formik.errors.username}</div>
              ) : null}
            </div>
            <div className="login-modal__auth-input-container">
              <div className="login-modal__input-icon-container">
                <FontAwesomeIcon icon={faLock} className="login-modal__input-icon" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-modal__auth-input"
                placeholder="Password"
                {...formik.getFieldProps('password')}
              />
              <div className="login-modal__password-toggle-icon-container" onClick={toggleShowPassword}>
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="login-modal__password-toggle-icon"
                />
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="login-modal__error-message">{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="login-modal__forgot-password-container">
              <a href="#" className="login-modal__forgot-password-link">Forgot password?</a>
            </div>
            <div className="login-modal__button-container">
              <button type="submit" className="login-modal__auth-button login-modal__auth-button--primary">Login</button>
            </div>
          </form>
          <div className="login-modal__additional-options">
            <p className="login-modal__toggle-form-text">Don't have an account? <span className="login-modal__toggle-form-link" onClick={closeForm}>Sign Up</span></p>
            <div className="login-modal__separator-container">
              <hr className="login-modal__separator" />
            </div>
            <p className="login-modal__toggle-form-text">Or</p>
            <div className="login-modal__button-container">
              <button className="login-modal__auth-button login-modal__auth-button--google">
                <FontAwesomeIcon icon={faGoogle} />
                Login With Google
              </button>
            </div>
            <div className="login-modal__button-container">
              <button className="login-modal__auth-button login-modal__auth-button--facebook">
                <FontAwesomeIcon icon={faFacebookF} />
                Login With Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
