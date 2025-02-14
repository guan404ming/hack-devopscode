import { Post, Posts, User } from '@shared/types';
import { Request, Response } from 'express';
import { Schema, UpdateQuery } from 'mongoose';
import { ErrorResponse, asyncWrapper } from '@/error';
import PostModel from '@/models/post';
import UserModel from '@/models/user';

/**
 * Get all posts
 * @route GET /api/posts
 */
export const getPosts = asyncWrapper(
  async (
    req: Request,
    res: Response<Posts.Get.Response<Schema.Types.ObjectId> | ErrorResponse>,
  ) => {
    const posts = await PostModel.find({}).populate<{
      author: Pick<User, '_id' | 'image' | 'username'>;
    }>({ path: 'author', select: ['_id', 'image', 'username'] });
    if (!posts) return res.status(404).send({ message: 'Posts not found' });
    res.json(posts);
  },
);

/**
 * Create new post
 * @route POST /api/posts
 * @route POST /api/posts/new
 */
export const createPost = asyncWrapper(
  async (
    req: Request<{}, {}, Post.Post.Payload>,
    res: Response<Post.Post.Response<Schema.Types.ObjectId> | ErrorResponse>,
  ) => {
    // Create the post
    const newPost = new PostModel(req.body);
    await newPost.save();

    if (!newPost) {
      return res.status(500).send({ message: 'Failed to create post' });
    }

    // Update the user with the new post
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.author,
      { $push: { posts: newPost._id } },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    const populatedPost = await newPost.populate<{
      author: Pick<User, '_id' | 'image' | 'username'>;
    }>({ path: 'author', select: ['_id', 'image', 'username'] });

    res.status(201).json(populatedPost);
  },
);

/**
 * Get post by id
 * @route GET /api/posts/:id
 */
export const getPost = asyncWrapper(
  async (
    req: Request<{ id: string }>,
    res: Response<Post.Get.Response<Schema.Types.ObjectId> | ErrorResponse>,
  ) => {
    const post = await PostModel.findById(req.params.id).populate<{
      author: Pick<User, '_id' | 'image' | 'username'>;
    }>({ path: 'author', select: ['_id', 'image', 'username'] });
    if (!post) return res.status(404).send({ message: 'Post not found' });
    res.json(post);
  },
);

/**
 * Update post by id
 * @route PUT /api/posts/:id
 */
export const updatePost = asyncWrapper(
  async (
    req: Request<{ id: string }, {}, Post.Put.Payload>,
    res: Response<Post.Put.Response<Schema.Types.ObjectId> | ErrorResponse>,
  ) => {
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    ).populate<{
      author: Pick<User, '_id' | 'image' | 'username'>;
    }>({ path: 'author', select: ['_id', 'image', 'username'] });
    if (!updatedPost)
      return res.status(404).send({ message: 'Post not found' });
    res.json(updatedPost);
  },
);

/**
 * Delete post by id
 * @route DELETE /api/posts/:id
 */
export const deletePost = asyncWrapper(
  async (
    req: Request<{ id: string }>,
    res: Response<Post.Delete.Response | ErrorResponse>,
  ) => {
    // Delete the post
    const deletedPost = await PostModel.findByIdAndDelete(req.params.id);

    if (!deletedPost) {
      return res.status(404).send({ message: 'Post not found' });
    }

    // Update the user to remove the deleted post
    const updatedUser = await UserModel.findByIdAndUpdate(
      deletedPost.author,
      { $pull: { posts: deletedPost._id } },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(204).send();
  },
);

/**
 * Vote action
 * @param req - Request object
 * @param res - Response object
 * @param postUpdate - Post update action
 * @param userUpdate - User update action
 */
const voteAction = async (
  req: Request<{ id: string }, {}, Post.Vote.Payload>,
  res: Response<Post.Vote.Response<Schema.Types.ObjectId> | ErrorResponse>,
  postUpdate: UpdateQuery<typeof PostModel>,
  userUpdate: UpdateQuery<typeof UserModel>,
) => {
  // Update the post with the specified action
  const updatedPost = await PostModel.findByIdAndUpdate(
    req.params.id,
    postUpdate,
    { new: true },
  );

  if (!updatedPost) {
    return res.status(404).send({ message: 'Post not found' });
  }

  // Update the user with the specified action
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.body.userId,
    userUpdate,
    { new: true },
  );

  if (!updatedUser) {
    return res.status(404).send({ message: 'User not found' });
  }

  res.json(updatedPost);
};

/**
 * Upvote post by id
 * @route POST /api/posts/:id/upvote
 */
export const upvotePost = asyncWrapper(
  (
    req: Request<{ id: string }, {}, Post.Vote.Payload>,
    res: Response<Post.Vote.Response<Schema.Types.ObjectId> | ErrorResponse>,
  ) =>
    voteAction(
      req,
      res,
      { $push: { upvotes: req.body.userId } },
      { $push: { upvotes: req.params.id } },
    ),
);

/**
 * Downvote post by id
 * @route POST /api/posts/:id/downvote
 */
export const downvotePost = asyncWrapper(
  (
    req: Request<{ id: string }, {}, Post.Vote.Payload>,
    res: Response<Post.Vote.Response<Schema.Types.ObjectId> | ErrorResponse>,
  ) =>
    voteAction(
      req,
      res,
      { $push: { downvotes: req.body.userId } },
      { $push: { downvotes: req.params.id } },
    ),
);

/**
 * Undo upvote post by id
 * @route POST /api/posts/:id/undo-upvote
 */
export const undoUpvotePost = asyncWrapper(
  (
    req: Request<{ id: string }, {}, Post.Vote.Payload>,
    res: Response<Post.Vote.Response<Schema.Types.ObjectId> | ErrorResponse>,
  ) =>
    voteAction(
      req,
      res,
      { $pull: { upvotes: req.body.userId } },
      { $pull: { upvotes: req.params.id } },
    ),
);

/**
 * Undo downvote post by id
 * @route POST /api/posts/:id/undo-downvote
 */
export const undoDownvotePost = asyncWrapper(
  (
    req: Request<{ id: string }, {}, Post.Vote.Payload>,
    res: Response<Post.Vote.Response<Schema.Types.ObjectId> | ErrorResponse>,
  ) =>
    voteAction(
      req,
      res,
      { $pull: { downvotes: req.body.userId } },
      { $pull: { downvotes: req.params.id } },
    ),
);
