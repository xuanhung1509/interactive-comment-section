import { useState, useRef, useEffect } from 'react';
import { useCommentContext } from '../context/CommentContext';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';

function CommentForm() {
  const {
    currentUser,
    replyingTo,
    commentToEdit,
    replyToEdit,
    addComment,
    addReply,
    updateComment,
    updateReply,
    setShowAction,
    setCommentToEdit,
    setReplyToEdit,
    setReplyingTo,
  } = useCommentContext();

  const inputRef = useRef();
  const [content, setContent] = useState('');

  const handleChangeText = (e) => {
    setContent(e.target.value);
  };

  const handleCancel = () => {
    setCommentToEdit(null);
    setReplyToEdit(null);
    setReplyingTo(null);
    setShowAction(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (content.trim().length > 0) {
      if (commentToEdit) {
        // Update comment
        const comment = {
          ...commentToEdit,
          content,
        };

        updateComment(comment);
      } else if (replyToEdit) {
        // Update reply
        const reply = {
          ...replyToEdit,
          content,
        };

        updateReply(reply);
      } else if (!replyingTo) {
        // Add comment
        const comment = {
          id: uuidv4(),
          content,
          createdAt: dayjs(),
          score: 0,
          user: currentUser,
          replies: [],
        };

        addComment(comment);
      } else {
        // Add reply
        const reply = {
          id: uuidv4(),
          content,
          createdAt: dayjs(),
          score: 0,
          replyingTo,
          user: currentUser,
          replies: [],
        };

        addReply(reply);
      }
    }

    setContent('');
    setShowAction(true);
  };

  // Focus on replying
  useEffect(() => {
    if (replyingTo) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  // Fill comment/ reply to edit to form
  useEffect(() => {
    if (commentToEdit) {
      setContent(commentToEdit.content);
    } else if (replyToEdit) {
      setContent(replyToEdit.content);
    } else {
      setContent('');
      return;
    }

    inputRef.current.focus();
  }, [commentToEdit, replyToEdit]);

  if (currentUser)
    return (
      <form className='comment-form' onSubmit={handleSubmit}>
        <div className='avatar'>
          <img src={currentUser.image.png} alt={currentUser.username} />
        </div>
        <div className='input-container'>
          <input
            type='text'
            placeholder='Add a comment...'
            value={content}
            onChange={handleChangeText}
            ref={inputRef}
          />
          {replyingTo && (
            <small>
              Replying to <span className='replying-to'>@{replyingTo}</span>
            </small>
          )}
        </div>
        <div className='btn-group'>
          <button type='submit' className='btn btn-primary'>
            {commentToEdit || replyToEdit ? 'Update' : 'Send'}
          </button>
          {(commentToEdit || replyToEdit || replyingTo) && (
            <button
              type='button'
              className='btn btn-secondary'
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    );
}
export default CommentForm;
