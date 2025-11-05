import { PropagateLoader } from 'react-spinners';
import s from './Loader.module.css';

const Loader = () => {
  return (
    <div className={s.backdrop}>
        <PropagateLoader color="#000000" size={15} />
    </div>
  );
};

export default Loader;