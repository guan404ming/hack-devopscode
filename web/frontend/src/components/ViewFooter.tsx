import {
  ArrowBigDownIcon,
  ArrowBigUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type ViewFooterPropsType = {
  downvoteClickHandler: () => void;
  upvoteClickHandler: () => void;
  hasUpvoted: boolean;
  hasDownvoted: boolean;
  nextClickHandler: () => void;
  prevClickHandler: () => void;
  totalVotes: number;
  loading: boolean;
};

const ViewFooter = ({
  downvoteClickHandler,
  upvoteClickHandler,
  hasUpvoted,
  hasDownvoted,
  nextClickHandler,
  prevClickHandler,
  totalVotes,
  loading,
}: ViewFooterPropsType) => {
  return (
    <div className="flex h-[2rem] w-lg justify-between">
      <Button
        data-testid="prev-btn"
        className="h-full rounded-none"
        onClick={prevClickHandler}
      >
        <ChevronLeftIcon />
      </Button>
      <div className="flex items-center justify-center gap-4">
        <Button
          className="h-full rounded-none"
          variant="ghost"
          onClick={upvoteClickHandler}
          disabled={loading}
          data-testid="upvote-btn"
        >
          <ArrowBigUpIcon
            data-testid="upvote-icon"
            size={18}
            fill={hasUpvoted ? 'currentColor' : ''}
          />
        </Button>
        <p>{totalVotes}</p>
        <Button
          className="h-full rounded-none"
          variant="ghost"
          onClick={downvoteClickHandler}
          disabled={loading}
          data-testid="downvote-btn"
        >
          <ArrowBigDownIcon
            data-testid="downvote-icon"
            size={18}
            fill={hasDownvoted ? 'currentColor' : ''}
          />
        </Button>
      </div>
      <Button
        data-testid="next-btn"
        className="h-full rounded-none"
        onClick={nextClickHandler}
      >
        <ChevronRightIcon />
      </Button>
    </div>
  );
};

export default ViewFooter;
