pragma experimental ABIEncoderV2;
pragma solidity >=0.4.22 <0.6.0;
contract DocStore
{

    struct DocData {
        string[] dataParts;
        string docLabel;
        string docHash;
        uint lastUpdated;
        uint slot;
    }

    mapping(bytes32 => DocData) public docBins;
    mapping(uint => bytes32) public docKeys;
    uint public slotsCount = 0;

    function storeBin(string memory dataStr, string memory inpDocLabel, string memory inpDocHash, uint argFlag) public {
        
        // bytes32 data = stringToBytes32(dataStr);
        bytes32 key = keccak256(append(msg.sender,inpDocHash));
        
        if(argFlag == 1){
            if( compareStrings(docBins[key].docHash, "") ){
                docKeys[slotsCount] = keccak256(append(msg.sender,inpDocHash));
                slotsCount++;
            } else {
                delete docBins[key].dataParts;
                docBins[key].slot = 0;
            }
        } 
        
        docBins[key].dataParts.push(dataStr);
        docBins[key].docLabel = inpDocLabel;
        docBins[key].docHash = inpDocHash;
        docBins[key].lastUpdated = now;
        docBins[key].slot++;
    }

    function append( address a, string memory b) internal pure returns (bytes memory) {
        return bytes(abi.encodePacked(a, b));
    }

    function compareStrings (string memory a, string memory b) public view returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
    }

    function getDoc(uint inpSlot) public view returns( string memory, string memory, uint, string[] memory ){
        
        return ( 
            docBins[docKeys[inpSlot]].docLabel,
            docBins[docKeys[inpSlot]].docHash,
            docBins[docKeys[inpSlot]].lastUpdated,
            docBins[docKeys[inpSlot]].dataParts
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

