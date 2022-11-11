import React, { useState, useEffect } from 'react';
import { Decimal } from '@cosmjs/math';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

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

function createData(rank: any, avatar: any, moniker: string, operatorAddress: any, tokensAmount: any) {
  return { rank, avatar, moniker, operatorAddress, tokensAmount };
}

function convertExponent(n: any) {
  var sign = +n < 0 ? '-' : '',
    toStr = n.toString();
  if (!/e/i.test(toStr)) {
    return n;
  }
  var [lead, decimal, pow] = n
    .toString()
    .replace(/^-/, '')
    .replace(/^([0-9]+)(e.*)/, '$1.$2')
    .split(/e|\./);
  return +pow < 0
    ? sign + '0.' + '0'.repeat(Math.max(Math.abs(pow) - 1 || 0, 0)) + lead + decimal
    : sign +
        lead +
        (+pow >= decimal.length
          ? decimal + '0'.repeat(Math.max(+pow - decimal.length || 0, 0))
          : decimal.slice(0, +pow) + '.' + decimal.slice(+pow));
}

// let baseurl = 'http://62.141.38.231:1317';

export function LeaderboardTableWithMoniker() {
  const [data, setData] = useState([]);
  const [tableRows, setTableRows] = useState<any>([]);
  const [delegatorAddress, setDelegatorAddress] = useState('uptick1ncn0k65x3esuzxztzymd0s0kwhun7wxnrcc9mw');
  const [validatorAddress, setValidatorAddress] = useState('');

  // let baseurl = 'https://uptick-leaderboard.duckdns.org';
  let baseurl = 'https://peer1.testnet.uptick.network:1318';

  const handleDelegatorAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTableRows([]);
    setDelegatorAddress(event.target.value);
  };

  const handleValidatorAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValidatorAddress(event.target.value);
  };

  useEffect(() => {
    fetch(`https://uptick.api.explorers.guru/api/v1/accounts/${delegatorAddress}/delegations`)
      .then((response) => response.json())
      .then((delegationsData) => {
        let newArr: any = [];
        delegationsData.map((item: any) => {
          newArr.push({
            moniker: item.validator.moniker,
            operatorAddress: item.validator.operatorAddress,
            avatar: item.validator.avatar,
            status: item.status,
            tokensAmount: Math.round(item.tokens.amount),
          });
        });

        newArr
          .sort((a: any, b: any) => {
            return b.tokensAmount - a.tokensAmount;
          })
          .map((item: any, idx: any) => {
            const rank = idx + 1;
            setTableRows((current: any) => [
              ...current,
              createData(rank, item.avatar, item.moniker, item.operatorAddress, item.tokensAmount),
            ]);
          });

        console.log(newArr);
      });
  }, []);

  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ m: '18px 0 38px 0' }}>
        🏆 Game of Uptick Testnet Leaderboard 🏆
      </Typography>

      <Box
        component="div"
        sx={{
          display: 'flex',
          gap: '92px',
          mb: '24px',
        }}
      >
        <TextField
          value={validatorAddress}
          onChange={handleValidatorAddressChange}
          label="Search address or moniker"
          fullWidth
          variant="standard"
          spellCheck={false}
        />

        <TextField
          value={delegatorAddress}
          onChange={handleDelegatorAddressChange}
          label="Delegator address"
          fullWidth
          variant="standard"
          spellCheck={false}
        />
      </Box>

      {tableRows && (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Moniker</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="right">Tokens amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows
                .filter(
                  (item: any) =>
                    item.moniker.includes(validatorAddress) || item.operatorAddress.includes(validatorAddress)
                )
                .map((row: any) => (
                  <TableRow key={row.moniker} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>#{row.rank}</TableCell>
                    <TableCell component="th" scope="row">
                      <Link href={`https://uptick.explorers.guru/validator/${row.operatorAddress}`} underline="hover">
                        <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Avatar sx={{ width: 28, height: 28 }} src={row.avatar} /> {row.moniker}
                        </Box>
                      </Link>
                    </TableCell>
                    <TableCell component="th" scope="row" align="left">
                      {row.operatorAddress}
                    </TableCell>
                    <TableCell align="right">
                      {BigInt(row.tokensAmount).toLocaleString()} uptick
                      {/* {row.tokensAmount.toString().substring(0, row.tokensAmount.toString().indexOf('.') + 7)} uptick */}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
