import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Footer from './Footer';

const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles(theme => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.default,
      },
    },
  }))(TableRow);
  
  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  const rows = [
    createData('File.txt', "2020-01-01 08:42:42", "0xfdw45werffd8fdsfsdfs", 
    <Button  variant="contained" color="primary">Download</Button>, 
    <Button  variant="contained" color="primary">Delete</Button>),
  ];
  
  const useStyles = makeStyles({
    table: {
    //   minWidth: 700,
    height: '80%',
    width: '90%',
    margin: 'auto',

    },    tableContainer: {
        //   minWidth: 700,
        height: '100%',
        width: '95%',
          margin: '20px'
        },
// div: {
//   margin: '70px',
//   border: '1px solid #4CAF50'
// }
 } );
  
  export default function Uploads() {
    const classes = useStyles();
  //DocumentName TimeStamp FullDocHash DownloadDocument/Download_NA_HashStoredOnly RemoveFromBlockchain
    return (
        <div>

      <TableContainer className={classes.tableContainer} component={Paper}>
      <p className={classes.table}>Uploads for this account: </p>
        <Table size="small" className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Document Name</StyledTableCell>
              <StyledTableCell align="right">Timestamp</StyledTableCell>
              <StyledTableCell align="right">Document Hash</StyledTableCell>
              <StyledTableCell align="right">Download Document</StyledTableCell>
              <StyledTableCell align="right">Remove From Blockchain</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="right">{row.calories}</StyledTableCell>
                <StyledTableCell align="right">{row.fat}</StyledTableCell>
                <StyledTableCell align="right">{row.carbs}</StyledTableCell>
                <StyledTableCell align="right">{row.protein}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
        
      </TableContainer>
    <Footer />  
        </div>
    );
  }