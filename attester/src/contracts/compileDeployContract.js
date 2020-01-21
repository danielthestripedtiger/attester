const path = require('path');
const fs = require('fs');
const solc = require('../../node_modules/solc');
const Web3 = require('web3');
const { abi, evm } = require('./compile');
const EthereumTx = require('ethereumjs-tx').Transaction
const privateKey = Buffer.from(
    'BECA954988086B0DBDB3DDDC39CFEF5EF38269795AB74286323CF64A572F171C',
    'hex',
  )
const OPTIONS = {
  defaultBlock: "latest",
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5
};

// const web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/7312507568eb4da4871d2dce315f20bd'));
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545'));

let accounts;
let myContract;

const myfunction = async function() {


    let myContract = new web3.eth.Contract(abi);

    let txn = myContract.deploy({data: '0x'+evm.bytecode.object}); 
    
    let txn_object = {
      gas: 5000000,
      gasPrice: '55', 
    //   from: "0x9e5E9d4c66970e5669C88cBe969eA10b9433c786", 
    from: "0x3382fB9b0B6E0Db87C4921795e658405e2359b36", 
      data: txn.encodeABI()
    };



    
    web3.eth.getTransactionCount("0x3382fB9b0B6E0Db87C4921795e658405e2359b36", "pending")  
    //  web3.eth.getTransactionCount("0x9e5E9d4c66970e5669C88cBe969eA10b9433c786", "pending")
      .then(nonce => {
        txn_object.nonce = nonce;
    console.log(nonce);

    var tx = {
        nonce: nonce,
        gasPrice: web3.utils.toHex(web3.utils.toWei('20', 'gwei')),
        gasLimit: 5000000,
        // from: "0x9e5E9d4c66970e5669C88cBe969eA10b9433c786",
        from: "0x3382fB9b0B6E0Db87C4921795e658405e2359b36",
        value: 0,
        data: '0x'+evm.bytecode.object,
      };
      web3.eth.accounts.signTransaction(tx, "651b554fc2a3de22b1008ec41f41c9e5b63b8cff084b5bf01b03bde710e63243").then(signed => {
    //   web3.eth.accounts.signTransaction(tx, "BECA954988086B0DBDB3DDDC39CFEF5EF38269795AB74286323CF64A572F171C").then(signed => {
        web3.eth.sendSignedTransaction(signed.rawTransaction).on('receipt', console.log)
    });
        
      })


    console.log("Contract compile and deploy finished. Contract address + " + myContract.options.address)

}

myfunction();
