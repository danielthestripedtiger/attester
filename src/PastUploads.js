import React, { Component } from 'react'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Footer from './Footer';
import PropTypes from 'prop-types';
import Parser from 'html-react-parser';
import { setupEthPoll, getMetamaskWarning } from './Helper';

var myWeb3 = "";
const Web3 = require('web3');

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

const useStyles = {
  table: {
    //   minWidth: 700,
    height: '80%',
    width: '90%',
    margin: 'auto',

  }, tableContainer: {
    //   minWidth: 700,
    height: '100%',
    width: '95%',
    margin: '20px'
  }
};


class PastUploads extends Component {

  componentDidMount() {
    console.log("In CDM");

    // const script = document.createElement("script");
    // script.src = "https://cdnjs.cloudflare.com/ajax/libs/dropzone/4.3.0/dropzone.js";
    // script.async = true;
    // document.body.appendChild(script);

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

      myWeb3 = new Web3(Web3.givenProvider);
      this.setState({ web3: myWeb3 });

      // Request account access if needed
      window.ethereum.enable();

      setTimeout(() => {
        setupEthPoll(this, true, window.ethereum.networkVersion);
      }, 1000);

      
      var accountInterval = setInterval(() => {
        setupEthPoll(this, true, window.ethereum.networkVersion);
      }, 20000);

    } else {
      getMetamaskWarning(this);
    }
  }

  onClickHandler = (userSlot, buttonType) => {
    return (event) => {

      console.log("You clicked on row with userSlot " + userSlot + ", and buttonType " + buttonType);

      if (buttonType === "DELETE") {
        console.log("DELETING ENTRY");
        var nonceVal = this.state.web3.eth.getTransactionCount(this.state.selectedAccount)
          .then(nonceVal => {

            console.log("noncePU: " + nonceVal);

            this.state.contract.methods.deleteBin(userSlot)
              .send({ nonce: nonceVal, from: this.state.selectedAccount, gasPrice: "2000000000", gasLimit: "5000000" }).then(console.log);
          })
      }

      if (buttonType === "DOWNLOAD") {
        console.log("DOWNLOADING ENTRY");
        
        var thisComponent = this;
        this.state.contract.methods.getDoc(userSlot).call({ from: this.state.selectedAccount }).then(function (resp) {

          console.log("Download acct: " + thisComponent.state.selectedAccount);
          var fileName = resp[0];
          var docNextSlot = resp[3];

          console.log("Downloaded: " + resp[5][0]);

          var mergedArray = null;
          var completeFile = base64ToArrayBuffer(resp[5][0]);
          for (var x = 1; x < docNextSlot; x++) {
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
      estimatedGas: 0,
      processingFile: "false",
      metamaskWarning: "",
      tableRows: []
    }
  }

  //DocumentName TimeStamp FullDocHash DownloadDocument/Download_NA_HashStoredOnly RemoveFromBlockchain
  render() {
    const { classes } = this.props;
    return (
      <div>
        <TableContainer className={classes.tableContainer} component={Paper}>
          <center><h3 className={classes.table}>Uploads for account: {this.state.selectedAccount}</h3></center>

          <Table size="small"
            className={classes.table}
            aria-label="customized table">
            <TableHead>
              <TableRow key="100">
                <StyledTableCell>Document Name</StyledTableCell>
                <StyledTableCell align="center" key="101">Timestamp</StyledTableCell>
                <StyledTableCell align="center" key="102">Document Hash</StyledTableCell>
                <StyledTableCell align="center" key="103">Download Document From Ethereum</StyledTableCell>
                <StyledTableCell align="center" key="104">Remove From Ethereum</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.tableRows.map(row => (
                <StyledTableRow key="200">
                  <StyledTableCell component="th" scope="row">{Parser(row.filename)}</StyledTableCell>
                  <StyledTableCell align="center" key="201">{row.timestamp}</StyledTableCell>
                  <StyledTableCell align="center" key="202"><code>{row.filehash}</code></StyledTableCell>
                  <StyledTableCell align="center" key="203">{row.download}</StyledTableCell>
                  <StyledTableCell align="center" key="204">{row.deleteBtn}</StyledTableCell>
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
  var blob = new Blob([byte], { type: "application/text" });
  var link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  var fileName = reportName;
  link.download = fileName;
  link.click();
};

export default withStyles(useStyles)(PastUploads);
