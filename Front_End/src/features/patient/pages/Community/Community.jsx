import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../../../shared/context/AuthContext';
import api from '../../../../shared/services/api';
import { getSocket } from '../../../../shared/services/socket';
import Input from '../../../../shared/components/Input/Input';
import Button from '../../../../shared/components/Button/Button';
import EmptyState from '../../../../shared/components/EmptyState/EmptyState';
import styles from './Community.module.css';

const STATUS_COPY = {
  pending: {
    title: 'Your Community Access is Pending',
    description: 'Your request is awaiting doctor evaluation. Once approved, you will have full access to create posts, comment, and connect with peers.',
  },
  approved: {
    title: 'You have full community access',
    description: 'Share, like, and comment with others on the same journey.',
  },
  rejected: {
    title: 'Community Access Not Approved',
    description: 'Your community access request was not approved at this time. Please consult your specialist for further evaluation.',
  },
  needs_another_session: {
    title: 'Additional Session Recommended',
    description: 'Your evaluating doctor recommends an additional session before granting community interaction access.',
  },
  view_only: {
    title: 'Community Access Required',
    description: 'You need an approved community access request to view and interact with the community.',
  },
};

function normalizePostItem(p) {
  if (!p) return null;
  return {
    id: p._id || p.id,
    author: p.isAnonymous ? 'Anonymous' : (p.author?.name || 'Community Member'),
    avatar: p.author?.profileImage || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces',
    subject: p.title || p.subject || '',
    content: p.content || p.description || '',
    likes: Array.isArray(p.likes) ? p.likes.length : (p.likes || 0),
    comments: p.commentsCount || 0,
    createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Just now',
  };
}

