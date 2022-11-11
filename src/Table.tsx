import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import { render } from 'react-dom';

function createData(valoperAddr: string, tokensAmount: any) {
  return { valoperAddr, tokensAmount };
}

const rows = [
  createData('valoper1', 98010000),
  createData('valoper2', 68010000),
  createData('valoper3', 48010000),
  createData('valoper4', 78010000),
  createData('valoper5', 18010000),
];
console.log('rows:', rows);

export function LeaderboardTable() {
  const [data, setData] = useState();
  const [tableRows, setTableRows] = useState<any>([]);

  let baseurl = 'https://peer1.testnet.uptick.network:1318';
  let delegatorAddr = 'uptick1ncn0k65x3esuzxztzymd0s0kwhun7wxnrcc9mw';

  useEffect(() => {
    fetch(`${baseurl}/cosmos/staking/v1beta1/delegations/${delegatorAddr}`)
      .then((response) => response.json())
      .then((delegationsData) => {
        setData(delegationsData.delegation_responses);

        delegationsData.delegation_responses.map((item: any) => {
          setTableRows((current: any) => [
            ...current,
            createData(item.delegation.validator_address, item.delegation.shares),
          ]);
        });

        // console.log(delegationsData.delegation_responses);
      });
  }, []);

  return (
    <Container>
      {data && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Valoper address</TableCell>
                <TableCell>Tokens amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableRows
                .sort((a: any, b: any) => {
                  return b.tokensAmount - a.tokensAmount;
                })
                .map((row: any) => (
                  <TableRow
                    key={row.valoperAddr}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.valoperAddr}
                    </TableCell>
                    <TableCell>{row.tokensAmount} UPTICK</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}
