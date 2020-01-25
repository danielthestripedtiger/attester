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
import PropTypes from 'prop-types';
import axios from 'axios';
import Alert from '@material-ui/lab/Alert';

var provider = "";
var myWeb3 = "";
var account = "";
var thisContract = "";
var totalGasCost = "";
var filePartsCount = "";
const abi = [{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"docBins","outputs":[{"internalType":"string","name":"slot","type":"string"},{"internalType":"string","name":"docLabel","type":"string"},{"internalType":"bytes32","name":"docHash","type":"bytes32"},{"internalType":"string","name":"docBin","type":"string"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"string","name":"slot","type":"string"}],"name":"getDoc","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"storageContainer","type":"string"},{"internalType":"string","name":"slot","type":"string"},{"internalType":"string","name":"docLabel","type":"string"}],"name":"storeBin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]
const contractAddress = "0xdea87d2cc5c346e659f68ca6e102e1876cf88a79";
var http = require('http');
const Web3 = require('web3');
const fs = require('fs');
var CryptoJS = require("crypto-js");

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
  
  const useStyles = {
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
        }
// div: {
//   margin: '70px',
//   border: '1px solid #4CAF50'
// }
 } ;

class PastUploads extends Component {
 
    componentDidMount() {
        console.log("In CDM");
    
    
        // const script = document.createElement("script");
        // script.src = "https://cdnjs.cloudflare.com/ajax/libs/dropzone/4.3.0/dropzone.js";
        // script.async = true;
    
        // document.body.appendChild(script);
    
        axios.get("https://api.coinmarketcap.com/v1/ticker/ethereum/")
          .then(res => {
            console.log(res.data[0].price_usd);
            this.setState({ etherPrice: res.data[0].price_usd });
          });
    
        if (window.ethereum) {
      
          // var subscription = myWeb3.eth.subscribe('logs', {
          //   address: '0x81FE72B5A8d1A857d176C3E7d5Bd2679A9B85763', fromBlock: 2,
          //   topics: ['0x296ba4ca62c6c21c95e828080cb8aec7481b71390585605300a8a76f9e95b527']
          // }, function (error, result) {
          //   if (!error)
          //     console.log("Res: " + myWeb3.utils.toBN(result.data));
          // })
          //   .on("data", function (log) {
          //     console.log(log.data);
          //   })
          //   .on("changed", function (log) {
          //   });
    
          // // unsubscribes the subscription
          // subscription.unsubscribe(function (error, success) {
          //   if (success)
          //     console.log('Successfully unsubscribed!');
          // });
    
          // Modern dapp browsers...
    
            myWeb3 = new Web3(Web3.givenProvider);
            // storeWeb3(myWeb3);
            this.setState({ web3: myWeb3 });
            // store.web3 = myWeb3;
            try {
              // Request account access if needed
              window.ethereum.enable();
    
              var componentVar = this;
              var accountInterval = setInterval(() => {
                // console.log("In internal");
                var currentAccount = "";
                myWeb3.eth.getAccounts().then(function (result) {
                  currentAccount = result[0];
    
                  // console.log("Current Account: " + currentAccount);
                  if (currentAccount !== account) {
                    account = currentAccount;
                    componentVar.setState({ selectedAccount: account });
                    console.log("Account: " + account);

                    console.log('Creating contract instance');
                    thisContract = new myWeb3.eth.Contract(abi, contractAddress);
                    console.log("This contract: " + thisContract);
                    componentVar.setState({ contract: thisContract, processingFile: "false" });
              
                    
                    console.log("Account before contract call: " + account)
                    thisContract.methods.getDoc("0").call({from: account}).then(function(resp) {
                      console.log(resp[0]); 
                      console.log(resp[1]); 
                      console.log(resp[2]); 
                      console.log(resp[3]); 
                      console.log(resp[4]); 
                   })
                  }
                });
    
    
              }, 100);

              
            } catch (error) {
              // User denied account access...
            }
            this.setState({ selectedAccount: account });
          
                   // // Legacy dapp browsers...
          // else if (window.web3) {
          //   window.web3 = new Web3(window.web3.currentProvider);
          //   // Acccounts always exposed
    

        } else {
          var mmMissingMsg = <Alert severity="error"><center><div>This website Uses MetaMask and you dont seem to have it installed. Please install MetaMask and fill your account with sufficient Ether: <a href="https://metamask.io/">https://metamask.io</a></div></center></Alert>;
    
          this.setState(
            {
              metamaskWarning: mmMissingMsg
            }
          );
        }
      }

        constructor(props) {
            super(props);
            this.state = {
              selectedFile: null,
              selectedFileName: "",
              contract: thisContract,
              web3: null,
              // pk_input: null,
              selectedAccount: account,
              estimatedGas: 0,
              processingFile: "false",
              metamaskWarning: ""
            }
          }
  //DocumentName TimeStamp FullDocHash DownloadDocument/Download_NA_HashStoredOnly RemoveFromBlockchain
    render() {
         const {classes} = this.props;
        return (
        <div>
    <p>Contract String: {this.state.contract.name}</p>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <center><h3 className={classes.table}>Uploads for account: {this.state.selectedAccount}</h3></center>
    
        <Table size="small" 
         className={classes.table} 
        aria-label="customized table">
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
  }

  PastUploads.propTypes = {
    classes: PropTypes.object.isRequired,
  };

   export default withStyles(useStyles)(PastUploads);
//   export default PastUploads;