import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store/store';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RegisterModal from './components/modals/RegisterModal';
import LoginModal from './components/modals/LoginModal';
import UserProfilePage from './pages/UserProfilePage';
import Homepage from './pages/HomePage';
import ContentPage from './pages/ContentPage';
import ToolsPage from './pages/ToolsPage'; 
import MotivationPage from './pages/MotivationPage';
import UserSettings from './pages/UserSettings';
import ContentDetailPage from './pages/ContentDetailPage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assets/styles/main.css';
import { logoutUser, setUser } from './store/userSlice';
import { showRegisterModal, showLoginModal, hideModals } from './store/modalSlice';
import { checkAndRenewToken } from './services/authService';

function App() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user.currentUser);
  const isRegisterModalVisible = useSelector(state => state.modal.isRegisterModalVisible);
  const isLoginModalVisible = useSelector(state => state.modal.isLoginModalVisible);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch(setUser(user));
    }
    checkAndRenewToken();
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.info('Bạn đã đăng xuất thành công.');
  };

  return (
    <Provider store={store}>
      <div className="App">
        <div id="root">
          <header className="header__container">
            <Header 
              isLoggedIn={!!currentUser} 
              userName={currentUser?.username} 
              displayName={currentUser?.displayName} 
              profileImage={currentUser?.profileImage || `${process.env.PUBLIC_URL}/noindex/avatars-upload/default-avatar.png`} 
              showRegisterModal={() => dispatch(showRegisterModal())}
              showLoginModal={() => dispatch(showLoginModal())}
              handleLogout={handleLogout}
            />
          </header>
          <div style={{ marginTop: 'var(--header-height)' }}>
            <div className="withSidebar">
              <div className="sidebar__container">
                <Sidebar />
              </div>
              <div className="withSidebar__content">
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/content" element={<ContentPage />} />
                  <Route path="/content/:slug" element={<ContentDetailPage />} />
                  <Route path="/tools" element={<ToolsPage />} />
                  <Route path="/motivation" element={<MotivationPage />} />
                  <Route path="/:username" element={<UserProfilePage />} />
                  <Route path="/usersettings" element={<UserSettings />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
        {isRegisterModalVisible && <RegisterModal closeForm={() => dispatch(hideModals())} />}
        {isLoginModalVisible && <LoginModal closeForm={() => dispatch(hideModals())} />}
        <ToastContainer autoClose={1250} />
      </div>
    </Provider>
  );
}

export default App;
