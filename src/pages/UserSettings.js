import React, { useState, useEffect } from 'react'; // Import React và các hooks useState và useEffect
import Modal from 'react-modal'; // Import Modal từ react-modal
import { toast } from 'react-toastify'; // Import toast từ react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify
import './UserSettings.css'; // Import file SCSS để định dạng style cho UserSettings
import { updateProfile, changePassword, deleteUser } from '../services/userService'; // Import các hàm updateProfile, changePassword, deleteUser từ userService
import { logout } from '../services/authService'; // Import hàm logout từ authService
import Cookies from 'js-cookie'; // Import thư viện js-cookie để thao tác với cookies
import axios from 'axios'; // Import thư viện axios để gửi HTTP request
import { useNavigate } from 'react-router-dom'; // Sử dụng hook useNavigate để chuyển hướng
import { useDispatch, useSelector } from 'react-redux'; // Sử dụng hook useDispatch và useSelector từ Redux
import { logoutUser, setUser } from '../store/userSlice'; // Import hành động logoutUser và setUser từ Redux

const UserSettings = () => {
  const dispatch = useDispatch(); // Khởi tạo hook useDispatch
  const navigate = useNavigate(); // Khởi tạo hook useNavigate

  const user = useSelector((state) => state.user.currentUser); // Sử dụng hook useSelector để lấy thông tin người dùng từ store
  const [userData, setUserData] = useState(user); // Sử dụng state cục bộ để lưu trữ thông tin người dùng
  const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý trạng thái mở/đóng của modal
  const [modalField, setModalField] = useState(''); // State để lưu trữ trường thông tin đang được chỉnh sửa
  const [modalValue, setModalValue] = useState(''); // State để lưu trữ giá trị của trường thông tin đang được chỉnh sửa
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // State để quản lý trạng thái mở/đóng của modal đổi mật khẩu
  const [currentPassword, setCurrentPassword] = useState(''); // State để lưu trữ mật khẩu hiện tại
  const [newPassword, setNewPassword] = useState(''); // State để lưu trữ mật khẩu mới
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // State để lưu trữ xác nhận mật khẩu mới
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false); // State để quản lý trạng thái mở/đóng của modal thông báo không thể thay đổi username
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false); // State để quản lý trạng thái mở/đóng của modal xóa tài khoản
  const [deletePassword, setDeletePassword] = useState(''); // State để lưu trữ mật khẩu hiện tại khi xóa tài khoản
  const [confirmDelete, setConfirmDelete] = useState(''); // State để lưu trữ xác nhận xóa tài khoản

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = Cookies.get('username'); // Lấy username từ cookie
        if (username) {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${username}`, {
            headers: {
              Authorization: `Bearer ${Cookies.get('mat')}`, // Đính kèm access token vào header của request
              'Content-Type': 'application/json'
            },
            withCredentials: true // Đảm bảo cookies được gửi cùng với request
          });
          setUserData(response.data); // Cập nhật state userData với dữ liệu trả về từ server
          dispatch(setUser(response.data)); // Cập nhật thông tin người dùng trong store
        } else {
          toast.error('Không tìm thấy thông tin người dùng'); // Hiển thị thông báo lỗi nếu không tìm thấy username trong cookie
        }
      } catch (error) {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau.'); // Hiển thị thông báo lỗi nếu có lỗi khi lấy thông tin người dùng
        console.error('Error fetching user data:', error); // Log lỗi ra console
      }
    };

    if (!user) { // Nếu user không tồn tại trong store
      fetchUserData(); // Gọi hàm fetchUserData để lấy thông tin người dùng từ server
    } else {
      setUserData(user); // Cập nhật state userData với thông tin user từ store
    }
  }, [dispatch, user]); // Chạy lại effect khi dispatch hoặc user thay đổi

  const handleSave = async () => {
    try {
      const updateData = { ...userData }; // Tạo một bản sao của userData để cập nhật
      const response = await updateProfile(updateData.username, updateData); // Gửi yêu cầu cập nhật hồ sơ người dùng
      setUserData(response); // Cập nhật state userData với dữ liệu phản hồi từ server
      dispatch(setUser(response)); // Cập nhật thông tin người dùng trong store sau khi cập nhật thành công
      toast.success('Thông tin đã được lưu!'); // Hiển thị thông báo thành công
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.'); // Hiển thị thông báo lỗi nếu có lỗi khi lưu thông tin
      console.error('Error saving profile:', error); // Log lỗi ra console
    }
  };

  const openModal = (field, value) => {
    if (field === 'username') { // Nếu trường thông tin là username
      setIsUsernameModalOpen(true); // Mở modal thông báo không thể thay đổi username
      return;
    }
    setModalField(field); // Cập nhật state modalField với trường thông tin đang được chỉnh sửa
    setModalValue(value); // Cập nhật state modalValue với giá trị của trường thông tin đang được chỉnh sửa
    setIsModalOpen(true); // Mở modal chỉnh sửa thông tin
  };

  const closeModal = () => {
    setIsModalOpen(false); // Đóng modal chỉnh sửa thông tin
  };

  const closeUsernameModal = () => {
    setIsUsernameModalOpen(false); // Đóng modal thông báo không thể thay đổi username
  };

  const closeDeleteModal = () => {
    setIsDeleteAccountModalOpen(false); // Đóng modal xóa tài khoản
  };

  const handleModalSave = async () => {
    try {
      const updateData = { [modalField]: modalValue }; // Tạo đối tượng chứa thông tin cập nhật từ modalField và modalValue
      const response = await updateProfile(userData.username, updateData); // Gửi yêu cầu cập nhật hồ sơ người dùng
      setUserData((prevUserData) => ({
        ...prevUserData,
        ...response
      })); // Cập nhật state userData với dữ liệu phản hồi từ server
      dispatch(setUser(response)); // Cập nhật thông tin người dùng trong store sau khi cập nhật thành công
      toast.success('Thông tin đã được lưu!'); // Hiển thị thông báo thành công
      setIsModalOpen(false); // Đóng modal chỉnh sửa thông tin
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại sau.'); // Hiển thị thông báo lỗi nếu có lỗi khi lưu thông tin
      console.error('Error saving profile:', error); // Log lỗi ra console
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmNewPassword) { // Nếu mật khẩu mới và xác nhận mật khẩu không khớp
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp'); // Hiển thị thông báo lỗi
      return;
    }
    try {
      await changePassword(userData.username, { currentPassword, newPassword }); // Gửi yêu cầu thay đổi mật khẩu
      toast.success('Mật khẩu đã được đổi thành công'); // Hiển thị thông báo thành công
      setIsPasswordModalOpen(false); // Đóng modal đổi mật khẩu
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đổi mật khẩu'); // Hiển thị thông báo lỗi nếu có lỗi khi đổi mật khẩu
      console.error('Error changing password:', error); // Log lỗi ra console
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmDelete !== 'confirm') { // Nếu xác nhận xóa tài khoản không khớp
      toast.error('Vui lòng nhập "confirm" để xác nhận'); // Hiển thị thông báo lỗi
      return;
    }

    try {
      await deleteUser(userData.username, deletePassword); // Gửi yêu cầu xóa tài khoản
      toast.success('Tài khoản đã bị xóa'); // Hiển thị thông báo thành công
      // Xóa tất cả cookies và local storage
      Cookies.remove('mat'); // Xóa cookie mat
      Cookies.remove('mrt'); // Xóa cookie mrt
      localStorage.clear(); // Xóa local storage
      sessionStorage.clear(); // Xóa session storage
      // Dispatch hành động logout và chuyển hướng
      dispatch(logoutUser()); // Dispatch hành động logoutUser để cập nhật trạng thái đăng xuất trong store
      navigate('/'); // Chuyển hướng về trang chủ
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa tài khoản'); // Hiển thị thông báo lỗi nếu có lỗi khi xóa tài khoản
      console.error('Error deleting account:', error); // Log lỗi ra console
    }
  };

  return (
    <div className="user-settings main-container">
      <div className="user-settings__content-container">
        <div className="user-settings__settings-page">
          <div className="user-settings__settings-content">
            <h2 className="user-settings__title">Thông tin & Bảo mật</h2>
            <p className="user-settings__description">Quản lý thông tin cá nhân và bảo mật của bạn.</p>
            <div className="user-settings__info-section">
              <h3 className="user-settings__section-title">Thông tin cơ bản</h3>
              <p className="user-settings__section-description">Quản lý tên hiển thị, tên người dùng, email và avatar của bạn.</p>
              <div className="user-settings__info-item" onClick={() => openModal('displayName', userData.displayName)}>
                <label className="user-settings__label">Họ và tên</label>
                <span className="user-settings__value">{userData.displayName}</span>
              </div>
              <div className="user-settings__info-item" onClick={() => openModal('username', userData.username)}>
                <label className="user-settings__label">Tên người dùng</label>
                <span className="user-settings__value">{userData.username || 'Chưa cập nhật'}</span>
              </div>
              <div className="user-settings__info-item" onClick={() => openModal('email', userData.email)}>
                <label className="user-settings__label">Email</label>
                <span className="user-settings__value">{userData.email || 'Chưa cập nhật'}</span>
              </div>
            </div>
            <div className="user-settings__info-section">
              <h3 className="user-settings__section-title">Đăng nhập & khôi phục</h3>
              <div className="user-settings__info-item" onClick={() => setIsPasswordModalOpen(true)}>
                <label className="user-settings__label">Đổi mật khẩu</label>
                <span className="user-settings__value">**********</span>
              </div>
              <div className="user-settings__info-item">
                <label className="user-settings__label">Xác minh 2 bước</label>
                <span className="user-settings__value">Đang tắt</span>
              </div>
            </div>
            <div className="user-settings__delete-account-section">
              <button
                className="user-settings__delete-account-button"
                onClick={() => setIsDeleteAccountModalOpen(true)}
              >
                Xóa tài khoản
              </button>
            </div>
          </div>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Cập nhật thông tin"
          className="user-settings__modal"
          overlayClassName="user-settings__overlay"
        >
          <div className="user-settings__modal-close-button-container">
            <button className="user-settings__close-button" onClick={closeModal}>&times;</button>
          </div>
          <h2 className="user-settings__modal-title">Cập nhật {modalField === 'displayName' ? 'Họ và tên' : modalField === 'email' ? 'Email' : modalField}</h2>
          <p className="user-settings__modal-subtitle">Tên sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn.</p>
          <div className="user-settings__modal-content">
            <label className="user-settings__modal-label">{modalField === 'displayName' ? 'Họ và tên' : modalField === 'email' ? 'Email' : modalField}</label>
            <input
              type="text"
              value={modalValue}
              onChange={(e) => setModalValue(e.target.value)}
              className="user-settings__modal-input"
            />
          </div>
          <button className="user-settings__modal-save-button" onClick={handleModalSave}>Lưu lại</button>
        </Modal>
        <Modal
          isOpen={isPasswordModalOpen}
          onRequestClose={() => setIsPasswordModalOpen(false)}
          contentLabel="Đổi mật khẩu"
          className="user-settings__modal"
          overlayClassName="user-settings__overlay"
        >
          <div className="user-settings__modal-close-button-container">
            <button className="user-settings__close-button" onClick={() => setIsPasswordModalOpen(false)}>&times;</button>
          </div>
          <h2 className="user-settings__modal-title">Đổi mật khẩu</h2>
          <div className="user-settings__modal-content">
            <label className="user-settings__modal-label">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="user-settings__modal-input"
            />
            <label className="user-settings__modal-label">Mật khẩu mới</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="user-settings__modal-input"
            />
            <label className="user-settings__modal-label">Xác nhận mật khẩu mới</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="user-settings__modal-input"
            />
          </div>
          <button className="user-settings__modal-save-button" onClick={handlePasswordChange}>Lưu lại</button>
        </Modal>
        <Modal
          isOpen={isUsernameModalOpen}
          onRequestClose={closeUsernameModal}
          contentLabel="Thông báo"
          className="user-settings__modal"
          overlayClassName="user-settings__overlay"
        >
          <div className="user-settings__modal-close-button-container">
            <button className="user-settings__close-button" onClick={closeUsernameModal}>&times;</button>
          </div>
          <h2 className="user-settings__modal-title">Thông báo</h2>
          <div className="user-settings__modal-content">
            <p>Tên người dùng không thể thay đổi. Tên người dùng chỉ được đăng ký một lần khi tạo tài khoản.</p>
          </div>
          <button className="user-settings__modal-save-button" onClick={closeUsernameModal}>Ok đã hiểu!</button>
        </Modal>
        <Modal
          isOpen={isDeleteAccountModalOpen}
          onRequestClose={closeDeleteModal}
          contentLabel="Xóa tài khoản"
          className="user-settings__modal"
          overlayClassName="user-settings__overlay"
        >
          <div className="user-settings__modal-close-button-container">
            <button className="user-settings__close-button" onClick={closeDeleteModal}>&times;</button>
          </div>
          <h2 className="user-settings__modal-title">Xóa tài khoản</h2>
          <div className="user-settings__modal-content">
            <label className="user-settings__modal-label">Mật khẩu hiện tại</label>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              className="user-settings__modal-input"
            />
            <label className="user-settings__modal-label">Nhập "confirm" để xác nhận</label>
            <input
              type="text"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              className="user-settings__modal-input"
            />
          </div>
          <button
            className="user-settings__modal-save-button"
            onClick={handleDeleteAccount}
            disabled={confirmDelete !== 'confirm'}
          >
            Xóa tài khoản
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default UserSettings; // Export component UserSettings để sử dụng ở các file khác
