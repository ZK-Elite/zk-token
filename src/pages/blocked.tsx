import { Link } from 'react-router-dom';
import './blocked.css';

function BlockedPage() {
  return (
    <div className="blocked-page">
      <h1>ZKML Rate Limiting</h1>
      <p>
      Sorry, you've exceeded the maximum number of requests allowed at this time. Please try again later.
      </p>
      <u><Link to={"/"}> Back Home </Link></u>
    </div>
  );
}

export default BlockedPage;
