import { Post as PostType } from '@shared/types';
import mongoose, { Schema, Document } from 'mongoose';

interface PostModel
  extends Omit<PostType<Schema.Types.ObjectId>, '_id'>,
    Document {}

const postSchema = new Schema<PostModel>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, default: 'no content' },
    upvotes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    downvotes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  },
  { timestamps: true },
);

const Post = mongoose.model<PostModel>('Post', postSchema);

export default Post;
