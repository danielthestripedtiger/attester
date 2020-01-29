export const MAIN_BLC_EXP_TX_URL = "https://etherscan.io/tx/"
export const RINKEBY_BLC_EXP_TX_URL = "https://rinkeby.etherscan.io/tx/";
export const RINKEBY_DOCSTORE_CONTR_ADDR = "0x4C258142474a9aA4728DE3f6eF8603c50a3b8764"
export const MAIN_DOCSTORE_CONTR_ADDR = "0x18551B97bd14A1e09FA6cE4AcefdAa0A8F2574B7";
export const ABI = [{ "constant": false, "inputs": [{ "internalType": "uint256", "name": "userSlot", "type": "uint256" }], "name": "deleteBin", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "internalType": "string", "name": "dataStr", "type": "string" }, { "internalType": "string", "name": "inpDocLabel", "type": "string" }, { "internalType": "string", "name": "inpDocHash", "type": "string" }, { "internalType": "uint256", "name": "argFlag", "type": "uint256" }], "name": "storeBin", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "string", "name": "a", "type": "string" }, { "internalType": "string", "name": "b", "type": "string" }], "name": "compareStrings", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "name": "docBins", "outputs": [{ "internalType": "string", "name": "docLabel", "type": "string" }, { "internalType": "string", "name": "docHash", "type": "string" }, { "internalType": "uint256", "name": "lastUpdated", "type": "uint256" }, { "internalType": "uint256", "name": "docNextSlot", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "docKeys", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "uint256", "name": "userSlot", "type": "uint256" }], "name": "getDoc", "outputs": [{ "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "string[]", "name": "", "type": "string[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "uint256", "name": "userSlot", "type": "uint256" }], "name": "getDocMetaData", "outputs": [{ "internalType": "string", "name": "", "type": "string" }, { "internalType": "string", "name": "", "type": "string" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "userNextSlot", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }];
export const ETH_PRICE_API_URL = "https://api.coinmarketcap.com/v1/ticker/ethereum/";
export const NEW_UPLOAD_GAS_PRICE = "2000000000";
export const PAST_UPLOADS_GAS_PRICE = "2000000000";
export const NEW_UPLOAD_GAS_LIMIT = "5000000";
export const PAST_UPLOADS_GAS_LIMIT = "5000000";
export const DELETE_BTN = "DELETE";
export const DOWNLOAD_BTN ="DOWNLOAD";
export const FILE_CHUNK_SZ_BYTES = 3072;
