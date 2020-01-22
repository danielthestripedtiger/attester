import React from 'react';
import logo from './logo.svg';
import './App.css';
import Box from '@material-ui/core/Box';
import Alert from '@material-ui/lab/Alert';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { withStyles } from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import axios from 'axios';
import Dropzone from 'react-dropzone'
var http = require('http');

const Web3 = require('web3');
const fs = require('fs');
var CryptoJS = require("crypto-js");

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


// var encrypted = CryptoJS.AES.encrypt("BECA954988086B0DBDB3DDDC39CFEF5EF38269795AB74286323CF64A572F171C", "SecretPassphrase");
//  window.localStorage.setItem("pkey",encrypted);

var provider = "";
var myWeb3 = "";
var account = "";
var thisContract = "";
var totalGasCost = "";
var filePartsCount = "";
const abi = [{ "constant": true, "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "docBins", "outputs": [{ "internalType": "string", "name": "slot", "type": "string" }, { "internalType": "string", "name": "docLabel", "type": "string" }, { "internalType": "bytes32", "name": "docHash", "type": "bytes32" }, { "internalType": "string", "name": "docBin", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "string", "name": "slot", "type": "string" }], "name": "getDoc", "outputs": [{ "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "string", "name": "storageContainer", "type": "string" }, { "internalType": "string", "name": "slot", "type": "string" }, { "internalType": "string", "name": "docLabel", "type": "string" }], "name": "storeBin", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }]





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
if (window.ethereum) {
  myWeb3 = new Web3(Web3.givenProvider);
}


class App extends React.Component {

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

    // http.get({
    //   host: 'min-api.cryptocompare.com',
    //   path: '/data/price?fsym=ETH&tsyms=BTC,USD,EUR'
    //   },
    //   function(response) {
    //           // Continuously update stream with data
    //           var body = '';
    //           response.on('data', function(d) { body += d; });
    //           response.on('end', function() {

    //                   // Data reception is done, do whatever with it!
    //                   var parsed = JSON.parse(body);
    //                   console.log(parsed.USD);
    //           });
    //   });

