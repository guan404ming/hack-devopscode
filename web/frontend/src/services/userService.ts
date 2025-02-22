import type { User } from '@shared/types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6969/api';

export const UserService = {
  register: async (payload: User.Post.Payload) => {
    const res = await axios.post<User>(`${API_URL}/auth/register/`, payload);
    return res.data;
  },
  login: async (payload: User.Post.Payload) => {
    const res = await axios.post<User.Post.Response>(
      `${API_URL}/auth/login/`,
      payload,
    );
    return res.data;
  },
  updateProfile: async (payload: User.Put.Payload) => {
    const res = await axios.put<User.Put.Response>(
      `${API_URL}/users/${payload._id}`,
      payload,
    );
    return res.data;
  },
};
