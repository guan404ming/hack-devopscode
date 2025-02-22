import { MakeOptional, User } from '@shared/types';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import { asyncWrapper, ErrorResponse } from '@/error';
import UserModel from '@/models/user';

/**
 * Login user
 * @route POST /api/auth/login
 */
export const userLogin = asyncWrapper(
  async (
    req: Request<{}, {}, User.Post.Payload>,
    res: Response<User.Post.Response<Schema.Types.ObjectId> | ErrorResponse>,
  ) => {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username }).select('+password');
    if (!user) return res.status(404).send({ message: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send({ message: 'Invalid password' });
    const userObj = user.toObject() as MakeOptional<typeof user, 'password'>;
    delete userObj.password;
    res.json(userObj);
  },
);

/**
 * Logout user
 * @route POST /api/auth/logout
 */
export const userLogout = asyncWrapper(async (req: Request, res: Response) => {
  res.send('Logout');
});
