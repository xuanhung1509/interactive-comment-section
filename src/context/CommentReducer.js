const commentReducer = (state, action) => {
  switch (action.type) {
    case 'GET_CURRENT_USER':
      return {
        ...state,
        currentUser: action.payload,
      };
    case 'GET_COMMENTS':
      return {
        ...state,
        isLoading: false,
        comments: action.payload,
      };
    case 'SET_CURRENT_COMMENT':
      return {
        ...state,
        currentComment: state.comments.find(
          (comment) => comment.id === action.payload
        ),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        comments: [...state.comments, action.payload],
      };

    case 'ADD_REPLY':
      return {
        ...state,
        comments: [
          ...state.comments.map((comment) =>
            comment.id === action.payload.id ? action.payload : comment
          ),
        ],
        replyingTo: null,
      };
    case 'SET_REPLYING_TO':
      return {
        ...state,
        replyingTo: action.payload,
      };
    case 'DELETE_COMMENT':
      return {
        ...state,
        comments: [
          ...state.comments.filter((comment) => comment.id !== action.payload),
        ],
      };
    case 'DELETE_REPLY':
      return {
        ...state,
        comments: [
          ...state.comments.map((comment) =>
            comment.id === action.payload.id ? action.payload : comment
          ),
        ],
      };
    case 'SET_COMMENT_TO_EDIT':
      return {
        ...state,
        commentToEdit: state.comments.find(
          (comment) => comment.id === action.payload
        ),
        replyToEdit: null,
      };
    case 'SET_REPLY_TO_EDIT':
      return {
        ...state,
        replyToEdit: state.currentComment.replies.find(
          (reply) => reply.id === action.payload
        ),
        commentToEdit: null,
      };
    case 'UPDATE_COMMENT':
      return {
        ...state,
        comments: [
          ...state.comments.map((comment) =>
            comment.id === action.payload.id ? action.payload : comment
          ),
        ],
        commentToEdit: null,
      };
    case 'UPDATE_REPLY':
      return {
        ...state,
        comments: [
          ...state.comments.map((comment) =>
            comment.id === action.payload.id ? action.payload : comment
          ),
        ],
        replyToEdit: null,
      };
    case 'VOTE':
      return {
        ...state,
        comments: [
          ...state.comments.map((comment) =>
            comment.id === action.payload.id ? action.payload : comment
          ),
        ],
      };
    case 'SET_SHOW_ACTION':
      return {
        ...state,
        showAction: action.payload,
      };
    case 'SET_SHOW_MODAL':
      return {
        ...state,
        showModal: action.payload,
      };
    case 'SET_MODAL_RESULT':
      return {
        ...state,
        modalResult: action.payload,
      };
    default:
      return state;
  }
};

export default commentReducer;
