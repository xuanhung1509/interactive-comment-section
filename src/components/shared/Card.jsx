import { useCommentContext } from '../../context/CommentContext';
import { ReactComponent as IconReply } from '../../assets/images/icon-reply.svg';
import { ReactComponent as IconDelete } from '../../assets/images/icon-delete.svg';
import { ReactComponent as IconEdit } from '../../assets/images/icon-edit.svg';
import Score from '../Score';

import { useState, useEffect } from 'react';

function Card({
  commentId,
  replyId,
  score,
  user,
  createdAt,
  replyingTo,
  content,
}) {
  const {
    currentUser,
    currentComment,
    setCurrentComment,
    setReplyingTo,
    setCommentToEdit,
    setReplyToEdit,
    deleteComment,
    deleteReply,
    showAction,
    setShowAction,
    setShowModal,
    modalResult,
    setModalResult,
    countElapsedTime,
  } = useCommentContext();
  const [shouldReply, setShouldReply] = useState(false);
  const [shouldDelete, setShouldDelete] = useState(false);
  const [shouldEdit, setShouldEdit] = useState(false);

  const handleReply = () => {
    setCurrentComment(commentId);
    setShouldReply(true);
    setShowAction(false);
  };

  const handleEdit = () => {
    setCurrentComment(commentId);
    setShouldEdit(true);
    setShowAction(false);
  };

  const handleDelete = () => {
    setCurrentComment(commentId);
    setShouldDelete(true);
    setShowModal(true);
  };

  useEffect(() => {
    if (shouldReply && currentComment) {
      setReplyingTo(user.username);
      setShouldReply(false);
    }

    if (shouldDelete && currentComment) {
      if (modalResult) {
        if (!replyId) {
          deleteComment(commentId);
        } else {
          deleteReply(replyId);
        }

        setShouldDelete(false);
        setModalResult(null);
      }
    }

    if (shouldEdit && currentComment) {
      if (!replyId) {
        setCommentToEdit(commentId);
      } else {
        setReplyToEdit(replyId);
      }

      setShouldEdit(false);
    }
    // eslint-disable-next-line
  }, [shouldReply, shouldDelete, shouldEdit, modalResult, currentComment]);

  return (
    <div className='card'>
      <Score score={score} commentId={commentId} replyId={replyId} />
      <div>
        <div className='user'>
          <div className='avatar'>
            <img src={user.image.png} alt={user.username} />
          </div>
          <div className='username'>{user.username}</div>
          {user.username === currentUser?.username && (
            <small className='label'>you</small>
          )}
          <div className='timestamp'>{countElapsedTime(createdAt)}</div>
        </div>
        <>
          {showAction && (
            <>
              <div className='action'>
                {user.username === currentUser?.username ? (
                  <>
                    <span className='delete' onClick={handleDelete}>
                      <IconDelete /> Delete
                    </span>
                    <span className='edit' onClick={handleEdit}>
                      <IconEdit /> Edit
                    </span>
                  </>
                ) : (
                  <span className='reply' onClick={handleReply}>
                    <IconReply /> Reply
                  </span>
                )}
              </div>
            </>
          )}
        </>
        <div className='content'>
          {replyingTo && <span className='replying-to'>@{replyingTo} </span>}
          {content}
        </div>
      </div>
    </div>
  );
}
export default Card;
