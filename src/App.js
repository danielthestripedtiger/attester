import React from 'react';
import { connect } from 'react-redux'
import { Provider } from 'react-redux'
import NewUpload from './NewUpload'
import PastUploads from './PastUploads'
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';  
import axios from 'axios';
import { storeWeb3 } from './redux'
import store from './redux/store'

var provider = "";
var myWeb3 = "";
var account = "";
var thisContract = "";
var totalGasCost = "";
var filePartsCount = "";
const abi = [{ "constant": true, "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "docBins", "outputs": [{ "internalType": "string", "name": "slot", "type": "string" }, { "internalType": "string", "name": "docLabel", "type": "string" }, { "internalType": "bytes32", "name": "docHash", "type": "bytes32" }, { "internalType": "string", "name": "docBin", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "string", "name": "slot", "type": "string" }], "name": "getDoc", "outputs": [{ "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "bytes32", "name": "", "type": "bytes32" }, { "internalType": "string", "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "string", "name": "storageContainer", "type": "string" }, { "internalType": "string", "name": "slot", "type": "string" }, { "internalType": "string", "name": "docLabel", "type": "string" }], "name": "storeBin", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }]
var http = require('http');
const Web3 = require('web3');
const fs = require('fs');
var CryptoJS = require("crypto-js");

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
  

  render() {
    return (
      <Provider store={store}>
<div>
        <BrowserRouter><div>

        <AppBar position="static">
                    <Grid container spacing={1}>
                        <Grid item xs={8}>
                            <Typography variant="h4" component="h4" gutterBottom>
                                Ethereum Blockchain Document Attestation
                        </Typography></Grid>
                        <Grid item xs={4}>
                            <Paper >
                                <b>Account:  {this.state.selectedAccount}</b>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} align='center' >
                            <ButtonGroup variant="contained" aria-label="contained primary button group">
                                <Button component={Link} to={'/'}>Home</Button>
                                <Button component={Link} to={'/pastuploads'}>Past Uploads</Button>
                            </ButtonGroup><br /><br /></Grid>
                    </Grid>
                </AppBar>
                <br />
             

      
{/* A <Switch> looks through its children <Route>s and
    renders the first one that matches the current URL. */}
<Switch>
<Route exact path="/">
  <NewUpload/>
  </Route>
  <Route  path="/pastuploads" component={PastUploads} />

</Switch>
</div>
</BrowserRouter>
      </div>
      </Provider>
    )
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     storeWeb3: web3 => dispatch(storeWeb3(web3))
//   }
// }

export default App
