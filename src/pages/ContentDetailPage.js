import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faThumbsUp, faComment, faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { setLikes, setComments } from '../store/contentSlice';
import { fetchTopLikedPosts } from '../services/topLikedPosts';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import './ContentDetailPage.css';

const ContentDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [activeHeading, setActiveHeading] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const likes = useSelector(state => state.content.likes);
  const comments = useSelector(state => state.content.comments);
  const currentUser = useSelector(state => state.user.currentUser);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/contents/slug/${slug}`, {
          credentials: 'include',
        });
        const data = await response.json();
        setContent(data);
        setLoading(false);
        dispatch(setLikes(data.Likes || []));
        dispatch(setComments(data.Comments || []));
        setLikeCount(data.Likes ? data.Likes.length : 0);
        setIsLiked(data.Likes ? data.Likes.some(like => like.userId === currentUser?.id) : false);

        await fetch(`${process.env.REACT_APP_API_URL}/contents/${data.id}/views`, {
          method: 'POST',
          credentials: 'include',
        });

        const topLikedPostsData = await fetchTopLikedPosts();
        setTopLikedPosts(topLikedPostsData || []);
      } catch (error) {
        console.error('Error fetching content:', error);
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug, dispatch, currentUser]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('.content-detail-page__main-content h2');
      let lastActiveHeading = '';

      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 60 && rect.bottom >= 60) {
          lastActiveHeading = heading.id;
        }
      });

      setActiveHeading(lastActiveHeading);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLike = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/likes/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ contentId: content.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to like/unlike content');
      }

      const result = await response.json();
      if (result.message.includes('unliked')) {
        dispatch(setLikes(likes.filter(like => like.userId !== currentUser.id)));
        setLikeCount(likeCount - 1);
        setIsLiked(false);
        toast.success('Unliked successfully!');
      } else {
        const newLike = result.like;
        dispatch(setLikes([...likes, newLike]));
        setLikeCount(likeCount + 1);
        setIsLiked(true);
        toast.success('Liked successfully!');
      }
    } catch (error) {
      console.error('Error liking/unliking content:', error);
      toast.error('Failed to like/unlike content.');
    }
  };

  const handleAddComment = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ contentId: content.id, content: newComment }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const comment = await response.json();
      const commentWithCreatedAt = {
        ...comment,
        createdAt: new Date().toISOString(),
        User: {
          id: currentUser.id,
          displayName: currentUser.displayName,
          profileImage: currentUser.profileImage,
        },
        content: newComment,
      };

      dispatch(setComments([...comments, commentWithCreatedAt]));
      setNewComment('');
      toast.success('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!content) {
    return <div>Content not found</div>;
  }

  const headings = content.description ? content.description.match(/<h2.*?>(.*?)<\/h2>/g) : [];
  const sanitizedHeadings = headings ? headings.map((heading, index) => ({
    original: heading,
    sanitized: `heading-${index}-${heading.replace(/<.*?>/g, '').replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')}`
  })) : [];

  const updatedDescription = content.description ? sanitizedHeadings.reduce((acc, heading) => {
    if (heading) {
      return acc.replace(heading.original, `<h2 id="${heading.sanitized}">${heading.original.replace(/<.*?>/g, '')}</h2>`);
    }
    return acc;
  }, content.description) : '';

  const createMarkup = (html) => {
    return { __html: html };
  };

  return (
    <div className="content-detail-page">
      <div className="content-detail-page__header">
        <h1 className="content-detail-page__title">{content.title}</h1>
        <div className="content-detail-page__meta">
          <span className="content-detail-page__tag">{content.type}</span>
          <span className="content-detail-page__date">{new Date(content.createdAt).toLocaleDateString('vi-VN', {
               day: '2-digit',
               month: 'long',
               year: 'numeric',
              })}</span>
        </div>
      </div>
      <div className="content-detail-page__body">
        <div className="content-detail-page__toc">
          <div className="content-detail-page__toc-content">
            <h3 className="content-detail-page__toc-title">Nội dung</h3>
            {sanitizedHeadings.length > 0 ? (
              <ul className="content-detail-page__toc-list">
                {sanitizedHeadings.map((heading, index) => (
                  <li
                    key={index}
                    className={`content-detail-page__toc-item ${activeHeading === heading.sanitized ? 'content-detail-page__toc-item--active' : ''}`}
                    onClick={() => {
                      document.querySelector(`#${heading.sanitized}`).scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {heading.original.replace(/<.*?>/g, '')}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="content-detail-page__toc-empty">Không có mục lục</div>
            )}
          </div>
        </div>
        <div className="content-detail-page__main-content">
          <div className="content-detail-page__meta-info">
            <div className="content-detail-page__author-info">
              <img
                src={content.User?.profileImage}
                alt={content.User?.displayName}
                className="content-detail-page__author-image"
              />
              <p className="content-detail-page__author-name">{content.User?.displayName}</p>
            </div>
            <div className="content-detail-page__interaction">
              <div className="content-detail-page__stat-item">
                <FontAwesomeIcon icon={faEye} />
                <span>{content.views.toLocaleString() || 0}</span>
              </div>
              <div className="content-detail-page__stat-item">
                <FontAwesomeIcon icon={faThumbsUp} onClick={handleLike} className={isLiked ? 'liked' : 'not-liked'} />
                <span>{likeCount.toLocaleString()}</span>
              </div>
              <div className="content-detail-page__stat-item">
                <FontAwesomeIcon icon={faComment} />
                <span>{comments.length.toLocaleString()}</span>
              </div>
              <div className="content-detail-page__stat-item">
                <FontAwesomeIcon icon={faShareAlt} />
                <span>Share</span>
              </div>
            </div>
          </div>
          <div dangerouslySetInnerHTML={createMarkup(updatedDescription)} />
          {content.mediaFiles &&
            content.mediaFiles.map((media) => (
              <div key={media.id} className="content-detail-page__media">
                {media.mimetype.startsWith('image/') ? (
                  <img src={media.url} alt={content.title} className="content-detail-page__media-image" />
                ) : (
                  <video src={media.url} controls className="content-detail-page__media-video"></video>
                )}
              </div>
            ))}
          <div className="content-detail-page__comments-section">
            <h3 className="content-detail-page__comments-title">Bình luận</h3>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Thêm bình luận..."
              className="content-detail-page__comment-input"
            ></textarea>
            <button onClick={handleAddComment} className="content-detail-page__comment-button">
              Bình luận
            </button>
            <div className="content-detail-page__comments">
              {comments &&
                comments.map((comment) => (
                  <div key={comment.id} className="content-detail-page__comment">
                    <small>
                      {comment.User?.displayName} - 
                      {comment.createdAt ? formatDistanceToNow(parseISO(comment.createdAt), { addSuffix: true, locale: vi }) : 'Ngày không xác định'}
                    </small>
                    <p>{comment.content}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="content-detail-page__interaction">
          <div className="content-detail-page__featured-wrapper">
            <h3>Bài viết nổi bật</h3>
            <ul>
              {topLikedPosts && topLikedPosts.map((post) => (
                <li key={post.id}>
                  <Link to={`/content/${post.slug}`}>{post.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetailPage;
