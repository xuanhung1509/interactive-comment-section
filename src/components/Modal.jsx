import { useCommentContext } from '../context/CommentContext';

function Modal() {
  const { showModal, setShowModal, setModalResult } = useCommentContext();

  const handleSelectYes = () => {
    setModalResult(true);
    setShowModal(false);
  };

  const handleSelectNo = () => {
    setModalResult(false);
    setShowModal(false);
  };

  if (showModal)
    return (
      <div className='backdrop'>
        <div className='modal'>
          <h3>Delete comment</h3>
          <p>
            Are you sure you want to delete this comment? This will remove the
            comment and can't be undone.
          </p>
          <div className='btn-group'>
            <button className='btn btn-secondary' onClick={handleSelectNo}>
              No, Cancel
            </button>
            <button className='btn btn-danger' onClick={handleSelectYes}>
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    );
}
export default Modal;
