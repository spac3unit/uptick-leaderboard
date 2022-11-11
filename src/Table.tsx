import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

import '@fontsource/jetbrains-mono';

function createData(valoperAddr: string, tokensAmount: any) {
  return { valoperAddr, tokensAmount };
}

// let baseurl = 'http://62.141.38.231:1317';

export function LeaderboardTable() {
  const [data, setData] = useState();
  const [tableRows, setTableRows] = useState<any>([]);
  const [delegatorAddress, setDelegatorAddress] = useState('uptick1ncn0k65x3esuzxztzymd0s0kwhun7wxnrcc9mw');
  let baseurl = 'https://uptick-leaderboard.duckdns.org';
  // let baseurl = 'https://peer1.testnet.uptick.network:1318';

  const handleDelegatorAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDelegatorAddress(event.target.value);
  };

  useEffect(() => {
    fetch(`${baseurl}/cosmos/staking/v1beta1/delegations/${delegatorAddress}`)
      .then((response) => response.json())
      .then((delegationsData) => {
        setData(delegationsData.delegation_responses);

        delegationsData.delegation_responses.map((item: any) => {
          setTableRows((current: any) => [
            ...current,
            createData(item.delegation.validator_address, item.delegation.shares),
          ]);
        });

        console.log(delegationsData.delegation_responses);
      });
  }, [delegatorAddress]);

  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ m: '18px 0 38px 0' }}>
        🏆 Game of Uptick Testnet Leaderboard 🏆
      </Typography>

      <Box
        component="div"
        sx={{
          maxWidth: '500px',
          mb: '22px',
        }}
      >
        <TextField
          value={delegatorAddress}
          onChange={handleDelegatorAddressChange}
          label="Delegator address"
          fullWidth
          variant="standard"
          spellCheck={false}
        />
      </Box>

      {data && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Valoper address</TableCell>
                <TableCell>Tokens amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows
                .sort((a: any, b: any) => {
                  return b.tokensAmount - a.tokensAmount;
                })
                .map((row: any, idx: any) => (
                  <TableRow key={row.valoperAddr} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>#{idx + 1} </TableCell>
                    <TableCell component="th" scope="row">
                      {row.valoperAddr}
                    </TableCell>
                    <TableCell>{row.tokensAmount} auptick</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
