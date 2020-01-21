const path = require('path');
const fs = require('fs');
const solc = require('../../node_modules/solc');
const Web3 = require('web3');

const OPTIONS = {
  defaultBlock: "latest",
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5
};

const contractPath = path.resolve(__dirname, './DocStore.sol');
const source = fs.readFileSync(contractPath, 'utf8');

let jsonContractSource = JSON.stringify({
    language: 'Solidity',
    sources: {
      'Task': {
          content: source,
       },
    },
    settings: { 
        outputSelection: {
            '*': {
                '*': ['abi',"evm.bytecode"],   
             // here point out the output of the compiled result
            },
        },
    },
});

// console.log(solc.compile(jsonContractSource));
module.exports = JSON.parse(solc.compile(jsonContractSource)).contracts.Task.DocStore;
