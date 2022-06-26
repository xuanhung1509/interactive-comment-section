import { useCommentContext } from '../context/CommentContext';
import CommentItem from './CommentItem';
import Spinner from './Spinner';

function CommentList() {
  const { isLoading, comments } = useCommentContext();

  if (isLoading) return <Spinner />;
  // console.log(comments);

  if (comments)
    return (
      <div className='comment-list'>
        {comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <CommentItem key={comment.id} {...comment} />
            ))}
          </>
        ) : (
          <h3 className='fallback'>
            Your post does not have any comments yet.
          </h3>
        )}
      </div>
    );
}
export default CommentList;
