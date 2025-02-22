import express from 'express';
import {
  createPost,
  deletePost,
  downvotePost,
  getPost,
  getPosts,
  undoDownvotePost,
  undoUpvotePost,
  updatePost,
  upvotePost,
} from '@/controllers/post';

const postRouter = express.Router();

// GET /api/posts
postRouter.get('/', getPosts);
// POST /api/posts
postRouter.post('/', createPost);
// POST /api/posts/new
postRouter.post('/new', createPost);
// GET /api/posts/:id
postRouter.get('/:id', getPost);
// PUT /api/posts/:id
postRouter.put('/:id', updatePost);
// DELETE /api/posts/:id
postRouter.delete('/:id', deletePost);
// POST /api/posts/:id/upvote
postRouter.post('/:id/upvote', upvotePost);
// POST /api/posts/:id/downvote
postRouter.post('/:id/downvote', downvotePost);
// POST /api/posts/:id/undo-upvote
postRouter.post('/:id/undo-upvote', undoUpvotePost);
// POST /api/posts/:id/undo-downvote
postRouter.post('/:id/undo-downvote', undoDownvotePost);

export default postRouter;