export default function Community() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [postComments, setPostComments] = useState({});

  const status = user?.communityAccess || user?.communityStatus || 'view_only';
  const approved = status === 'approved';

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/posts');
      const raw = res.data?.data || res.data?.posts || res.data;
      if (Array.isArray(raw)) {
        setPosts(raw.map(normalizePostItem).filter(Boolean));
      }
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();

    const socket = getSocket();
    const handleNewPost = (newPost) => {
      const normalized = normalizePostItem(newPost);
      if (normalized) {
        setPosts((prev) => [normalized, ...prev.filter((p) => p.id !== normalized.id)]);
      }
    };

    const handlePostLiked = ({ postId, likesCount }) => {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likes: likesCount } : p))
      );
    };

    const handleNewComment = (comment) => {
      if (comment?.postId) {
        setPostComments((prev) => ({
          ...prev,
          [comment.postId]: [
            ...(prev[comment.postId] || []),
            {
              id: comment._id || comment.id || Date.now(),
              author: comment.author?.name || 'Community Member',
              content: comment.content,
              createdAt: 'Just now',
            },
          ],
        }));
        setPosts((prev) =>
          prev.map((p) => (p.id === comment.postId ? { ...p, comments: (p.comments || 0) + 1 } : p))
        );
      }
    };

    socket.on('newPost', handleNewPost);
    socket.on('postLiked', handlePostLiked);
    socket.on('newComment', handleNewComment);

    return () => {
      socket.off('newPost', handleNewPost);
      socket.off('postLiked', handlePostLiked);
      socket.off('newComment', handleNewComment);
    };
  }, [fetchPosts]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      const payload = {
        content: subject.trim() ? `${subject.trim()}\n\n${description.trim()}` : description.trim(),
      };
      const res = await api.post('/posts', payload);
      const created = normalizePostItem(res.data?.data || res.data);
      if (created) {
        setPosts((prev) => [created, ...prev]);
      } else {
        fetchPosts();
      }
      setSubject('');
      setDescription('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish post.');
    }
  };

  const handleToggleLike = async (postId) => {
    if (!approved) return;
    try {
      const res = await api.post(`/posts/${postId}/like`);
      const likesCount = res.data?.data?.likesCount ?? res.data?.likesCount;
      if (typeof likesCount === 'number') {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: likesCount } : p))
        );
      } else {
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
        );
      }
    } catch {
      // Ignore like error
    }
  };

  const handleToggleComments = async (postId) => {
    const isExpanding = !expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: isExpanding }));

    if (isExpanding && !postComments[postId]) {
      try {
        const res = await api.get(`/posts/${postId}/comments`);
        const raw = res.data?.data || res.data?.comments || res.data;
        if (Array.isArray(raw)) {
          setPostComments((prev) => ({
            ...prev,
            [postId]: raw.map((c) => ({
              id: c._id || c.id,
              author: c.author?.name || 'Community Member',
              content: c.content,
              createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just now',
            })),
          }));
        }
      } catch {
        setPostComments((prev) => ({ ...prev, [postId]: [] }));
      }
    }
  };

  const handleAddComment = async (postId, e) => {
    e.preventDefault();
    if (!approved) return;
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    try {
      const res = await api.post(`/posts/${postId}/comments`, { content: text });
      const rawComment = res.data?.data || res.data;
      const newComment = {
        id: rawComment._id || rawComment.id || Date.now(),
        author: user?.name || user?.fullName || 'You',
        content: text,
        createdAt: 'Just now',
      };

      setPostComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, comments: (p.comments || 0) + 1 } : p))
      );

      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post comment.');
    }
  };

  if (!approved) {
    const copy = STATUS_COPY[status] || STATUS_COPY.pending;
    return (
      <div className={styles.page}>
        <h1>Community</h1>
        <EmptyState
          title={copy.title}
          description={copy.description}
          action={
            <Button onClick={() => navigate('/tickets/new')}>
              Request Community Access
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1>Community</h1>
      <p className={styles.subtext}>A safe and supportive space to share your wellness journey with peers.</p>

      <form className={styles.composer} onSubmit={handlePost}>
        <div className={styles.composerInputs}>
          <Input
            placeholder="Post Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Input
            as="textarea"
            rows={3}
            placeholder="Post Description (share with the community...)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styles.composerFooter}>
          <Button
            type="submit"
            icon={<FontAwesomeIcon icon={faPaperPlane} />}
            disabled={!description.trim()}
          >
            Publish Post
          </Button>
        </div>
      </form>

      <div className={styles.feed}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>Loading community posts...</p>
        ) : posts.length === 0 ? (
          <EmptyState title="No posts yet" description="Be the first to share a post with the community!" />
        ) : (
          posts.map((post) => (
            <article key={post.id} className={styles.post}>
              <div className={styles.postHeader}>
                <img src={post.avatar} alt={post.author} className={styles.avatar} />
                <div>
                  <p className={styles.author}>{post.author}</p>
                  <p className={styles.time}>{post.createdAt}</p>
                </div>
              </div>
              {post.subject && <h3 className={styles.postSubject}>{post.subject}</h3>}
              <p className={styles.content}>{post.content}</p>
              <div className={styles.actions}>
                <button type="button" onClick={() => handleToggleLike(post.id)}>
                  <FontAwesomeIcon icon={faHeart} /> {post.likes}
                </button>
                <button type="button" onClick={() => handleToggleComments(post.id)}>
                  <FontAwesomeIcon icon={faComment} /> {post.comments}
                </button>
              </div>

              {expandedComments[post.id] && (
                <div className={styles.commentSection}>
                  <form
                    className={styles.commentForm}
                    onSubmit={(e) => handleAddComment(post.id, e)}
                  >
                    <input
                      type="text"
                      className={styles.commentInput}
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                    />
                    <Button type="submit" size="sm" disabled={!commentInputs[post.id]?.trim()}>
                      Reply
                    </Button>
                  </form>

                  <div className={styles.commentList}>
                    {(postComments[post.id] || []).map((comment) => (
                      <div key={comment.id} className={styles.commentItem}>
                        <div className={styles.commentAuthor}>{comment.author}</div>
                        <div>{comment.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
