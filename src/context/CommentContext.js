import { createContext, useContext, useReducer, useEffect } from 'react';
import commentReducer from './CommentReducer';
import axios from 'axios';
import dayjs from 'dayjs';

const instance = axios.create({
  baseURL: 'http://localhost:3004',
});

const initialState = {
  isLoading: true,
  currentUser: null,
  comments: [],
  replyingTo: null,
  currentComment: null,
  commentToEdit: null,
  replyToEdit: null,
  showAction: true,
  showModal: false,
  modalResult: false,
};

const CommentContext = createContext();

const CommentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(commentReducer, initialState);

  const getCurrentUser = async () => {
    const { data } = await instance.get('/currentUser');
    dispatch({
      type: 'GET_CURRENT_USER',
      payload: data,
    });
  };

  const getComments = async () => {
    const { data } = await instance.get('/comments');

    // Sort comment by vote
    data.sort((a, b) => {
      return b.score - a.score;
    });

    // Sort replies by time added
    data.forEach((comment) =>
      comment.replies.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    );

    dispatch({
      type: 'GET_COMMENTS',
      payload: data,
    });
  };

  useEffect(() => {
    getCurrentUser();
    getComments();
  }, []);

  const setCurrentComment = (commentId) => {
    dispatch({
      type: 'SET_CURRENT_COMMENT',
      payload: commentId,
    });
  };

  const addComment = async (comment) => {
    const { data } = await instance.post('/comments', comment);

    dispatch({
      type: 'ADD_COMMENT',
      payload: data,
    });
  };

  const addReply = async (reply) => {
    const currentComment = state.currentComment;

    const { data } = await instance.put(`/comments/${currentComment.id}`, {
      ...currentComment,
      replies: [...currentComment.replies, reply],
    });

    dispatch({
      type: 'ADD_REPLY',
      payload: data,
    });
  };

  const setReplyingTo = (username) =>
    dispatch({
      type: 'SET_REPLYING_TO',
      payload: username,
    });

  const deleteComment = async (commentId) => {
    await instance.delete(`/comments/${commentId}`);

    dispatch({ type: 'DELETE_COMMENT', payload: commentId });
  };

  const deleteReply = async (replyId) => {
    const currentComment = state.currentComment;
    let replies = currentComment.replies;

    replies = replies.filter((reply) => reply.id !== replyId);

    const updatedComment = (
      await instance.put(`/comments/${currentComment.id}`, {
        ...currentComment,
        replies,
      })
    ).data;

    dispatch({ type: 'DELETE_REPLY', payload: updatedComment });
  };

  const setCommentToEdit = (commentId) => {
    dispatch({
      type: 'SET_COMMENT_TO_EDIT',
      payload: commentId,
    });
  };

  const setReplyToEdit = (replyId) => {
    dispatch({
      type: 'SET_REPLY_TO_EDIT',
      payload: replyId,
    });
  };

  const updateComment = async (updatedComment) => {
    const { data } = await instance.put(
      `/comments/${state.commentToEdit.id}`,
      updatedComment
    );

    dispatch({
      type: 'UPDATE_COMMENT',
      payload: data,
    });
  };

  const updateReply = async (updatedReply) => {
    const currentComment = state.currentComment;
    let replies = currentComment.replies;

    replies = replies.map((reply) =>
      reply.id === state.replyToEdit.id ? updatedReply : reply
    );

    const { data } = await instance.put(
      `/comments/${state.currentComment.id}`,
      {
        ...currentComment,
        replies,
      }
    );

    dispatch({
      type: 'UPDATE_REPLY',
      payload: data,
    });
  };

  const vote = async (option, commentId, replyId) => {
    if (!replyId) {
      // Vote comment
      let currentComment = state.currentComment;
      currentComment.score =
        option === 'upvote'
          ? currentComment.score + 1
          : currentComment.score - 1;

      const { data } = await instance.put(
        `/comments/${commentId}`,
        currentComment
      );

      dispatch({
        type: 'VOTE',
        payload: data,
      });
    } else {
      // Vote reply
      let currentComment = state.currentComment;
      let replies = currentComment.replies;

      replies = replies.map((reply) =>
        reply.id === replyId
          ? {
              ...reply,
              score: option === 'upvote' ? reply.score + 1 : reply.score - 1,
            }
          : reply
      );

      const { data } = await instance.put(`/comments/${commentId}`, {
        ...currentComment,
        replies,
      });

      dispatch({
        type: 'VOTE',
        payload: data,
      });
    }
  };

  const setShowAction = (boolean) => {
    dispatch({
      type: 'SET_SHOW_ACTION',
      payload: boolean,
    });
  };

  const setShowModal = (boolean) => {
    dispatch({ type: 'SET_SHOW_MODAL', payload: boolean });
  };

  const setModalResult = (boolean) => {
    dispatch({
      type: 'SET_MODAL_RESULT',
      payload: boolean,
    });
  };

  const countElapsedTime = (createdAt) => {
    let seconds = dayjs().diff(createdAt, 'second');
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 24);
    let weeks = Math.floor(days / 7);
    let months = Math.floor(weeks / 4);
    let years = Math.floor(months / 12);

    if (years >= 1) {
      return `${years} ${years > 1 ? 'years' : 'year'} ago`;
    } else if (12 > months && months >= 1) {
      return `${months} ${months > 1 ? 'months' : 'month'} ago`;
    } else if (4 > weeks && weeks >= 1) {
      return `${weeks} ${weeks > 1 ? 'weeks' : 'week'} ago`;
    } else if (31 > days && days >= 1) {
      return `${days} ${days > 1 ? 'days' : 'day'} ago`;
    } else if (24 > hours && hours >= 1) {
      return `${hours} ${hours > 1 ? 'hours' : 'hour'} ago`;
    } else if (60 > minutes && minutes >= 1) {
      return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'} ago`;
    } else if (60 > seconds && seconds >= 1) {
      return `${seconds} ${seconds > 1 ? 'seconds' : 'second'} ago`;
    }
  };

  return (
    <CommentContext.Provider
      value={{
        isLoading: state.isLoading,
        currentUser: state.currentUser,
        comments: state.comments,
        replyingTo: state.replyingTo,
        currentComment: state.currentComment,
        commentToEdit: state.commentToEdit,
        replyToEdit: state.replyToEdit,
        showAction: state.showAction,
        showModal: state.showModal,
        modalResult: state.modalResult,
        setCurrentComment,
        addComment,
        addReply,
        setReplyingTo,
        setCommentToEdit,
        setReplyToEdit,
        updateComment,
        updateReply,
        deleteComment,
        deleteReply,
        vote,
        setShowAction,
        setShowModal,
        setModalResult,
        countElapsedTime,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};

const useCommentContext = () => useContext(CommentContext);

export { CommentProvider, useCommentContext };
