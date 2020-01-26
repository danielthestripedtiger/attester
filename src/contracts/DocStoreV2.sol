pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.6.0;
contract DocStore
{

    struct DocData {
        string[] dataParts;
        string docLabel;
        string docHash;
        uint lastUpdated;
        uint docNextSlot;
    }

    mapping(bytes32 => DocData) public docBins;
    mapping(uint => bytes32) public docKeys;
    mapping(address => uint) public userNextSlot;

    function storeBin(string memory dataStr, string memory inpDocLabel, string memory inpDocHash, uint argFlag) public {
        
        // bytes32 data = stringToBytes32(dataStr);
        // key is sender address + document hash (to be used with docBins map, which contains the file infos)
        bytes32 key = keccak256(append(msg.sender,inpDocHash));
        
        // explicit add document flag
        if(argFlag == 1){
            // if the current location of the document key is empty...
            if( compareStrings(docBins[key].docHash, "") ){
                // .. then set the key into the current user slot (slot is numberic and correclated with a key. To be used for web3 lookups)
                docKeys[userNextSlot[msg.sender]] = keccak256(append(msg.sender,inpDocHash));
                // increment slot number for use with a new key in the future
                userNextSlot[msg.sender] = userNextSlot[msg.sender] + 1;
            } else {
                // if add flag was specified and there is already data, return it to empty default values
                delete docBins[key].dataParts;
                docBins[key].docLabel = "";
                docBins[key].docHash = "";
                docBins[key].lastUpdated = 0;
                docBins[key].docNextSlot = 0;
            }
        }
        
        // append data to dataParts string array
        docBins[key].dataParts.push(dataStr);
        
        //update fields based on input args
        docBins[key].docLabel = inpDocLabel;
        docBins[key].docHash = inpDocHash;
        
        // set current timestamp as last update date
        docBins[key].lastUpdated = now;
        
        // doc slot now taken (logically speaking, after array push), so increment the slot
        docBins[key].docNextSlot++;
    }
    
    function deleteBin(uint userSlot) public {
            docBins[docKeys[userSlot]].docLabel = "";
            docBins[docKeys[userSlot]].docHash = "";
            docBins[docKeys[userSlot]].lastUpdated = 0;
            docBins[docKeys[userSlot]].docNextSlot = 0;
            delete docBins[docKeys[userSlot]].dataParts;
            docKeys[userSlot] = "";
    }

    function append( address a, string memory b) internal pure returns (bytes memory) {
        return bytes(abi.encodePacked(a, b));
    }

    function compareStrings (string memory a, string memory b) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }

    function getDoc(uint userSlot) public view returns( string memory, string memory, uint, uint, uint, string[] memory ){
        return ( 
            docBins[docKeys[userSlot]].docLabel,
            docBins[docKeys[userSlot]].docHash,
            docBins[docKeys[userSlot]].lastUpdated,
            docBins[docKeys[userSlot]].docNextSlot,
            userSlot,
            docBins[docKeys[userSlot]].dataParts
            );
    }
    
    function getDocMetaData(uint userSlot) public view returns( string memory, string memory, uint, uint, uint){
        return ( 
            docBins[docKeys[userSlot]].docLabel,
            docBins[docKeys[userSlot]].docHash,
            docBins[docKeys[userSlot]].lastUpdated,
            docBins[docKeys[userSlot]].docNextSlot,
            userSlot
            );
    }

    function stringToBytes32(string memory source) private returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }
    
    function strConcat(string memory _a, string memory _b, string memory _c, string memory _d, string memory _e) internal returns (string memory){
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    bytes memory _bc = bytes(_c);
    bytes memory _bd = bytes(_d);
    bytes memory _be = bytes(_e);
    string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
    bytes memory babcde = bytes(abcde);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
    for (uint i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
    for (uint i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
    for (uint i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
    for (uint i = 0; i < _be.length; i++) babcde[k++] = _be[i];
    return string(babcde);
}



function strConcat(string memory _a, string memory _b) internal returns (string memory) {
    return strConcat(_a, _b, "", "", "");
}

}

