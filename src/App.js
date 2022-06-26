import { CommentProvider } from './context/CommentContext';
import CommentList from './components/CommentList';
import CommentForm from './components/CommentForm';
import Modal from './components/Modal';

function App() {
  return (
    <CommentProvider>
      <div className='container'>
        <CommentList />
        <CommentForm />
        <Modal />
      </div>
    </CommentProvider>
  );
}
export default App;
