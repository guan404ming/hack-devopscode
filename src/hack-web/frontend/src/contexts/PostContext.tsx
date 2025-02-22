import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import type { Post } from '@shared/types';
import { PostService } from '@/services/postService';
import { useUser } from './UserContext';

type PostContextType = {
  getPostByIndex: (id: number) => Post.Get.Response | null;
  getPostIndicesByUserId: (userId: string) => number[];
  votePost: (
    index: number,
    userId: string,
    vote: 'upvote' | 'downvote',
  ) => void;
  createPost: (title: string, content: string) => void;
  updatePost: (index: number, title: string, content: string) => void;
  loading: boolean;
  numPosts: number;
};

const PostContext = createContext<PostContextType | null>(null);

export const PostsProvider = ({ children }: PropsWithChildren) => {
  const [posts, setPosts] = useState<Post.Get.Response[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const numPosts: number = posts === null ? 0 : posts.length;

  const { user, upvote, downvote, undoDownvote, undoUpvote } = useUser();

  useEffect(() => {
    (async () => {
      const res = await PostService.getAll();
      setPosts(res);
    })();
  }, []);

  const getPostByIndex = (index: number) => {
    if (posts === null) return null;
    return posts[index];
  };

  const getPostIndicesByUserId = (userId: string) => {
    if (posts === null) return [];
    return posts
      .map((post, index) => (post.author._id === userId ? index : -1))
      .filter((index) => index !== -1);
  };

  const createPost = async (title: string, content: string) => {
    if (user === null) return;
    const newPost = await PostService.create({
      title,
      content,
      author: user._id,
    });
    setPosts((prevPosts) =>
      prevPosts === null ? null : [...prevPosts, newPost],
    );
  };

  /* TODO 3.3: Edit User Posts With Editor (8%) */
  const updatePost = async (index: number, title: string, content: string) => {
    if (posts === null) return;
    /* Hint 3.3.1: Use the correct API from `PostService` to update DB */
    await PostService.update(posts[index]._id, {
      ...posts[index],
      title,
      content,
      author: posts[index].author._id,
    });
    /* Hint 3.3.2: Use React hook to update frontend */
    const newPosts = [...posts];
    newPosts[index].title = title;
    newPosts[index].content = content;
    setPosts(newPosts);
  };
  /* END TODO 3.3 */

  /* TODO 2.5: Handle Voting for Voted Posts (16%) */
  const votePost = async (
    index: number,
    userId: string,
    vote: 'upvote' | 'downvote',
  ) => {
    if (posts === null || user === null) return;
    if (loading) return;
    if (vote === 'upvote') {
      setLoading(true);
      if (posts[index].upvotes.indexOf(user._id) !== -1) {
        await undoUpvotePost(index, userId);
      } else if (posts[index].downvotes.indexOf(user._id) !== -1) {
        await undoDownvotePost(index, userId);
        await upvotePost(index, userId);
      } else {
        await upvotePost(index, userId);
      }
      setLoading(false);
    } else if (vote === 'downvote') {
      setLoading(true);
      if (posts[index].upvotes.indexOf(user._id) !== -1) {
        await undoUpvotePost(index, userId);
        await downvotePost(index, userId);
      } else if (posts[index].downvotes.indexOf(user._id) !== -1) {
        await undoDownvotePost(index, userId);
      } else {
        await downvotePost(index, userId);
      }
      setLoading(false);
    }
  };
  /* END TODO 2.5 */

  const upvotePost = async (index: number, userId: string) => {
    if (posts === null) return;
    const newPosts = [...posts];
    newPosts[index].upvotes = [...newPosts[index].upvotes, userId];
    setPosts(newPosts);
    upvote(posts[index]._id);
    await PostService.upvote(posts[index]._id, userId);
  };

  const downvotePost = async (index: number, userId: string) => {
    if (posts === null) return;
    const newPosts = [...posts];
    newPosts[index].downvotes = [...newPosts[index].downvotes, userId];
    setPosts(newPosts);
    downvote(posts[index]._id);
    await PostService.downvote(posts[index]._id, userId);
  };

  const undoUpvotePost = async (index: number, userId: string) => {
    if (posts === null) return;
    const newPosts = [...posts];
    newPosts[index].upvotes = newPosts[index].upvotes.filter(
      (id) => id !== userId,
    );
    setPosts(newPosts);
    undoUpvote(posts[index]._id);
    await PostService.undoUpvote(posts[index]._id, userId);
  };

  const undoDownvotePost = async (index: number, userId: string) => {
    if (posts === null) return;
    const newPosts = [...posts];
    newPosts[index].downvotes = newPosts[index].downvotes.filter(
      (id) => id !== userId,
    );
    setPosts(newPosts);
    undoDownvote(posts[index]._id);
    await PostService.undoDownvote(posts[index]._id, userId);
  };

  return (
    <PostContext.Provider
      value={{
        loading,
        numPosts,
        getPostByIndex,
        getPostIndicesByUserId,
        votePost,
        createPost,
        updatePost,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => {
  const postContext = useContext(PostContext);
  if (postContext === null)
    throw 'PostContext Should Only be Used inside PostsProvider';
  return postContext;
};
