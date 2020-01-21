import React from 'react';
import logo from './logo.svg';
import './App.css';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ButtonBase from '@material-ui/core/ButtonBase';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const Web3 = require('web3');
const fs = require('fs');
var CryptoJS = require("crypto-js");

const useStyles = makeStyles({
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
var myWeb3 = "";
var thisContract = "";
const abi = [{"constant":true,"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"docBins","outputs":[{"internalType":"string","name":"slot","type":"string"},{"internalType":"string","name":"docLabel","type":"string"},{"internalType":"bytes32","name":"docHash","type":"bytes32"},{"internalType":"string","name":"docBin","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"string","name":"slot","type":"string"}],"name":"getDoc","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"bytes32","name":"","type":"bytes32"},{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"storageContainer","type":"string"},{"internalType":"string","name":"slot","type":"string"},{"internalType":"string","name":"docLabel","type":"string"}],"name":"storeBin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}]





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
       
  


class App extends React.Component {

  componentDidMount(){
    console.log("In CDM");

    if (window.ethereum) {
      myWeb3 = new Web3(Web3.givenProvider);
    }
    
    // window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        myWeb3 = new Web3(Web3.givenProvider);
        this.setState({ web3: myWeb3 });
        try {
          // Request account access if needed
           window.ethereum.enable();
    
        
    
    
      var accountInterval = setInterval(function() {
    // console.log("In internal");
        var currentAccount = "";
        myWeb3.eth.getAccounts().then(function (result) {
          currentAccount = result[0];
        
          // console.log("Current Account: " + currentAccount);
          if (currentAccount !== account) {
            account = currentAccount;
            // this.setState({ selectedAccount: account });
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
thisContract = new myWeb3.eth.Contract(abi,"0xff36e0c5d31185bEBa93C31B1d6C9c9e9E17A134");
console.log("This contract: " + thisContract);
this.setState({ contract: thisContract });
    
  }

  constructor(props) {
    super(props);
      this.state = {
        selectedFile: null,
        contract: thisContract,
        web3: myWeb3,
        // pk_input: null,
        selectedAccount: account
      }
   
  }

  

  onChangeHandler=event=>{

    console.log(event.target.files[0])
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    })
}

onClickHandler=event=>{

  console.log(this.state.selectedFile.name);
  console.log(this.state.contract.options.address);


  // console.log(Buffer.from(this.state.selectedFile));
  const fileAsBlob = new Blob([this.state.selectedFile]);
  
  console.log(fileAsBlob);


  fileAsBlob.arrayBuffer().then(buffer => {
    var fileBuffer = Buffer.from(buffer);
    var fileLength = fileBuffer.length;
    console.log("File Length: " + fileLength);
    var fileChunks = Math.ceil(fileLength / 1000);
    console.log("File Length div 4000 + ceiling: " + Math.ceil(fileLength / 1000));
    
    var batch = new this.state.web3.BatchRequest();

    var sliceStart = 0;
    var sliceEnd = 1000;

    var nonceVal =  this.state.web3.eth.getTransactionCount("0x9e5E9d4c66970e5669C88cBe969eA10b9433c786") 
      .then(nonceVal => {
   
    console.log("nonce: " + nonceVal);


    for(var x = 0; x < fileChunks; x++){

      var base64str = fileBuffer.slice(sliceStart,sliceEnd).toString('base64');

      console.log(base64str);
  
      this.state.contract.methods.storeBin(base64str,"1","File1")
      .send({nonce: nonceVal, from: "0x9e5E9d4c66970e5669C88cBe969eA10b9433c786", gasLimit:"5575377"}).then(console.log);

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

      sliceStart += 4000;
      sliceEnd +=4000;
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




  render() {
    // const { classes } = this.props;
    // const classes = useStyles();
    // const classes = useStyles();
    return (

      
      
       <div >
    
   
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <AppBar position="static">
  <Toolbar>
    <IconButton edge="start" 
    // className={classes.menuButton} 
    color="inherit" aria-label="menu">
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" 
    // className={classes.title}
    >
      News
    </Typography>
    <Button color="inherit">Login</Button>
  </Toolbar>
</AppBar>
     <br/>
      <Typography variant="h4" component="h4" gutterBottom>
      Ethereum Blockchain Document Attestation

        </Typography>
        Store your document and/or proof of document on the Ethereum Blockchain
<br/><br/>
        {/* <form noValidate autoComplete="off">
Enter Private Key: 
  <TextField id="outlined-basic" label="Ethereum Private Key" variant="outlined" onChange={this.onPKChangeHandler} />
  <Button variant="contained" onClick={this.onPKClickHandler}>Submit</Button>
</form> */}

<br/>Selected Public Key:  {this.state.selectedAccount}


<br/>
        <input type="file" name="file" onChange={this.onChangeHandler}/>
<br/><br/>
        <label htmlFor="outlined-button-file">
        <Button variant="outlined" component="span" onClick={this.onClickHandler}>
          Upload
        </Button>
      </label>


    </div>
    );
  }
}

export default App;
