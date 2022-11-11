import React, { useEffect } from 'react';
import { LeaderboardTable } from './Table';
// http://62.141.38.231:1317/swagger/
// https://peer1.testnet.uptick.network:1318/;

function App() {
  let baseurl = 'http://62.141.38.231:1317';
  let delegatorAddr = 'uptick1ncn0k65x3esuzxztzymd0s0kwhun7wxnrcc9mw';

  return (
    <div className="App">
      <LeaderboardTable />
    </div>
  );
}

export default App;
