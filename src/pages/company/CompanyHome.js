import React, { useState, useEffect } from 'react';
import api from '../../api';
import Navbar from '../../components/Navbar';


// --- CSS Styles ---
const styles = `
    .company-home-container {
        min-height: 100vh;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    }

    .content-wrapper {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }

    .page-header {
        text-align: center;
        margin-bottom: 3rem;
    }

    .page-title {
        margin: 0 0 1rem 0;
        font-size: 2.5rem;
        font-weight: 700;
        color: #1f2937;
    }
    
    .company-name {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 700;
    }

    .card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        margin-bottom: 2rem;
        overflow: hidden;
        transition: all 0.3s ease;
    }

    .card:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    .card-header {
        padding: 1.5rem 2rem;
        border-bottom: 1px solid #f3f4f6;
    }

    .card-title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
    }

    .form {
        padding: 2rem;
    }

    .form-group {
        margin-bottom: 1.5rem;
    }

    .form-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: #374151;
        font-size: 0.9rem;
    }

    .form-select,
    .form-input,
    .form-textarea {
        width: 100%;
        padding: 0.75rem 1rem;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        font-size: 1rem;
        transition: all 0.2s ease;
        background: white;
        box-sizing: border-box;
    }

    .form-select:focus,
    .form-input:focus,
    .form-textarea:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-textarea {
        resize: vertical;
        min-height: 100px;
    }
    
    .form-select {
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
    }

    .submit-btn {
        width: 100%;
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 12px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .submit-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 10px 25px -3px rgba(102, 126, 234, 0.3);
    }

    .section-title {
        margin: 3rem 0 2rem 0;
        font-size: 1.8rem;
        font-weight: 700;
        color: #1f2937;
    }

    .post-header {
        padding: 1.5rem 2rem 1rem 2rem;
    }
    
    .post-author {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 0.25rem 0;
    }

    .post-meta {
        font-size: 0.9rem;
        color: #6b7280;
    }

    .post-content {
        padding: 0 2rem 1.5rem 2rem;
    }

    .text-content {
        font-size: 1.1rem;
        line-height: 1.6;
        color: #374151;
        white-space: pre-wrap;
    }
    
    .post-media {
        width: 100%;
        max-width: 100%;
        border-radius: 12px;
        margin-top: 1rem;
    }
    
    .post-caption {
        margin-top: 0.5rem;
        font-style: italic;
        color: #6b7280;
        font-size: 1rem;
    }
`;

function CompanyHome({ user }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    content_type: 'text',
    content: '',
    caption: ''
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      await api.post('/posts', newPost);
      setNewPost({ content_type: 'text', content: '', caption: '' });
      fetchPosts();
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="company-home-container">
        <Navbar user={user} userType="company" />
        <div className="content-wrapper">
          <header className="page-header">
            <h1 className="page-title">
                Welcome, <span className="company-name">{user?.name || 'Company'}</span>
            </h1>
          </header>

          <div className="card">
              <div className="card-header">
                  <h2 className="card-title">Create a New Post</h2>
              </div>
              <form className="form" onSubmit={handleCreatePost}>
                  <div className="form-group">
                      <label className="form-label">Content Type</label>
                      <select
                          className="form-select"
                          value={newPost.content_type}
                          onChange={(e) => setNewPost({...newPost, content_type: e.target.value})}
                      >
                          <option value="text">Text</option>
                          <option value="image">Image URL</option>
                          <option value="video">Video URL</option>
                      </select>
                  </div>
                  <div className="form-group">
                      <label className="form-label">{newPost.content_type === 'text' ? 'Content' : 'URL'}</label>
                      {newPost.content_type === 'text' ? (
                          <textarea
                              className="form-textarea"
                              placeholder="What's happening at your company?"
                              value={newPost.content}
                              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                              required
                          ></textarea>
                      ) : (
                          <input
                              type="url"
                              className="form-input"
                              placeholder={`${newPost.content_type.charAt(0).toUpperCase() + newPost.content_type.slice(1)} URL`}
                              value={newPost.content}
                              onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                              required
                          />
                      )}
                  </div>
                  <div className="form-group">
                        <label className="form-label">Caption (Optional)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Add a caption..."
                            value={newPost.caption}
                            onChange={(e) => setNewPost({...newPost, caption: e.target.value})}
                        />
                  </div>
                  <button type="submit" className="submit-btn">Post</button>
              </form>
          </div>

          <h2 className="section-title">Recent Posts</h2>
          {posts.map((post) => (
              <div key={post._id} className="card">
                  <div className="post-header">
                      <div>
                          <h3 className="post-author">{post.author_name}</h3>
                          <p className="post-meta">{new Date(post.created_at).toLocaleString()}</p>
                      </div>
                  </div>
                  <div className="post-content">
                      {post.content_type === 'text' && <p className="text-content">{post.content}</p>}
                      {post.content_type === 'image' && <img src={post.content} alt={post.caption || 'Post'} className="post-media" />}
                      {post.content_type === 'video' && <video src={post.content} controls className="post-media" />}
                      {post.caption && <p className="post-caption">{post.caption}</p>}
                  </div>
              </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default CompanyHome;