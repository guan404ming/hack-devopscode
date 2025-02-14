import React, { useCallback, useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import ViewFooter from '@/components/ViewFooter';
import { usePost } from '@/contexts/PostContext';
import { useUser } from '@/contexts/UserContext';

const View = (): React.ReactNode => {
  const { user } = useUser();
  const { loading, numPosts, getPostByIndex, votePost } = usePost();
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const post = getPostByIndex(selectedIndex);
  const hasUpvoted = user && post?.upvotes.indexOf(user._id) !== -1;
  const hasDownvoted = user && post?.downvotes.indexOf(user._id) !== -1;

  const handleNextClick = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % numPosts);
  }, [numPosts]);

  const handlePrevClick = useCallback(() => {
    setSelectedIndex((prev) => (prev + numPosts - 1) % numPosts);
  }, [numPosts]);

  const getVoteClickHandler = (vote: 'upvote' | 'downvote') => {
    return () => handleVoteClick(vote);
  };

  const handleVoteClick = (vote: 'upvote' | 'downvote') => {
    if (post === null || user === null) return false;
    votePost(selectedIndex, user._id, vote);
  };

  useEffect(() => {
    const handleKeyPress = (e: { code: string }) => {
      if (e.code === 'ArrowRight') {
        handleNextClick();
      } else if (e.code === 'ArrowLeft') {
        handlePrevClick();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNextClick, handlePrevClick]);

  return post ? (
    <>
      <PostCard post={post} />
      <div className="mt-auto">
        <ViewFooter
          downvoteClickHandler={getVoteClickHandler('downvote')}
          upvoteClickHandler={getVoteClickHandler('upvote')}
          hasDownvoted={hasDownvoted || false}
          hasUpvoted={hasUpvoted || false}
          nextClickHandler={handleNextClick}
          prevClickHandler={handlePrevClick}
          totalVotes={post.upvotes.length - post.downvotes.length}
          loading={loading}
        />
      </div>
    </>
  ) : (
    <div className="flex h-full items-center justify-center">
      There are no posts to view.
    </div>
  );
};

export default View;
