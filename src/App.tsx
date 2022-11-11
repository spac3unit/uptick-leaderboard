import React, { useEffect } from 'react';
import { LeaderboardTable } from './Table';
// http://62.141.38.231:1317/swagger/
// https://peer1.testnet.uptick.network:1318;
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'JetBrains Mono',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

function App() {
  let baseurl = 'http://62.141.38.231:1317';
  let delegatorAddr = 'uptick1ncn0k65x3esuzxztzymd0s0kwhun7wxnrcc9mw';

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <LeaderboardTable />
      </div>
    </ThemeProvider>
  );
}

export default App;
