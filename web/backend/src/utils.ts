import mongoose from 'mongoose';
import PostModel from '@/models/post';
import UserModel from '@/models/user';

/**
 * Clear all data in database
 */
export const clear = async () => {
  await PostModel.deleteMany({});
  await UserModel.deleteMany({});
  console.log('Cleared database.');
};

/**
 * Setup initial data in database
 */
export const setup = async () => {
  // Create test user
  const user = {
    _id: new mongoose.Types.ObjectId('000000000000000000000001'),
    username: 'test',
    password: '123',
    posts: [
      new mongoose.Types.ObjectId('000000000000000000000001'),
      new mongoose.Types.ObjectId('000000000000000000000002'),
    ],
  };
  const newUser = new UserModel(user);
  await newUser.save();
  // Create test posts
  const post1 = {
    _id: new mongoose.Types.ObjectId('000000000000000000000001'),
    author: newUser._id,
    title: 'hello.py',
    content: 'print("Hello, world!")\n',
  };
  const newPost1 = new PostModel(post1);
  await newPost1.save();
  const post2 = {
    _id: new mongoose.Types.ObjectId('000000000000000000000002'),
    author: newUser._id,
    title: 'hello.rs',
    content: 'fn main() {\n\tprintln!("Hello, world!");\n}\n',
  };
  const newPost2 = new PostModel(post2);
  await newPost2.save();
};
