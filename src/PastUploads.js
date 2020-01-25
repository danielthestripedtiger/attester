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
const abi = [{"constant":true,"inputs":[{"internalType":"string","name":"a","type":"string"},{"internalType":"string","name":"b","type":"string"}],"name":"compareStrings","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"docBins","outputs":[{"internalType":"string","name":"docLabel","type":"string"},{"internalType":"string","name":"docHash","type":"string"},{"internalType":"uint256","name":"lastUpdated","type":"uint256"},{"internalType":"uint256","name":"docSlot","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"docKeys","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"inpSlot","type":"uint256"}],"name":"getDoc","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string[]","name":"","type":"string[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"inpSlot","type":"uint256"}],"name":"getDocMetaData","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"dataStr","type":"string"},{"internalType":"string","name":"inpDocLabel","type":"string"},{"internalType":"string","name":"inpDocHash","type":"string"},{"internalType":"uint256","name":"argFlag","type":"uint256"}],"name":"storeBin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userSlots","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]
const contractAddress = "0x6309a92fd32003f36ee26705aac7e0e79fd203ce";
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
  
  function createData(filename, timestamp, filehash, download, deleteBtn) {
    return { filename, timestamp, filehash, download, deleteBtn };
  }
 
  var rows = [];
  
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
                    
                    var fileName = "";
                    var fileHashFull = "";
                    var lastUpdated = 0;
                    thisContract.methods.userSlots(account).call({from: account}).then(function(resp1) {

                    console.log("get user slot count: " + resp1);

                    for(var x = 0; x < resp1; x++){
                    thisContract.methods.getDocMetaData(x.toString()).call({from: account}).then(function(resp) {
                      
                      fileName = resp[0]; 
                      fileHashFull = resp[1]; 
                      lastUpdated = resp[2]; 
                      var lastUpdDatetime = new Date(0); // The 0 there is the key, which sets the date to the epoch
                      lastUpdDatetime.setUTCSeconds(lastUpdated);

                      var fileHash = [fileHashFull.slice(0, 60), " ", fileHashFull.slice(60)].join('');

                      rows.push(
                        createData(fileName, lastUpdDatetime.toString(), fileHash, 
                        <Button  variant="contained" color="primary">Download</Button>, 
                        <Button  variant="contained" color="primary">Delete</Button>),
                      );

                      componentVar.setState({ tableRows: rows});
                   }
                   )

                  }


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
              metamaskWarning: "",
              tableRows: rows
            }
          }
  //DocumentName TimeStamp FullDocHash DownloadDocument/Download_NA_HashStoredOnly RemoveFromBlockchain
    render() {
         const {classes} = this.props;
        return (
        <div>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <center><h3 className={classes.table}>Uploads for account: {this.state.selectedAccount}</h3></center>
    
        <Table size="small" 
         className={classes.table} 
        aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Document Name</StyledTableCell>
              <StyledTableCell align="center">Timestamp</StyledTableCell>
              <StyledTableCell align="center">Document Hash</StyledTableCell>
              <StyledTableCell align="center">Download Document</StyledTableCell>
              <StyledTableCell align="center">Remove From Blockchain</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.tableRows.map(row => (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">{row.filename}</StyledTableCell>
                <StyledTableCell align="center">{row.timestamp}</StyledTableCell>
                <StyledTableCell align="center"><code>{row.filehash}</code></StyledTableCell>
                <StyledTableCell align="center">{row.download}</StyledTableCell>
                <StyledTableCell align="center">{row.deleteBtn}</StyledTableCell>
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