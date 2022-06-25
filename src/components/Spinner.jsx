import ghostPreloader from '../assets/images/preloader.gif';

function Spinner() {
  return (
    <div className='loading-spinner'>
      <img src={ghostPreloader} alt='loading' />
      <p>Loading...</p>
    </div>
  );
}
export default Spinner;
