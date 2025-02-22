import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { env } from 'process';
import { errorHandler } from '@/error';
import authRouter from '@/routes/auth';
import postRouter from '@/routes/post';
import userRouter from '@/routes/user';
import initRouter from './routes/init';
import { clear, setup } from './utils';

dotenv.config();

// Default PORT is 6969
const PORT = env.PORT || 6969;
// Please set MONGO_URL in .env file
// You should not use local MongoDB unless you have setup replica set
const MONGO_URL = env.MONGO_URL || 'mongodb://0.0.0.0:27017/vs-coddit';

const app = express();

// Enable CORS
app.use(cors());
// Enable JSON body
app.use(express.json());

// Test API
app.get('/api', (req, res) => {
  res.send('Hello World!');
});

// API routes
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/auth', authRouter);
app.use('/api/init', initRouter);

// Error handler
app.use(errorHandler);

mongoose
  .connect(MONGO_URL)
  .then(async () => {
    console.log(
      `Successfully connected to MongoDB: ${
        MONGO_URL.startsWith('mongodb+srv://')
          ? MONGO_URL.replace(
              /(mongodb\+srv:\/\/[^:]+:)([^@]+)(@.+)/,
              '$1******$3',
            )
          : MONGO_URL
      }`,
    );
    // Comment next line if you don't want to clear database
    // However, you should clear database before running tests
    await clear();
    // Comment next line if you don't want to setup database
    // However, you should setup database before running tests
    await setup();
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
  })
  .catch((error) => {
    console.log(`Error connecting to MongoDB: ${MONGO_URL}`);
    console.log(error.message);
  });
