import express from 'express';
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '@/controllers/user';

const userRouter = express.Router();

// GET /api/users
userRouter.get('/', getUsers);
// POST /api/users
userRouter.post('/', createUser);
// POST /api/users/new
userRouter.post('/new', createUser);
// GET /api/users/:id
userRouter.get('/:id', getUser);
// PUT /api/users/:id
userRouter.put('/:id', updateUser);
// DELETE /api/users/:id
userRouter.delete('/:id', deleteUser);

export default userRouter;
