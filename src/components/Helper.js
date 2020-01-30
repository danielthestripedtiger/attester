import React from 'react';
import '../App.css';
import Button from '@material-ui/core/Button';
import * as Constants from './Constants';
import Alert from '@material-ui/lab/Alert';

const Web3 = require('web3');

function createData(filename, timestamp, filehash, download, deleteBtn) {
    return { filename, timestamp, filehash, download, deleteBtn };
}

export function getMetamaskWarning(appState) {
    var mmMissingMsg = <Alert severity="error"><center><div>This website Uses MetaMask and you dont seem to have it installed. Please install MetaMask and fill your account with sufficient Ether: <a href="https://metamask.io/">https://metamask.io</a>.<br/><br/>The Opera desktop browser (not mobile) is also supported.<a href="https://www.opera.com/">https://www.opera.com/</a></div></center></Alert>;

    appState.setState(
        {
            metamaskWarning: mmMissingMsg
        }
    );
}

export function setupEthPoll(thisComponent, pastUploadsPage, netId) {

    var myWeb3 = new Web3(Web3.givenProvider);

    // console.log("inside poll data");
    var currentAccount = "";
    var blcExplUrl = "";
    var contrAddr = "";

    switch (netId) {
        case "1":
            console.log('This is mainnet');
            blcExplUrl = Constants.MAIN_BLC_EXP_TX_URL;
            contrAddr = Constants.MAIN_DOCSTORE_CONTR_ADDR;
            thisComponent.setState(
                {
                    blcExplUrl: Constants.MAIN_BLC_EXP_TX_URL,
                    contrAddr: Constants.MAIN_DOCSTORE_CONTR_ADDR
                }
            )

            break
        case "4":
            // console.log('This is the rinkeby test network.');
            blcExplUrl = Constants.RINKEBY_BLC_EXP_TX_URL;
            contrAddr = Constants.RINKEBY_DOCSTORE_CONTR_ADDR;
            // console.log(contrAddr);
            thisComponent.setState(
                {
                    blcExplUrl: Constants.RINKEBY_BLC_EXP_TX_URL,
                    contrAddr: Constants.RINKEBY_DOCSTORE_CONTR_ADDR
                }
            )

            break
        default:
        //  console.log('This is an unknown network.')
    }

    myWeb3.eth.getAccounts().then(function (result) {
        currentAccount = result[0];

        // console.log('Creating contract instance');
        var thisContract = new myWeb3.eth.Contract(Constants.ABI, contrAddr);
        // console.log("This contract: " + thisContract);
        thisComponent.setState({ contract: thisContract });

        // console.log("Account before contract call: " + account)

        if (currentAccount !== thisComponent.state.selectedAccount) {
            thisComponent.setState({ selectedAccount: currentAccount });
            console.log("Account: " + currentAccount);
        }

        if (pastUploadsPage === true) {

            thisComponent.setState({ noDocsMsg: 'No documents are saved on Ethereum. If you just submitted a save request, you may have to wait up to 15 minutes for it to be confirmed on the chain.' });
                            
            var fileName = "";
            var fileHashFull = "";
            var lastUpdated = 0;
            var docNextSlot = 0;
            var userSlot = 0;
            thisContract.methods.userNextSlot(currentAccount).call({ from: currentAccount }).then(function (slotNum) {

                console.log("get user slot count: " + slotNum);

                var rows = [];
                thisComponent.setState({ tableRows: rows });

                var nonceVal = thisComponent.state.web3.eth.getTransactionCount(currentAccount)
                    .then(nonceVal => {

                        thisContract.methods.deleteBin(userSlot)
                            .estimateGas(
                                {
                                    from: currentAccount,
                                    gasPrice: Constants.NEW_UPLOAD_GAS_PRICE,
                                    gasLimit: Constants.NEW_UPLOAD_GAS_LIMIT
                                }, function (error, estimatedGas) {
                                }
                            ).then((gasCost) => {

                                for (var x = 0; x < slotNum; x++) {
                                    thisContract.methods.getDocMetaData(x.toString()).call({ from: currentAccount }).then(function (resp) {

                                        fileHashFull = resp[1];

                                        if (fileHashFull !== "") {
                                            fileName = resp[0];
                                            lastUpdated = resp[2];
                                            docNextSlot = resp[3];
                                            userSlot = resp[4];
                                            // console.log("fileName #" + userSlot + " : " + fileName);

                                            var lastUpdDatetime = new Date(0); // The 0 there is the key, which sets the date to the epoch
                                            lastUpdDatetime.setUTCSeconds(lastUpdated);

                                            var fileHash = [fileHashFull.slice(0, 60), " ", fileHashFull.slice(60)].join('');

                                            var gasCostEth = thisComponent.state.web3.utils.fromWei(String(2000000000 * gasCost, 'ether'));
                                            var gasCostUSD = (thisComponent.state.etherPrice * thisComponent.state.web3.utils.fromWei(String(2000000000 * gasCost, 'ether'))).toFixed(2);

                                            rows.push(
                                                createData(fileName + "<br/> (in slot #" + userSlot + ")", lastUpdDatetime.toString(), fileHash,
                                                    <Button onClick={thisComponent.onClickHandler(userSlot, "DOWNLOAD")} variant="contained" color="primary">Download</Button>,
                                                    <div><Button onClick={thisComponent.onClickHandler(userSlot, "DELETE")} variant="contained" color="primary">Delete</Button><small>ETH:{gasCostEth} USD:${gasCostUSD}</small></div>));

                                            thisComponent.setState({ tableRows: rows, noDocsMsg: '', loadingFilesProgress: false });
                                        }
                                    }
                                    )
                                }

                                thisComponent.setState({
                                    loadingFilesProgress: false,
                                  });
                            })
                    })
            })
        }
    });
};