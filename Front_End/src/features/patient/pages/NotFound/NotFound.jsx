import { Link } from 'react-router-dom';
import Button from '../../../../shared/components/Button/Button';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.page}>
      <h1>404</h1>
      <p>We couldn't find the page you were looking for.</p>
      <Link to="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
}
