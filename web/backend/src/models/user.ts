import { User as UserType } from '@shared/types';
import bcrypt from 'bcrypt';
import mongoose, { Schema, Document } from 'mongoose';

interface UserModel
  extends Omit<UserType<Schema.Types.ObjectId> & { password: string }, '_id'>,
    Document {}

const userSchema = new Schema<UserModel>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  sex: { type: String, enum: ['Male', 'Female', 'Other'] },
  bio: { type: String, default: 'No bio' },
  image: { type: String },
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'Post', default: [] }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: 'Post', default: [] }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post', default: [] }],
});

// Hash password before saving
userSchema.pre<UserModel>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt();
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

const User = mongoose.model<UserModel>('User', userSchema);

export default User;
