// src/pages/ContentPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as fasBookmark, faEllipsisV, faEye, faThumbsUp, faComment } from '@fortawesome/free-solid-svg-icons';
import { faBookmark as farBookmark } from '@fortawesome/free-regular-svg-icons';
import { useSelector } from 'react-redux';
import EditPostModal from '../components/modals/EditPostModal';
import { toast } from 'react-toastify';
import './ContentPage.css';

const ContentPage = () => {
  const navigate = useNavigate();
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [bookmarked, setBookmarked] = useState({});
  const articlesPerPage = 8; // Change to 8 for 2 rows of 4 columns
  const currentUser = useSelector(state => state.user.currentUser);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/contents`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleButtonClick = () => {
    setShowEditPostModal(true);
  };

  const handleCloseModal = (isNewPost) => {
    setShowEditPostModal(false);
    if (isNewPost) {
      fetchPosts();
      toast.success('Đăng bài thành công!');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleReadMore = (slug) => {
    navigate(`/content/${slug}`);
  };

  const handleBookmarkClick = (postId) => {
    setBookmarked((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCardClick = (e, slug, id) => {
    const isBookmarkOrMenuClick = e.target.closest('.content-page__content-card-actions');
    if (!isBookmarkOrMenuClick) {
      handleReadMore(slug, id);
    }
  };

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = posts.slice(indexOfFirstArticle, indexOfLastArticle);

  return (
    <div className="content-page__container">
      <div className="content-page__header">
        <div className="content-page__header-title">
          <h1 className="content-page__header-title--text">Trang nội dung</h1>
          <p className="content-page__header-description">Đây là mô tả ngắn gọn về nội dung của trang này.</p>
        </div>
        <button className="content-page__header-add-post-button" onClick={handleButtonClick}>Đăng bài</button>
      </div>
      <div className="content-page__contents">
        {currentArticles.map((article) => (
          <div 
            key={article.id} 
            className="content-page__content-card" 
            onClick={(e) => handleCardClick(e, article.slug, article.id)}
          >
            <div className="content-page__content-card-image" style={{ backgroundImage: `url(${article.url})` }}>
              <div className="content-page__content-card-author">
                <img src={article.User.profileImage} alt={article.User.displayName} />
                <span>{article.User.displayName}</span>
              </div>
              <div className="content-page__content-card-tags">
                <span className="content-page__content-card-tag">{article.type}</span>
                <span className="content-page__content-card-tag">{article.categories}</span>
              </div>
            </div>
            <div className="content-page__content-card-body">
              <h3>{article.title}</h3>
              <div className="content-page__content-card-footer">
                <div className="content-page__content-card-stats">
                  <div className="content-page__content-card-stat content-page__content-card-stat--views">
                    <FontAwesomeIcon icon={faEye} /> <span>{(article.views || 0).toLocaleString()}</span>
                  </div>
                  <div className="content-page__content-card-stat content-page__content-card-stat--likes">
                    <FontAwesomeIcon icon={faThumbsUp} /> <span>{(article.Likes ? article.Likes.length : 0).toLocaleString()}</span>
                  </div>
                  <div className="content-page__content-card-stat content-page__content-card-stat--comments">
                    <FontAwesomeIcon icon={faComment} /> <span>{(article.Comments ? article.Comments.length : 0).toLocaleString()}</span>
                  </div>
                </div>
                <div className="content-page__content-card-actions" onClick={(e) => e.stopPropagation()}>
                  <FontAwesomeIcon
                    icon={bookmarked[article.id] ? fasBookmark : farBookmark}
                    onClick={() => handleBookmarkClick(article.id)}
                  />
                  {article.User.id === currentUser?.id && (
                    <FontAwesomeIcon icon={faEllipsisV} />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="content-page__pagination">
        {Array.from({ length: Math.ceil(posts.length / articlesPerPage) }, (_, index) => (
          <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
      {showEditPostModal && (
        <EditPostModal closeForm={handleCloseModal} />
      )}
    </div>
  );
};

export default ContentPage;
