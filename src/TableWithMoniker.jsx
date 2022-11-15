import React, { useState, useEffect } from 'react';
import { truncate } from './utils';
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

function createData(rank, avatar, moniker, operatorAddress, tokensAmount) {
  return { rank, avatar, moniker, operatorAddress, tokensAmount };
}

function scientificToDecimal(num) {
  var nsign = Math.sign(num);
  //remove the sign
  num = Math.abs(num);
  //if the number is in scientific notation remove it
  if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    var zero = '0',
      parts = String(num).toLowerCase().split('e'), //split into coeff and exponent
      e = parts.pop(), //store the exponential part
      l = Math.abs(e), //get the number of zeros
      sign = e / l,
      coeff_array = parts[0].split('.');
    if (sign === -1) {
      l = l - coeff_array[0].length;
      if (l < 0) {
        num =
          coeff_array[0].slice(0, l) + '.' + coeff_array[0].slice(l) + (coeff_array.length === 2 ? coeff_array[1] : '');
      } else {
        num = zero + '.' + new Array(l + 1).join(zero) + coeff_array.join('');
      }
    } else {
      var dec = coeff_array[1];
      if (dec) l = l - dec.length;
      if (l < 0) {
        num = coeff_array[0] + dec.slice(0, l) + '.' + dec.slice(l);
      } else {
        num = coeff_array.join('') + new Array(l + 1).join(zero);
      }
    }
  }

  return nsign < 0 ? '-' + num : num;
}
// let baseurl = 'http://62.141.38.231:1317';

export function LeaderboardTableWithMoniker() {
  const [data, setData] = useState([]);
  const [totalBalance, setTotalBalance] = useState([]);
  const [tableRows, setTableRows] = useState([]);
  const [delegatorAddress, setDelegatorAddress] = useState('uptick1ncn0k65x3esuzxztzymd0s0kwhun7wxnrcc9mw');
  const [validatorAddress, setValidatorAddress] = useState('');

  // let baseurl = 'https://uptick-leaderboard.duckdns.org';
  // let baseurl = 'https://peer1.testnet.uptick.network:1318';
  // http://62.141.38.231:1317
  const handleDelegatorAddressChange = (event) => {
    setTableRows([]);
    setDelegatorAddress(event.target.value);
  };

  const handleValidatorAddressChange = (event) => {
    setValidatorAddress(event.target.value);
  };

  useEffect(() => {
    fetch(`https://uptick.api.explorers.guru/api/v1/accounts/${delegatorAddress}/delegations`)
      .then((response) => response.json())
      .then((delegationsData) => {
        let newArr = [];

        delegationsData.map((item) => {
          newArr.push({
            moniker: item.validator.moniker,
            operatorAddress: item.validator.operatorAddress,
            avatar: item.validator.avatar,
            status: item.status,
            tokensAmount: Decimal.fromAtomics(scientificToDecimal(item.tokens.amount).toString(), 18)
              .toFloatApproximation()
              .toFixed(0),
            // totalBalance: totalDelegationsArr.find(
            //   ({ validator_address }) => validator_address == item.validator.operatorAddress
            // ),
          });
        });

        newArr
          .sort((a, b) => {
            return b.tokensAmount - a.tokensAmount;
          })
          .map((item, idx) => {
            const rank = idx + 1;
            setTableRows((current) => [
              ...current,
              createData(rank, item.avatar, item.moniker, item.operatorAddress, item.tokensAmount),
            ]);
          });

        // console.log(newArr);
      });
  }, [delegatorAddress]);

  useEffect(() => {
    let totalDelegationsArr = [];
    fetch(
      'http://62.141.38.231:1317/cosmos/staking/v1beta1/delegations/uptick1ncn0k65x3esuzxztzymd0s0kwhun7wxnrcc9mw?pagination.limit=250'
    )
      .then((response) => response.json())
      .then((delegationsData) => {
        setTotalBalance(delegationsData.delegation_responses);
        // console.log('totalBalance', totalBalance);
      });

    // fetch('http://62.141.38.231:1317/cosmos/staking/v1beta1/delegations/uptick1ncn0k65x3esuzxztzymd0s0kwhun7wxnrcc9mw')
    //   .then((response) => response.json())
    //   .then((delegationsData) => {
    //     delegationsData.delegation_responses.map((item) => {
    //       totalDelegationsArr.push({
    //         totalBalance: item.balance.amount,
    //         validator_address: item.delegation.validator_address,
    //       });
    //     });
    //   });
    // console.log(totalDelegationsArr);
    // setTotalBalance(totalDelegationsArr);
    // console.log('totalBalance', totalBalance);
  }, [delegatorAddress]);

  const MEDALS = ['🥇', '🥈', '🥉'];

  return (
    <Container sx={{ maxWidth: '1300px !important' }}>
      <Typography
        variant="h4"
        align="center"
        sx={{
          m: '18px 0 48px 0',
          '&:hover': {
            filter: 'drop-shadow(0 0 24px #646cffd9)',
          },
        }}
      >
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
          disabled
          value={delegatorAddress}
          onChange={handleDelegatorAddressChange}
          label="Delegator address"
          fullWidth
          variant="standard"
          spellCheck={false}
        />
      </Box>
      {tableRows && totalBalance && (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>Moniker</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="center">Official delegated</TableCell>
                <TableCell align="center">Total delegated</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows
                .filter(
                  (item) => item.moniker.includes(validatorAddress) || item.operatorAddress.includes(validatorAddress)
                )
                .map((row) => {
                  const totalB = totalBalance.find(
                    ({ delegation }) => delegation.validator_address == row.operatorAddress
                  );

                  const medal =
                    row.rank == 1 ? MEDALS[0] : row.rank == 2 ? MEDALS[1] : row.rank == 3 ? MEDALS[2] : null;
                  return (
                    <TableRow key={row.moniker} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: medal ? '22px' : '' }}>{medal || `#${row.rank}`}</div>
                        </Box>
                      </TableCell>
                      <TableCell component="th" scope="row">
                        <Link href={`https://uptick.explorers.guru/validator/${row.operatorAddress}`} underline="hover">
                          <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Avatar sx={{ width: 28, height: 28 }} src={row.avatar} /> {row.moniker}
                          </Box>
                        </Link>
                      </TableCell>
                      <TableCell component="th" scope="row" align="left">
                        {truncate(row.operatorAddress, 20, 7, 30)}
                      </TableCell>
                      <TableCell align="center">{row.tokensAmount} UPTICK</TableCell>
                      <TableCell align="center">
                        {(totalB &&
                          Decimal.fromAtomics(totalB?.balance?.amount, 18).toFloatApproximation().toFixed(18)) ||
                          0}{' '}
                        UPTICK
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
