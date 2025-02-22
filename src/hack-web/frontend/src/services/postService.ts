import type { Post, Posts } from '@shared/types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969/api';

export const PostService = {
  getAll: async () => {
    return (await axios.get<Posts.Get.Response>(`${API_URL}/posts/`)).data;
  },
  get: async (id: string) => {
    return (await axios.get<Post.Get.Response>(`${API_URL}/posts/${id}`)).data;
  },
  upvote: async (postId: string, userId: string) => {
    return (
      await axios.post<Post.Vote.Response>(
        `${API_URL}/posts/${postId}/upvote`,
        { userId },
      )
    ).data;
  },
  downvote: async (postId: string, userId: string) => {
    return (
      await axios.post<Post.Vote.Response>(
        `${API_URL}/posts/${postId}/downvote`,
        { userId },
      )
    ).data;
  },
  undoUpvote: async (postId: string, userId: string) => {
    return (
      await axios.post<Post.Vote.Response>(
        `${API_URL}/posts/${postId}/undo-upvote`,
        { userId },
      )
    ).data;
  },
  undoDownvote: async (postId: string, userId: string) => {
    return (
      await axios.post<Post.Vote.Response>(
        `${API_URL}/posts/${postId}/undo-downvote`,
        { userId },
      )
    ).data;
  },
  create: async (payload: Post.Post.Payload) => {
    return (await axios.post<Post.Post.Response>(`${API_URL}/posts/`, payload))
      .data;
  },
  update: async (postId: string, payload: Post.Put.Payload) => {
    return (
      await axios.put<Post.Put.Payload>(`${API_URL}/posts/${postId}`, payload)
    ).data;
  },
};
