// src/components/modals/EditPostModal.js
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Quill from 'quill';
import Delta from 'quill-delta';
import 'react-quill/dist/quill.snow.css';
import 'react-toastify/dist/ReactToastify.css';
import 'highlight.js/styles/atom-one-dark.css';
import './EditPostModal.css'; // Import the CSS file

import {
  setTitle,
  setDescription,
  setType,
  setUrl,
  setCategories,
} from '../../store/editPostSlice';
import {
  selectTitle,
  selectDescription,
  selectType,
  selectUrl,
  selectCategories,
} from '../../store/selectors';

const createSlug = (title) => {
  const from = "áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ";
  const to = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";
  const newTitle = title.split('').map((char, i) => {
    const index = from.indexOf(char);
    return index >= 0 ? to[index] : char;
  }).join('');

  return newTitle
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

const cleanHTML = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const iframes = doc.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    const src = iframe.src;
    const p = document.createElement('p');
    p.textContent = src;
    iframe.replaceWith(p);
  });
  return doc.body.innerHTML;
};

const EditPostModal = ({ closeForm }) => {
  const dispatch = useDispatch();
  const title = useSelector(selectTitle);
  const description = useSelector(selectDescription);
  const type = useSelector(selectType);
  const url = useSelector(selectUrl);
  const categories = useSelector(selectCategories) || '';

  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [currentType, setCurrentType] = useState('Post');
  const [currentCategory, setCurrentCategory] = useState('Develop yourself');
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState('');
  const quillRef = useRef(null);

  useEffect(() => {
    if (type) {
      setCurrentType(type);
    } else {
      setCurrentType('Post');
    }
  }, [type]);

  useEffect(() => {
    if (categories) {
      setCurrentCategory(categories);
    }
  }, [categories]);

  useEffect(() => {
    const handlePaste = async (event) => {
      event.preventDefault();
      const text = (event.clipboardData || window.clipboardData).getData('text');
      const urlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/[^\s]+$/;
      if (urlPattern.test(text)) {
        const range = quillRef.current.getSelection();
        const blobUrl = await fetchVideoAsBlobUrl(text);
        quillRef.current.clipboard.dangerouslyPasteHTML(range.index, `<video controls src="${blobUrl}" width="560" height="315"></video><p>${text}</p>`);
      } else {
        const range = quillRef.current.getSelection();
        quillRef.current.clipboard.dangerouslyPasteHTML(range.index, text);
      }
    };

    const fetchVideoAsBlobUrl = async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    };

    if (currentType === 'Post') {
      const quill = new Quill('#editor', {
        modules: {
          syntax: true,
          toolbar: {
            container: '#toolbar-container',
            handlers: {
              image: function() {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();

                input.onchange = async () => {
                  const file = input.files[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('image', file);

                    try {
                      const response = await fetch(`${process.env.REACT_APP_API_URL}/media/upload`, {
                        method: 'POST',
                        headers: {
                          'Accept': 'application/json',
                        },
                        credentials: 'include',
                        body: formData,
                      });

                      if (!response.ok) {
                        throw new Error('Failed to upload image');
                      }

                      const data = await response.json();
                      const range = this.quill.getSelection();
                      this.quill.insertEmbed(range.index, 'image', data.url);
                    } catch (error) {
                      console.error('Error uploading image:', error);
                    }
                  }
                };
              },
              link: function() {
                const range = this.quill.getSelection();
                if (range == null || range.length === 0) {
                  return;
                }
                const value = prompt('Enter URL:');
                if (value) {
                  this.quill.format('link', value);
                }
              },
            },
          },
          clipboard: {
            matchers: [
              ['a', (node, delta) => {
                node.removeAttribute('rel');
                node.removeAttribute('target');
                return delta;
              }],
              ['a[href*="youtube.com"], a[href*="youtu.be"]', (node, delta) => {
                return new Delta(); // Loại bỏ link nếu là URL YouTube
              }]
            ]
          }
        },
        placeholder: 'Compose an epic...',
        theme: 'snow',
      });

      quill.root.addEventListener('paste', handlePaste);

      quill.on('text-change', () => {
        dispatch(setDescription(quill.root.innerHTML));
      });

      quillRef.current = quill;

      return () => {
        quill.off('text-change');
        quill.root.removeEventListener('paste', handlePaste);
      };
    }
  }, [currentType, dispatch]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      setImageFile(file);
    }
  };

  const handleMediaChange = (event) => {
    const url = event.target.value;
    if (isValidUrl(url)) {
      setMediaPreviewUrl(url);
      dispatch(setUrl(url));
    } else {
      setMediaPreviewUrl(''); // Xóa preview nếu URL không hợp lệ
      toast.error('URL không hợp lệ, vui lòng nhập lại');
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSave = async () => {
    if (!isFormValid()) {
      toast.error('Vui lòng cập nhật đủ thông tin');
      return;
    }

    let cleanedDescription = cleanHTML(description);

    const postData = {
      title,
      description: currentType === 'Post' ? cleanedDescription : url,
      type: currentType,
      categories: currentCategory,
      slug: createSlug(title),
      url: currentType === 'Video' ? url : '',
    };

    try {
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${process.env.REACT_APP_API_URL}/media/upload`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        postData.url = data.url;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/contents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Content saved successfully:', responseData);

      dispatch(setTitle(''));
      dispatch(setDescription(''));
      dispatch(setType(null));
      dispatch(setUrl(''));
      dispatch(setCategories(''));
      setImagePreviewUrl('');
      setImageFile(null);
      setMediaPreviewUrl('');

      closeForm(true);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  const isFormValid = () => {
    if (!title || !currentType || !currentCategory) {
      return false;
    }

    if (currentType === 'Post' && !description) {
      return false;
    }

    if (currentType === 'Video' && (!url || !isValidUrl(url))) {
      return false;
    }

    return true;
  };

  const handleTypeChange = (e) => {
    setCurrentType(e.target.value);
    dispatch(setType(e.target.value));
  };

  const handleCategoryChange = (e) => {
    setCurrentCategory(e.target.value);
    dispatch(setCategories(e.target.value));
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoIdMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
  };

  const handleButtonClick = () => {
    if (!isFormValid()) {
      toast.error('Vui lòng cập nhật đủ thông tin');
    } else {
      handleSave();
    }
  };

  return (
    <div className="edit-post-modal__overlay" onClick={() => closeForm(false)}>
      <div className="edit-post-modal__content" onClick={(e) => e.stopPropagation()}>
        <div className="edit-post-modal__header">
          <h2 className="edit-post-modal__title">Tạo bài viết mới</h2>
          <button className="edit-post-modal__close-button" onClick={() => closeForm(false)}>&times;</button>
        </div>
        <div className="edit-post-modal__body">
          <div className="edit-post-modal__left-section">
            <label className="edit-post-modal__label">Upload ảnh đại diện</label>
            <div className="edit-post-modal__image-upload-container">
              <label className="edit-post-modal__image-upload-label">
                <input type="file" accept="image/*" onChange={handleImageChange} className="edit-post-modal__image-upload-input" />
                {imagePreviewUrl ? (
                  <img src={imagePreviewUrl} alt="Uploaded" className="edit-post-modal__image" />
                ) : (
                  <div className="edit-post-modal__image-placeholder"><i className="fas fa-upload"></i></div>
                )}
              </label>
            </div>
          </div>
          <div className="edit-post-modal__right-section">
            <div className="edit-post-modal__title-input-container">
              <label className="edit-post-modal__label">Tiêu đề</label>
              <input type="text" className="edit-post-modal__title-input" value={title} onChange={(e) => dispatch(setTitle(e.target.value))} placeholder="Nhập tiêu đề..." />
            </div>
            <div className="edit-post-modal__type-category-container">
              <label className="edit-post-modal__label">Type</label>
              <select className="edit-post-modal__type-select" value={currentType} onChange={handleTypeChange}>
                <option value="Post">Post</option>
                <option value="Video">Video</option>
              </select>
              <label className="edit-post-modal__label">Categories</label>
              <select className="edit-post-modal__category-select" value={currentCategory} onChange={handleCategoryChange}>
                <option value="Financial management">Financial management</option>
                <option value="Develop yourself">Develop yourself</option>
                <option value="Learning">Learning</option>
                <option value="Life style">Life style</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>
        <div className="edit-post-modal__content-section">
          {currentType === 'Post' ? (
            <div className="edit-post-modal__quill-container">
              <div id="toolbar-container">
                <span className="ql-formats">
                  <select className="ql-header">
                    <option value="2">Heading 2</option>
                    <option value="3">Heading 3</option>
                    <option value="4">Heading 4</option>
                    <option value="5">Heading 5</option>
                    <option value="6">Heading 6</option>
                    <option value="">Normal</option>
                  </select>
                </span>
                <span className="ql-formats">
                  <button className="ql-bold"></button>
                  <button className="ql-italic"></button>
                  <button className="ql-underline"></button>
                </span>
                <span className="ql-formats">
                  <button className="ql-blockquote"></button>
                </span>
                <span className="ql-formats">
                  <button className="ql-list" value="bullet"></button>
                </span>
                <span className="ql-formats">
                  <select className="ql-align"></select>
                </span>
                <span className="ql-formats">
                  <button className="ql-link"></button>
                  <button className="ql-image"></button>
                </span>
              </div>
              <div id="editor"></div>
            </div>
          ) : (
            <div className="edit-post-modal__media-url-container">
              <input type="text" className="edit-post-modal__media-url-input" value={url} onChange={handleMediaChange} placeholder="Nhập URL..." />
              {mediaPreviewUrl && (
                <div className="edit-post-modal__media-preview">
                  <iframe className="edit-post-modal__media-iframe" src={getYouTubeEmbedUrl(mediaPreviewUrl)} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="edit-post-modal__footer">
          <button className={`edit-post-modal__save-button ${isFormValid() ? 'active' : 'inactive'}`} onClick={handleButtonClick}>Lưu bài viết</button>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;
