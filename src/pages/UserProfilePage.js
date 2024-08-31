import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../store/userSlice';
import './UserProfilePage.css';

const UserProfilePage = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.currentUser);

  const [posts, setPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get('mat');
        const localStorageUser = JSON.parse(localStorage.getItem('user'));

        if (!localStorageUser || localStorageUser.username !== username) {
          dispatch(fetchUser(username));
        }

        const postsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/posts?author=${username}`, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
        setPosts(postsResponse.data);

        const bookmarksResponse = await axios.get(`${process.env.REACT_APP_API_URL}/bookmarks/user/${username}`, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
        setBookmarks(bookmarksResponse.data);

        const activitiesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/activities?user=${username}`, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
        setRecentActivities(activitiesResponse.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [username, dispatch]);

  const renderRecentActivities = () => {
    if (recentActivities.length === 0) {
      return <p>Chưa có hoạt động gần đây</p>;
    }
    return recentActivities.map((activity, index) => (
      <div key={index} className="profile__activity-item">
        <p>{activity.description}</p>
      </div>
    ));
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const backgroundUrl = user.backgroundImage;
  const avatarUrl = user.profileImage || `${process.env.PUBLIC_URL}/index/brand-img/avatar_marcusfi.png`;

  const joinDate = user.createdAt ? formatDistanceToNow(parseISO(user.createdAt), { addSuffix: true, locale: vi }) : 'N/A';

  return (
    <div className="profile">
      <div className="profile__header" style={{ backgroundImage: `url(${backgroundUrl})` }}></div>
      
      <div className="profile__avatar-container">
        <img src={avatarUrl} alt="Avatar" className="profile__avatar" />
        <h1 className="profile__name">{user.displayName}</h1>
      </div>

      <div className="profile__body">
        <div className="profile__section">
          <h2 className="profile__section-title">Giới thiệu</h2>
          <p>Thành viên của Marcusfi từ {joinDate}</p>
        </div>
        <div className="profile__section">
          <h2 className="profile__section-title">Hoạt động gần đây</h2>
          {renderRecentActivities()}
        </div>
        <div className="profile__section">
          <h2 className="profile__section-title">Nội dung yêu thích</h2>
          <div className="profile__courses">
            {bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="profile__course">
                <h3 className="profile__course-title">{bookmark.Post.title}</h3>
                <p className="profile__course-content">{bookmark.Post.content.substring(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
        <div className="profile__section">
          <h2 className="profile__section-title">Nội dung của tôi</h2>
          <div className="profile__courses">
            {posts.map((post) => (
              <div key={post.id} className="profile__course">
                <h3 className="profile__course-title">{post.title}</h3>
                <p className="profile__course-content">{post.content.substring(0, 100)}...</p>
                <span className="profile__course-likes">{post.likes} likes</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
