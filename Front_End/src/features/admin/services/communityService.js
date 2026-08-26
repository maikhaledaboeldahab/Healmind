import { apiClient } from './apiClient';

export function normalizePost(p) {
  if (!p) return null;
  return {
    ...p,
    id: p._id || p.id,
    authorId: p.author?._id || p.author,
    authorName: p.isAnonymous ? 'Anonymous' : (p.author?.name || 'Community Member'),
    content: p.content || '',
    likesCount: Array.isArray(p.likes) ? p.likes.length : (p.likesCount || 0),
    commentsCount: p.commentsCount || 0,
    createdAt: p.createdAt || new Date().toISOString(),
    isAnonymous: Boolean(p.isAnonymous),
    isHidden: Boolean(p.isHidden),
  };
}

export function normalizeComment(c) {
  if (!c) return null;
  return {
    ...c,
    id: c._id || c.id,
    postId: c.postId,
    authorId: c.author?._id || c.author,
    authorName: c.author?.name || 'Community Member',
    content: c.content || '',
    createdAt: c.createdAt || new Date().toISOString(),
    isHidden: Boolean(c.isHidden),
  };
}

export const communityService = {
  async getPosts() {
    const res = await apiClient.get('/posts');
    const raw = res.data?.data || res.data?.posts || res.data;
    return Array.isArray(raw) ? raw.map(normalizePost) : [];
  },

  async deletePost(postId) {
    const res = await apiClient.delete(`/posts/${postId}`);
    return res.data;
  },

  async getComments(postId) {
    if (!postId) return [];
    const res = await apiClient.get(`/posts/${postId}/comments`);
    const raw = res.data?.data || res.data?.comments || res.data;
    return Array.isArray(raw) ? raw.map(normalizeComment) : [];
  },

  async deleteComment(postId, commentId) {
    const res = await apiClient.delete(`/posts/${postId}/comments/${commentId}`);
    return res.data;
  },
};

export default communityService;
