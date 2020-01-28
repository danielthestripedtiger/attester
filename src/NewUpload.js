import React from 'react';
import './App.css';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import Dropzone from 'react-dropzone'
import Footer from './Footer'
import { connect } from 'react-redux'
import Parser from 'html-react-parser';
import CircularProgress from '@material-ui/core/CircularProgress';
import * as Constants from './Constants';
import { setupEthPoll, getMetamaskWarning } from './Helper';

const sha3_512 = require('js-sha3').sha3_512;
const Web3 = require('web3');

const styles = theme => ({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
});

// const OPTIONS = {
//   defaultBlock: "latest",
//   transactionConfirmationBlocks: 1,
//   transactionBlockTimeout: 5
// };
//  const myWeb3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
//  var myWeb3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/7312507568eb4da4871d2dce315f20bd'));

// var encrypted = CryptoJS.AES.encrypt("[PK HERE]", "SecretPassphrase");
//  window.localStorage.setItem("pkey",encrypted);

var myWeb3 = "";
var thisContract = "";
var totalGasCost = "";

//     // function to encode file data to base64 encoded string
// function base64_encode(file) {
//   // read binary data
//   var bitmap = fs.readFileSync(file);
//   // convert binary data to base64 encoded string
//   return new Buffer(bitmap).toString('base64');
// }

// // function to create file from base64 encoded string
// function base64_decode(base64str, file) {
//   // create buffer object from base64 encoded string, it is important to tell the constructor that the string is base64 encoded
//   var bitmap = new Buffer(base64str, 'base64');
//   // write buffer to file
//   fs.writeFileSync(file, bitmap);
//   console.log('******** File created from base64 encoded string ********');
// }

class NewUpload extends React.Component {

  componentDidMount() {
    console.log("In CDM");

    // const script = document.createElement("script");
    // script.src = "https://cdnjs.cloudflare.com/ajax/libs/dropzone/4.3.0/dropzone.js";
    // script.async = true;

    // document.body.appendChild(script);
    // if (window.ethereum) {
    //   myWeb3 = new Web3(Web3.givenProvider);

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
    if (window.ethereum) {
      myWeb3 = new Web3(Web3.givenProvider);
      this.setState({ web3: myWeb3 });

      // Request account access if needed
      window.ethereum.enable();

      axios.get(Constants.ETH_PRICE_API_URL)
        .then(res => {
          console.log(res.data[0].price_usd);
          this.setState({ etherPrice: res.data[0].price_usd });
        });

      var accountInterval = setInterval(() => {
        setupEthPoll(this, false, window.ethereum.networkVersion);
      }, 1000);

    } else {
      getMetamaskWarning(this);
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      selectedFileName: "",
      contract: thisContract,
      estimatedGas: 0,
      processingFile: "false",
      metamaskWarning: "",
      savedBtnDisabled: true,
      returnMessages: []
    }
  }

  onDrop = (acceptedFiles) => {

    console.log(acceptedFiles[0]);
    const fileAsBlob = new Blob([acceptedFiles[0]]);
    console.log(fileAsBlob);
    totalGasCost = 0;

    fileAsBlob.arrayBuffer().then(buffer => {
      var fileBuffer = Buffer.from(buffer);
      var fileLength = fileBuffer.length;
      console.log("File Length1: " + fileLength);
      var fileChunks = Math.ceil(fileLength / 3072);
      console.log("File Length div 4000 + ceiling: " + Math.ceil(fileLength / 3072));

      var batch = new this.state.web3.BatchRequest();

      var sliceStart = 0;
      var sliceEnd = 3072;

      var nonceVal = this.state.web3.eth.getTransactionCount(this.state.selectedAccount)
        .then(nonceVal => {

          console.log("nonce1: " + nonceVal);

          this.setState({ noOfFileParts: fileChunks });
          var thisComponent = this;
          for (var x = 0; x < fileChunks; x++) {

            var base64str = fileBuffer.slice(sliceStart, sliceEnd).toString('base64');

            var addFlag = "0";
            if (x == 0) {
              addFlag = "1";
            }
            // console.log(base64str);
            //string memory dataStr, string memory inpDocLabel, string memory inpDocHash, uint argFlag
            this.state.contract.methods.storeBin(base64str, acceptedFiles[0].name, sha3_512(fileBuffer), addFlag).estimateGas(
              {
                from: this.state.selectedAccount,
                gasPrice: "2000000000",
                gasLimit: "5000000"
              }, function (error, estimatedGas) {
              }
            ).then(
              function (gasCost) {
                console.log(gasCost);
                totalGasCost += gasCost;
                thisComponent.setState({ estimatedGas: totalGasCost });
              }
            )

            sliceStart += 3072;
            sliceEnd += 3072;
            nonceVal++;
          }
          thisComponent.setState({
            processingFile: "false"
          })
        }
        );
    }
    )

    this.setState({
      selectedFileName: acceptedFiles[0].name,
      selectedFile: acceptedFiles[0],
      processingFile: "true",
      savedBtnDisabled: false,
      returnMessages: [],
      loadingProgress: false
    })
  }

