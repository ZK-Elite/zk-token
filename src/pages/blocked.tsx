import React from 'react';
import './blocked.css';

function BlockedPage() {
  return (
    <div className="blocked-page">
      <h1>ZKML Rate Limiting</h1>
      <p>
        You are now rate limited after exceeding 5 requests in 10 seconds based on
        your IP address. Please wait 10 seconds and you can return to the
        <code>/</code> route.
      </p>
      <p>Too Many Requests</p>
    </div>
  );
}

export default BlockedPage;
