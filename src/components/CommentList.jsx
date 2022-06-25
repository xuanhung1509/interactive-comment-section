import { useCommentContext } from '../context/CommentContext';
import CommentItem from './CommentItem';
import Spinner from './Spinner';

function CommentList() {
  const { isLoading, comments } = useCommentContext();

  if (isLoading) return <Spinner />;

  if (comments)
    return (
      <div className='comment-list'>
        {comments.map((comment) => (
          <CommentItem key={comment.id} {...comment} />
        ))}
      </div>
    );
}
export default CommentList;
