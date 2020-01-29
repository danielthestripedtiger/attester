import React from 'react';
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
import store from './redux/store'
import { setupEthPoll } from './Helper';

var myWeb3 = "";
var account = "";
var thisContract = "";
const Web3 = require('web3');

class App extends React.Component {

  componentDidMount() {
    console.log("In CDM");

    // const script = document.createElement("script");
    // script.src = "https://cdnjs.cloudflare.com/ajax/libs/dropzone/4.3.0/dropzone.js";
    // script.async = true;

    // document.body.appendChild(script);

    // axios.get("https://api.coinmarketcap.com/v1/ticker/ethereum/")
    //   .then(res => {
    //     console.log(res.data[0].price_usd);
    //     this.setState({ etherPrice: res.data[0].price_usd });
    //   });

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

        // var componentVar = this;
        var accountInterval = setInterval(() => {
          setupEthPoll(this, false, window.ethereum.networkVersion);
        }, 100);
        // var accountInterval = setInterval(() => {
        //   // console.log("In internal");
        //   var currentAccount = "";
        //   myWeb3.eth.getAccounts().then(function (result) {
        //     currentAccount = result[0];

        //     // console.log("Current Account: " + currentAccount);
        //     if (currentAccount !== account) {
        //       account = currentAccount;
        //       componentVar.setState({ selectedAccount: account });
        //       console.log("Account: " + account);
        //     }
        //   });
        // }, 100)
      } catch (error) {
        // User denied account access...
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
      metamaskWarning: ""
    }
  }


  render() {
    return (
      <Provider store={store}>
        <div>
          <BrowserRouter basename={process.env.PUBLIC_URL}><div>

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
              <Route exact path = "/">
                <NewUpload />
              </Route>
              <Route path = "/pastuploads">
                <PastUploads />
              </Route>
            </Switch>
          </div>
          </BrowserRouter>
        </div>
      </Provider>
    )
  }
}

export default App
