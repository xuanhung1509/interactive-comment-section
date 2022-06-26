import { createContext, useContext, useReducer, useEffect } from 'react';
import commentReducer from './CommentReducer';
import dayjs from 'dayjs';
import { db } from '../firebase.config';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

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
    const users = [];
    const q = query(
      collection(db, 'users'),
      where('isCurrentUser', '==', true)
    );
    const querySnap = await getDocs(q);

    querySnap.forEach((doc) => {
      users.push(doc.data());
    });

    const currentUser = users[0];
    delete currentUser.isCurrentUser;

    dispatch({
      type: 'GET_CURRENT_USER',
      payload: currentUser,
    });
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  // Get comments
  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('score', 'desc'));
    const unsub = onSnapshot(q, (querySnap) => {
      const comments = [];
      querySnap.forEach((doc) =>
        comments.push({
          ...doc.data(),
          id: doc.id,
        })
      );

      // Sort replies by time added
      comments.forEach((comment) =>
        comment.replies.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      );

      dispatch({
        type: 'GET_COMMENTS',
        payload: comments,
      });
    });

    return () => unsub();
  }, []);

  const setCurrentComment = (commentId) => {
    dispatch({
      type: 'SET_CURRENT_COMMENT',
      payload: commentId,
    });
  };

  const addComment = async (comment) => {
    await addDoc(collection(db, 'comments'), comment);
  };

  const addReply = async (reply) => {
    const currentComment = state.currentComment;

    await updateDoc(doc(db, 'comments', currentComment.id), {
      ...currentComment,
      replies: [...currentComment.replies, reply],
    });
  };

  const setReplyingTo = (username) =>
    dispatch({
      type: 'SET_REPLYING_TO',
      payload: username,
    });

  const deleteComment = async (commentId) => {
    await deleteDoc(doc(db, 'comments', commentId));
  };

  const deleteReply = async (replyId) => {
    const currentComment = state.currentComment;
    let replies = currentComment.replies;

    replies = replies.filter((reply) => reply.id !== replyId);

    await updateDoc(doc(db, 'comments', currentComment.id), {
      ...currentComment,
      replies,
    });
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
    await updateDoc(doc(db, 'comments', updatedComment.id), updatedComment);
  };

  const updateReply = async (updatedReply) => {
    const currentComment = state.currentComment;
    let replies = currentComment.replies;

    replies = replies.map((reply) =>
      reply.id === state.replyToEdit.id ? updatedReply : reply
    );

    await updateDoc(doc(db, 'comments', currentComment.id), {
      ...currentComment,
      replies,
    });
  };

  const vote = async (option, commentId, replyId) => {
    if (!replyId) {
      // Vote comment
      const currentComment = state.currentComment;
      currentComment.score =
        option === 'upvote'
          ? currentComment.score + 1
          : currentComment.score - 1;

      await updateDoc(doc(db, 'comments', commentId), currentComment);
    } else {
      // Vote reply
      const currentComment = state.currentComment;
      let replies = currentComment.replies;

      replies = replies.map((reply) =>
        reply.id === replyId
          ? {
              ...reply,
              score: option === 'upvote' ? reply.score + 1 : reply.score - 1,
            }
          : reply
      );

      await updateDoc(doc(db, 'comments', commentId), {
        ...currentComment,
        replies,
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