  onClickHandler = event => {

    this.setState({
      loadingProgress: true
    })
    console.log(this.state.selectedFile.name);
    console.log(this.state.contract.options.address);

    const fileAsBlob = new Blob([this.state.selectedFile]);

    console.log(fileAsBlob);

    fileAsBlob.arrayBuffer().then(buffer => {
      var fileBuffer = Buffer.from(buffer);
      var fileLength = fileBuffer.length;
      console.log("File Length: " + fileLength);
      var fileChunks = Math.ceil(fileLength / 3072);
      console.log("File Length div 4000 + ceiling: " + Math.ceil(fileLength / 3072));

      var batch = new this.state.web3.BatchRequest();

      var sliceStart = 0;
      var sliceEnd = 3072;

      var nonceVal = this.state.web3.eth.getTransactionCount(this.state.selectedAccount)
        .then(nonceVal => {

          console.log("nonce2: " + nonceVal);
          var thisComponent = this;

          var filepartCount = 0;
          for (var x = 0; x < fileChunks; x++) {

            var base64str = fileBuffer.slice(sliceStart, sliceEnd).toString('base64');

            var addFlag = "0";
            if (x === 0) {
              addFlag = "1";
            }
            // console.log(base64str);
            //string memory dataStr, string memory inpDocLabel, string memory inpDocHash, uint argFlag
            this.state.contract.methods.storeBin(base64str, this.state.selectedFile.name, sha3_512(fileBuffer), addFlag)
              .send({ nonce: nonceVal, from: this.state.selectedAccount, gasPrice: "2000000000", gasLimit: "5000000" }).then(function (res) {
                filepartCount++;
                var retMsgs = thisComponent.state.returnMessages;
                retMsgs.push("<div><br/>File part " + filepartCount + " transaction hash: <a href = '" + thisComponent.state.blcExplUrl + res.transactionHash + "' target='_blank'>" + res.transactionHash + "</a></div>");
                thisComponent.setState({
                  returnMessages: retMsgs
                })

                if (filepartCount === x) {
                  thisComponent.setState({
                    loadingProgress: false
                  })
                }
              });

            //   var contractObject;
            //   batch.add(this.state.contract.methods.storeBin(base64str,"1","File1").send
            //   .request(({from: "0x9e5E9d4c66970e5669C88cBe969eA10b9433c786", gasLimit:"5000000"}), (err, res) => { // values are set to fixed for the example
            //     if (err) {
            //       console.log("Error Occurred: ");
            //         console.log(err);
            //     } else {
            //     console.log(res) // this logs the transaction id
            //     }
            // }));
            // .on('receipt', receipt => {
            //   console.log(receipt);})

            sliceStart += 3072;
            sliceEnd += 3072;
            nonceVal++;
          }
          // batch.execute();
        }
        );
    }
    )
  }

  render() {
    return (

      <div >
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/4.3.0/dropzone.css" />

        <Grid container spacing={3}>
          <Grid item xs={3}></Grid>
          <Grid item xs={6} align='center' >
            {this.state.metamaskWarning}
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8}>
            <center><b>Description: </b>Use this tool to store any document on the Ethereum Blockchain
              <br /><br />If the file is too big for a block on the chain, it will be split into multiple parts (which can be combined back later)
              <br /><br />Estimated cost is below the upload box and is for blockchain gas only (no additional fees)
           </center>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} align='center' >
            <br /><br /><b>Step 1: Select File</b><br /><br />
            <Box border={1}>
              <center>
                <Dropzone
                  onDrop={this.onDrop}
                  minSize={0}
                  maxSize={50000000000}
                >
                  {({ getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles }) => {
                    const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > 50000000000;
                    return (
                      <div {...getRootProps()}>
                        <br /><br /><br />
                        <input {...getInputProps()} />
                        {!isDragActive && 'Click here or drop a file to upload!'}
                        {isDragActive && !isDragReject && "Drop it like it's hot!"}
                        {isDragReject && "File type not accepted, sorry!"}
                        {isFileTooLarge && (
                          <div className="text-danger mt-2">
                            File is too large.
                </div>
                        )}
                        <br /><br /><br /><br />
                      </div>
                    )
                  }
                  }
                </Dropzone>
              </center>
            </Box>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} align='center' >
            File Selected: {this.state.selectedFileName}
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} align='center' >
            Total Estimated Gas Cost: {this.state.estimatedGas}
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} align='center' >
            Number of file parts: {this.state.noOfFileParts}
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} align='center' >
            Total Gas Cost in Ether: {this.state.web3 == null ? "0" : this.state.web3.utils.fromWei(String(2000000000 * this.state.estimatedGas, 'ether'))}
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} align='center' >
            Total Gas Cost in USD: {this.state.web3 == null ? "$0" : "$" + ((this.state.etherPrice * this.state.web3.utils.fromWei(String(2000000000 * this.state.estimatedGas, 'ether'))).toFixed(2))}
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} align='center' >
            <label htmlFor="outlined-button-file">
              <br /><br /><b>Step 2: Save to Ethereum Blockchain</b><br /><br />
              <Button variant="outlined" component="span" disabled={this.state.savedBtnDisabled} onClick={this.onClickHandler}
                // className={classes.button}
                startIcon={<CloudUploadIcon />}>
                Save to Ethereum
        </Button>
            </label>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} align='center' >
            {this.state.loadingProgress ? (
              <div><br />Saving document to blockchain. Please wait (may take up to 15 mins).<br /><br /><br /><CircularProgress /></div>
            ) : (
                ""
              )}
            {this.state.returnMessages.map((msg, index) => (
              <div key={index}>
                {Parser(msg)}
              </div>
            ))}
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} align='center' >
            <br />
            <br />
            <br />
            <b>Next: </b>
            <a href="/pastuploads">Manage Previously Uploaded Documents</a>
          </Grid>
          <Grid item xs={2}></Grid>
        </Grid>
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    web3: state.web3.web3
  }
}

export default connect(
  mapStateToProps,
  null
)(NewUpload)
