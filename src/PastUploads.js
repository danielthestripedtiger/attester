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
const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "userSlot",
				"type": "uint256"
			}
		],
		"name": "deleteBin",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "string",
				"name": "dataStr",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "inpDocLabel",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "inpDocHash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "argFlag",
				"type": "uint256"
			}
		],
		"name": "storeBin",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "string",
				"name": "a",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "b",
				"type": "string"
			}
		],
		"name": "compareStrings",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"name": "docBins",
		"outputs": [
			{
				"internalType": "string",
				"name": "docLabel",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "docHash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "lastUpdated",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "docNextSlot",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "docKeys",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "userSlot",
				"type": "uint256"
			}
		],
		"name": "getDoc",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "uint256",
				"name": "userSlot",
				"type": "uint256"
			}
		],
		"name": "getDocMetaData",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userNextSlot",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]
const contractAddress = "0x4C258142474a9aA4728DE3f6eF8603c50a3b8764";
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
 


  componentWillUnmount() {
    clearInterval(this.interval);
  }
    componentDidMount() {
        console.log("In CDM");
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000);
 


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
                  rows = [];
                  // if (currentAccount !== account) {
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
                    var docNextSlot = 0;
                    var userSlot = 0;
                    thisContract.methods.userNextSlot(account).call({from: account}).then(function(resp1) {

                    console.log("get user slot count: " + resp1);

                    for(var x = 0; x < resp1; x++){
                    thisContract.methods.getDocMetaData(x.toString()).call({from: account}).then(function(resp) {
                      
                      fileHashFull = resp[1]; 

                      if(fileHashFull !== ""){
                        fileName = resp[0];
                        lastUpdated = resp[2]; 
                        docNextSlot = resp[3];
                        userSlot = resp[4];
                        console.log("User Slot: " + userSlot);

                        var lastUpdDatetime = new Date(0); // The 0 there is the key, which sets the date to the epoch
                        lastUpdDatetime.setUTCSeconds(lastUpdated);

                        var fileHash = [fileHashFull.slice(0, 60), " ", fileHashFull.slice(60)].join(''); 

                        rows.push(
                          createData(fileName, lastUpdDatetime.toString(), fileHash, 
                          <Button  onClick={componentVar.onClickHandler(userSlot, "DOWNLOAD")} variant="contained" color="primary">Download</Button>, 
                          <Button  onClick={componentVar.onClickHandler(userSlot, "DELETE")} variant="contained" color="primary">Delete</Button>),
                        );
                      }

                      componentVar.setState({ tableRows: rows});
                   }
                   )

                  }


                  })

                // }
                });
    
    
              }, 10000);

              
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

      onClickHandler = (userSlot, buttonType) => {
        return (event) => {


          console.log("You clicked on row with userSlot " +  userSlot + ", and buttonType " + buttonType);

          if(buttonType === "DELETE"){
            console.log("DELETING ENTRY");
            var nonceVal = this.state.web3.eth.getTransactionCount(this.state.selectedAccount)
            .then(nonceVal => {
    
              console.log("noncePU: " + nonceVal);
    
            this.state.contract.methods.deleteBin(userSlot)
            .send({ nonce: nonceVal, from: account, gasPrice: "2000000000", gasLimit: "2000000" }).then(console.log);
            })
          }

          if(buttonType === "DOWNLOAD"){
            console.log("DOWNLOADING ENTRY");
            thisContract.methods.getDoc(userSlot).call({from: account}).then(function(resp) {

              console.log("Download acct: " + account);
              var fileName = resp[0];
              var lastUpdated = resp[2]; 
              var docNextSlot = resp[3];
              var userSlot = resp[4];
              var dataParts = resp[5];

              console.log("Downloaded: " + resp[5][0]);

              var mergedArray = null;
              var completeFile = base64ToArrayBuffer(resp[5][0]);
              for(var x = 1; x < docNextSlot; x++){
                var currentPart = base64ToArrayBuffer(resp[5][x]);

                mergedArray = new Uint8Array(completeFile.length + currentPart.length);
                mergedArray.set(completeFile);
                mergedArray.set(currentPart, completeFile.length);
                completeFile = mergedArray;
              }

              saveByteArray(fileName, completeFile);

            });
          }
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

            this.loadData = this.loadData.bind(this)
          }

          loadData() {

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
            <TableRow key="99">
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
                <StyledTableCell align="center" id="99">{row.download}</StyledTableCell>
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

  function base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
       var ascii = binaryString.charCodeAt(i);
       bytes[i] = ascii;
    }
    return bytes;
 }

 function saveByteArray(reportName, byte) {
  var blob = new Blob([byte], {type: "application/text"});
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  var fileName = reportName;
  link.download = fileName;
  link.click();
};

   export default withStyles(useStyles)(PastUploads);
//   export default PastUploads;