import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Post } from '@shared/types';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

const PostCard = ({
  post,
}: {
  post: Post.Get.Response | null;
}): React.ReactNode => {
  if (!post) return null;
  return (
    <div className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-1">
          <img
            src={
              post.author.image ||
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnJDK2azmmfkbFYv8t-31oopd488mLSBMCacXmAmeIHX41HxWnzbakuuCEilPNooWAWAM&usqp=CAU'
            }
            alt="avatar"
            className="h-6 w-6 rounded-sm object-cover"
          />
          <p data-testid="post-author">{post.author.username}</p>
        </CardTitle>
        <CardDescription data-testid="post-date">
          Posted on {formatter.format(new Date(post.createdAt))}
        </CardDescription>
      </CardHeader>
      <CardContent data-testid="post-title">{post.title}</CardContent>
      <CardFooter className="flex w-full justify-between">
        <SyntaxHighlighter
          className="w-full"
          language="javascript"
          style={vscDarkPlus}
          wrapLongLines
          showLineNumbers
          data-testid="post-content"
        >
          {post.content}
        </SyntaxHighlighter>
      </CardFooter>
    </div>
  );
};

export default PostCard;
