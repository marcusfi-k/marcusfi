import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { register } from '../../services/authService';
import './RegisterModal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faXmark, faUser, faEnvelope, faPhone, faLock, faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faFacebookF } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, signInWithPopup } from 'firebase/auth';
import { googleProvider, facebookProvider } from '../../firebaseConfig';

const RegisterModal = ({ closeForm }) => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: '', displayName: '', phoneNumber: '', email: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string().required('Required'),
      displayName: Yup.string().required('Required'),
      phoneNumber: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required')
    }),
    onSubmit: async (values) => {
      try {
        const defaultProfileImage = 'https://firebasestorage.googleapis.com/v0/b/marcusfi.appspot.com/o/avatar_marcusfi.png?alt=media&token=5120a15b-8828-4164-ba87-1bae42dca9c4';
        const defaultBackgroundImage = 'https://firebasestorage.googleapis.com/v0/b/marcusfi.appspot.com/o/backgroundImages%2Fmarcusfi_background_default_900_300.png?alt=media&token=2dd4f852-1dfe-456e-933c-ec72be8a3842';

        await register({ ...values, profileImage: defaultProfileImage, backgroundImage: defaultBackgroundImage });
        closeForm();
        toast.success('Registration successful!');
        navigate('/');
      } catch (error) {
        toast.error(error.response ? error.response.data.message : 'An error occurred. Please try again.');
        console.error('Error during registration:', error);
      }
    }
  });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const signInWithGoogle = () => {
    signInWithPopup(getAuth(), googleProvider)
      .then((result) => {
        console.log(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const signInWithFacebook = () => {
    signInWithPopup(getAuth(), facebookProvider)
      .then((result) => {
        console.log(result.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="register-modal__overlay" onClick={closeForm}>
      <div className="register-modal__content" onClick={e => e.stopPropagation()}>
        <div className="register-modal__close-button-container">
          <button className="register-modal__close-button" onClick={closeForm}><FontAwesomeIcon icon={faXmark} /></button>
        </div>
        <div className="register-modal__form">
          <div className="register-modal__title-container">
            <h2 className="register-modal__title">Sign Up</h2>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="register-modal__auth-input-container">
              <div className="register-modal__input-icon-container">
                <FontAwesomeIcon icon={faUser} className="register-modal__input-icon" />
              </div>
              <input
                type="text"
                className="register-modal__auth-input"
                placeholder="Username"
                {...formik.getFieldProps('username')}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="register-modal__error-message">{formik.errors.username}</div>
              ) : null}
            </div>
            <div className="register-modal__auth-input-container">
              <div className="register-modal__input-icon-container">
                <FontAwesomeIcon icon={faIdBadge} className="register-modal__input-icon" />
              </div>
              <input
                type="text"
                className="register-modal__auth-input"
                placeholder="Display Name"
                {...formik.getFieldProps('displayName')}
              />
              {formik.touched.displayName && formik.errors.displayName ? (
                <div className="register-modal__error-message">{formik.errors.displayName}</div>
              ) : null}
            </div>
            <div className="register-modal__auth-input-container">
              <div className="register-modal__input-icon-container">
                <FontAwesomeIcon icon={faPhone} className="register-modal__input-icon" />
              </div>
              <input
                type="text"
                className="register-modal__auth-input"
                placeholder="Phone Number"
                {...formik.getFieldProps('phoneNumber')}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                <div className="register-modal__error-message">{formik.errors.phoneNumber}</div>
              ) : null}
            </div>
            <div className="register-modal__auth-input-container">
              <div className="register-modal__input-icon-container">
                <FontAwesomeIcon icon={faEnvelope} className="register-modal__input-icon" />
              </div>
              <input
                type="email"
                className="register-modal__auth-input"
                placeholder="Email"
                {...formik.getFieldProps('email')}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="register-modal__error-message">{formik.errors.email}</div>
              ) : null}
            </div>
            <div className="register-modal__auth-input-container">
              <div className="register-modal__input-icon-container">
                <FontAwesomeIcon icon={faLock} className="register-modal__input-icon" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="register-modal__auth-input"
                placeholder="Password"
                {...formik.getFieldProps('password')}
              />
              <div className="register-modal__password-toggle-icon-container" onClick={toggleShowPassword}>
                <FontAwesomeIcon
                  icon={showPassword ? faEyeSlash : faEye}
                  className="register-modal__password-toggle-icon"
                />
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="register-modal__error-message">{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="register-modal__button-container">
              <button type="submit" className="register-modal__auth-button register-modal__auth-button--primary">Sign Up</button>
            </div>
          </form>
          <div className="register-modal__additional-options">
            <p className="register-modal__toggle-form-text">Already have an account? <span className="register-modal__toggle-form-link" onClick={closeForm}>Login</span></p>
            <div className="register-modal__separator-container">
              <hr className="register-modal__separator" />
            </div>
            <p className="register-modal__toggle-form-text">Or</p>
            <div className="register-modal__button-container">
              <button className="register-modal__auth-button register-modal__auth-button--google" onClick={signInWithGoogle}>
                <FontAwesomeIcon icon={faGoogle} />
                Sign Up With Google
              </button>
            </div>
            <div className="register-modal__button-container">
              <button className="register-modal__auth-button register-modal__auth-button--facebook" onClick={signInWithFacebook}>
                <FontAwesomeIcon icon={faFacebookF} />
                Sign Up With Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
