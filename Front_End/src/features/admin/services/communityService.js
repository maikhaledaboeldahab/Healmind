import { MOCK_COMMUNITY_COMMENTS, MOCK_COMMUNITY_POSTS } from '../constants/mockData'
import { simulateLatency } from './apiClient'

let posts = [...MOCK_COMMUNITY_POSTS]
let comments = [...MOCK_COMMUNITY_COMMENTS]

export const communityService = {
  async getPosts() {
    return simulateLatency([...posts])
  },
  async hidePost(postId) {
    posts = posts.map((p) => (p.id === postId ? { ...p, isHidden: true } : p))
    return simulateLatency(posts.find((p) => p.id === postId))
  },
  async deletePost(postId) {
    posts = posts.filter((p) => p.id !== postId)
    return simulateLatency({ success: true })
  },

  async getComments() {
    return simulateLatency([...comments])
  },
  async hideComment(commentId) {
    comments = comments.map((c) => (c.id === commentId ? { ...c, isHidden: true } : c))
    return simulateLatency(comments.find((c) => c.id === commentId))
  },
  async deleteComment(commentId) {
    comments = comments.filter((c) => c.id !== commentId)
    return simulateLatency({ success: true })
  },
}
