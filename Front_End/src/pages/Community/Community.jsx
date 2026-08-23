import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { communityPosts } from '../../data/community';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import EmptyState from '../../components/EmptyState/EmptyState';
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
  additional_session_required: {
    title: 'Additional Session Recommended',
    description: 'Your evaluating doctor recommends an additional session before granting community interaction access.',
  },
  view_only: {
    title: 'Community Access Required',
    description: 'You need an approved community access request to view and interact with the community.',
  },
};

export default function Community() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState(communityPosts);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [postComments, setPostComments] = useState({});

  const status = user?.communityStatus || 'pending';
  const approved = status === 'approved';

  const handlePost = (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    const newPost = {
      id: `post-${Date.now()}`,
      author: user?.fullName || 'Anonymous Patient',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop&crop=faces',
      subject: subject.trim(),
      description: description.trim(),
      content: description.trim(),
      likes: 0,
      comments: 0,
      createdAt: 'Just now',
    };
    setPosts((prev) => [newPost, ...prev]);
    setSubject('');
    setDescription('');
  };

  const handleToggleLike = (postId) => {
    if (!approved) return;
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const handleToggleComments = (postId) => {
    setExpandedComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleAddComment = (postId, e) => {
    e.preventDefault();
    if (!approved) return;
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment = {
      id: `comment-${Date.now()}`,
      author: user?.fullName || 'Anonymous Patient',
      content: text,
      createdAt: 'Just now',
    };

    setPostComments((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, comments: p.comments + 1 } : p))
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
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
            disabled={!subject.trim() || !description.trim()}
          >
            Publish Post
          </Button>
        </div>
      </form>

      <div className={styles.feed}>
        {posts.map((post) => (
          <article key={post.id} className={styles.post}>
            <div className={styles.postHeader}>
              <img src={post.avatar} alt={post.author} className={styles.avatar} />
              <div>
                <p className={styles.author}>{post.author}</p>
                <p className={styles.time}>{post.createdAt}</p>
              </div>
            </div>
            {post.subject && <h3 className={styles.postSubject}>{post.subject}</h3>}
            <p className={styles.content}>{post.description || post.content}</p>
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
        ))}
      </div>
    </div>
  );
}