    if (window.ethereum) {
      myWeb3 = new Web3(Web3.givenProvider);




    // module.exports = {
    //   subscribeLogEvent,
    //   unsubscribeEvent
    // }



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

    // window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
      myWeb3 = new Web3(Web3.givenProvider);
      this.setState({ web3: myWeb3 });
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
            }
          });


        }, 100);
      } catch (error) {
        // User denied account access...
      }
      this.setState({ selectedAccount: account });
    }


    // // Legacy dapp browsers...
    // else if (window.web3) {
    //   window.web3 = new Web3(window.web3.currentProvider);
    //   // Acccounts always exposed

    // }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    // });

    console.log('Creating contract instance');
    thisContract = new myWeb3.eth.Contract(abi, "0xff36e0c5d31185bEBa93C31B1d6C9c9e9E17A134");
    console.log("This contract: " + thisContract);
    this.setState({ contract: thisContract, processingFile: "false"});

    // var abi2 = [{"inputs":[{"internalType":"address","name":"src_","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":true,"inputs":[{"indexed":true,"internalType":"bytes4","name":"sig","type":"bytes4"},{"indexed":true,"internalType":"address","name":"usr","type":"address"},{"indexed":true,"internalType":"bytes32","name":"arg1","type":"bytes32"},{"indexed":true,"internalType":"bytes32","name":"arg2","type":"bytes32"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"LogNote","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"val","type":"bytes32"}],"name":"LogValue","type":"event"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"bud","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src_","type":"address"}],"name":"change","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"deny","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address[]","name":"a","type":"address[]"}],"name":"diss","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"a","type":"address"}],"name":"diss","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hop","outputs":[{"internalType":"uint16","name":"","type":"uint16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address[]","name":"a","type":"address[]"}],"name":"kiss","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"a","type":"address"}],"name":"kiss","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"pass","outputs":[{"internalType":"bool","name":"ok","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"peek","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"peep","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"poke","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"read","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"rely","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"src","outputs":[{"internalType":"address","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"start","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint16","name":"ts","type":"uint16"}],"name":"step","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"stop","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"stopped","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"void","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"wards","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"zzz","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"}]
    // var thisContract2 = new myWeb3.eth.Contract(abi2,"0x81FE72B5A8d1A857d176C3E7d5Bd2679A9B85763");

    // const subscribedEvents = {}

    // const subscribeLogEvent = (contract, eventName) => {
    //   const eventJsonInterface = myWeb3.utils._.find(
    //     contract._jsonInterface,
    //     o => o.name === eventName && o.type === 'event',
    //   )

    //   const subscription = myWeb3.eth.subscribe('logs', {
    //     address: contract.options.address,
    //     topics: [eventJsonInterface.signature]
    //   }, (error, result) => {
    //       if (!error) {
    //         const eventObj = myWeb3.eth.abi.decodeLog(
    //             eventJsonInterface.inputs,
    //             result.data,
    //             result.topics.slice(1)
    //           )
    //         console.log(`New ${eventName}!`, eventObj)
    //       }


    //   })

    //   subscribedEvents[eventName] = subscription

    //   console.log(`subscribed to event '${eventName}' of contract '${contract.options.address}' `)
    // }

    // subscribeLogEvent(thisContract2, "LogValue");

    // const unsubscribeEvent = (eventName) => {
    //     subscribedEvents[eventName].unsubscribe(function(error, success){
    //         if(success)
    //             console.log('Successfully unsubscribed!');
    //     });
    // }
  } else{
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
    // this.setState = this.setState.bind(this);
  }



  onDrop = (acceptedFiles) => {

    console.log(acceptedFiles[0])
    this.setState({
      selectedFileName: acceptedFiles[0].name,
      selectedFile: acceptedFiles[0],
      processingFile: "true"
    })

    // console.log(Buffer.from(this.state.selectedFile));
    const fileAsBlob = new Blob([acceptedFiles[0]]);

    console.log(fileAsBlob);

    totalGasCost = 0;

    fileAsBlob.arrayBuffer().then(buffer => {
      var fileBuffer = Buffer.from(buffer);
      var fileLength = fileBuffer.length;
      console.log("File Length1: " + fileLength);
      var fileChunks = Math.ceil(fileLength / 1024);
      console.log("File Length div 4000 + ceiling: " + Math.ceil(fileLength / 1024));

      var batch = new this.state.web3.BatchRequest();

      var sliceStart = 0;
      var sliceEnd = 1024;

      var nonceVal = this.state.web3.eth.getTransactionCount("0x9e5E9d4c66970e5669C88cBe969eA10b9433c786")
        .then(nonceVal => {

          console.log("nonce1: " + nonceVal);


          this.setState({ noOfFileParts: fileChunks });
          var componentVar = this;
          for (var x = 0; x < fileChunks; x++) {

            var base64str = fileBuffer.slice(sliceStart, sliceEnd).toString('base64');


            // console.log(base64str);
            this.state.contract.methods.storeBin(base64str, "1", "File1").estimateGas(
              {
                from: account,
                gasPrice: "2000000000",
                gasLimit: "2000000"
              }, function (error, estimatedGas) {
              }
            ).then(
              function (gasCost) {
                console.log(gasCost);
                totalGasCost += gasCost;
                componentVar.setState({ estimatedGas: totalGasCost });
              }
            )

            // this.state.contract.methods.storeBin(base64str,"1","File1")
            // .send({nonce: nonceVal, from: "0x9e5E9d4c66970e5669C88cBe969eA10b9433c786", gasLimit:"5575377"}).then(console.log);

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

            sliceStart += 1024;
            sliceEnd += 1024;
            nonceVal++;
          }
          componentVar.setState({
            processingFile: "false"
          })
        }
        );


    }
    )



  }

  onClickHandler = event => {

    console.log(this.state.selectedFile.name);
    console.log(this.state.contract.options.address);


    // console.log(Buffer.from(this.state.selectedFile));
    const fileAsBlob = new Blob([this.state.selectedFile]);

    console.log(fileAsBlob);


    fileAsBlob.arrayBuffer().then(buffer => {
      var fileBuffer = Buffer.from(buffer);
      var fileLength = fileBuffer.length;
      console.log("File Length: " + fileLength);
      var fileChunks = Math.ceil(fileLength / 1024);
      console.log("File Length div 4000 + ceiling: " + Math.ceil(fileLength / 1024));

      var batch = new this.state.web3.BatchRequest();

      var sliceStart = 0;
      var sliceEnd = 1024;

      var nonceVal = this.state.web3.eth.getTransactionCount("0x9e5E9d4c66970e5669C88cBe969eA10b9433c786")
        .then(nonceVal => {

          console.log("nonce2: " + nonceVal);




          for (var x = 0; x < fileChunks; x++) {

            var base64str = fileBuffer.slice(sliceStart, sliceEnd).toString('base64');

            // console.log(base64str);
            // this.state.contract.methods.storeBin(base64str,"1","File1").estimateGas(
            //   {
            //     from: account,
            //     gasPrice: "20000000000"
            // }, function(error, estimatedGas) {
            // }
            // ).then(console.log);
            this.state.contract.methods.storeBin(base64str, "1", "File1")
              .send({ nonce: nonceVal, from: account, gasPrice: "2000000000", gasLimit: "2000000" }).then(console.log);

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

            sliceStart += 1024;
            sliceEnd += 1024;
            nonceVal++;
          }
          batch.execute();
        }
        );


    }
    )





  }

  // onPKClickHandler=event=>{

  //   var encrypted = CryptoJS.AES.encrypt(this.state.pk_input, "SecretPassphrase");
  //   window.localStorage.setItem("pkey",encrypted);
  //   this.setState({
  //     selectedAccount: myWeb3.eth.accounts.privateKeyToAccount('0x' + CryptoJS.AES.decrypt(window.localStorage.getItem("pkey"), "SecretPassphrase").toString(CryptoJS.enc.Utf8))

  //   })
  // }

  // onPKChangeHandler=event=>{

  //   this.setState({
  //     pk_input: event.target.value
  //   })


  // }

  // onDrop = (acceptedFiles) => {
  //   console.log(acceptedFiles);
  // }


  render() {
    // const { classes } = this.props;
    const { classes } = this.props;
    // const classes = useStyles();
    return (



      <div >


        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/dropzone/4.3.0/dropzone.css" />
        <AppBar position="static">
          {/* <Toolbar>
    {/* <IconButton edge="start" 
    // className={classes.menuButton} 
    color="inherit" aria-label="menu">
      <MenuIcon />
    </IconButton>  </Toolbar*/}
          <Grid container spacing={1}>
         
            <Grid item xs={8}>      <Typography variant="h4" component="h4" gutterBottom>
              Ethereum Blockchain Document Attestation
        
        </Typography></Grid>
            <Grid item xs={4}>
              <Paper ><b>Account:  {this.state.selectedAccount}</b></Paper>

            </Grid>

            <Grid item xs={12} align='center' >
              <ButtonGroup variant="contained"  aria-label="contained primary button group">
  <Button>Home</Button>
  <Button>Uploads</Button>

</ButtonGroup><br/><br/></Grid>
            
           
          </Grid>

        </AppBar>
        <br />
        <Grid container spacing={3}>
        <Grid item xs={3}></Grid>
        <Grid item xs={6} align='center' >
        {this.state.metamaskWarning}
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={2}></Grid>
    
          <Grid item xs={8}>
          <center> <b>Description: </b>Use this tool to store your an arbitrary document on the Ethereum Blockchain
          <br/><br/>If the file is too big for a block on the chain, it will be split into multiple parts (which can be combined back later)

          </center>
</Grid>
<Grid item xs={2}></Grid>
<Grid item xs={2}></Grid>
          <Grid item xs={8}>
          <Box border={1}>
            
<center>
<Dropzone
        onDrop={this.onDrop}
        minSize={0}
        maxSize={50000000000}
      >
        {({getRootProps, getInputProps, isDragActive, isDragReject, rejectedFiles}) => {
          const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > 50000000000;
          return (
            <div {...getRootProps()}>
              <br/><br/><br/>
              <input {...getInputProps()} />
              {!isDragActive && 'Click here or drop a file to upload!'}
              {isDragActive && !isDragReject && "Drop it like it's hot!"}
              {isDragReject && "File type not accepted, sorry!"}
              {isFileTooLarge && (
                <div className="text-danger mt-2">
                  File is too large.
                </div>
              )}
              <br/><br/><br/><br/>
            </div>
          )}
        }
      </Dropzone>
</center>       

</Box>
    
            {/* <input className={classes.root} type="file" name="file" onChange={this.onChangeHandler} /> */}

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
          Total Gas Cost in Ether: { this.state.web3 == null ? "0" : this.state.web3.utils.fromWei(String(2000000000 * this.state.estimatedGas, 'ether')) }
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} align='center' >
          Total Gas Cost in USD: { this.state.web3 == null ? "$0" : "$" + ((this.state.etherPrice * this.state.web3.utils.fromWei(String(2000000000 * this.state.estimatedGas, 'ether'))).toFixed(2))}
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} align='center' >
            <label htmlFor="outlined-button-file">
              <Button variant="outlined" component="span" onClick={this.onClickHandler} 
              className={classes.button}
              startIcon={<CloudUploadIcon />}>
                Save to Ethereum
        </Button>
            </label>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={8} align='center' >
            Processing File: {this.state.processingFile}
          </Grid>
          <Grid item xs={2}></Grid>

          <Grid item xs={2}></Grid>
          <Grid item xs={8} align='center' >
            <br/>
            <br/>
            <br/>
            <b>Next: </b>
            <a href="#">Manage Previously Uploaded Documents</a>
          </Grid>
          <Grid item xs={2}></Grid>
          <Grid item xs={12} align='center' ><br/><br/><br/><br/>© 2020 Renewal Systems, Inc. All rights reserved.</Grid>
        </Grid>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
