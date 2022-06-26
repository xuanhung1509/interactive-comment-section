import { useState, useEffect } from 'react';
import { useCommentContext } from '../context/CommentContext';
import { ReactComponent as IconPlus } from '../assets/images/icon-plus.svg';
import { ReactComponent as IconMinus } from '../assets/images/icon-minus.svg';

function Score({ score, commentId, replyId }) {
  const { currentComment, setCurrentComment, vote } = useCommentContext();
  const [option, setOption] = useState(null);

  const handleVote = (option) => {
    setCurrentComment(commentId);
    setOption(option);
  };

  useEffect(() => {
    if (option && currentComment) {
      vote(option, commentId, replyId);
      setOption(null);
    }
    // eslint-disable-next-line
  }, [option, currentComment]);

  return (
    <div className='score'>
      <span className='icon' onClick={() => handleVote('upvote')}>
        <IconPlus />
      </span>
      <span>{score}</span>
      <div className='icon' onClick={() => handleVote('downvote')}>
        <IconMinus />
      </div>
    </div>
  );
}
export default Score;
