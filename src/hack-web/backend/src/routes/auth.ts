import express from 'express';
import { userLogin, userLogout } from '@/controllers/auth';
import { createUser } from '@/controllers/user';

const authRouter = express.Router();

// POST /api/auth/login
authRouter.post('/login', userLogin);
// POST /api/auth/register
authRouter.post('/register', createUser);
// POST /api/auth/logout
authRouter.post('/logout', userLogout);

export default authRouter;
