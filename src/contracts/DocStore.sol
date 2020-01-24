pragma solidity >=0.4.22 <0.6.0;
contract DocStore
{

  struct DocData {
        string slot;
        string docLabel;
        bytes32 docHash;
        string docBin;
        uint timestamp;
    }

  mapping(bytes32 => DocData) public docBins;
    mapping(bytes32 => DocData) docHashes;

bytes32 docHash;
string docBin;

   // constructor() public {
    // }

    function storeBin(string memory storageContainer, string memory slot, string memory docLabel) public {
        bytes32 key = keccak256(append(msg.sender,slot));
        docBin = storageContainer;
        docHash = keccak256(abi.encodePacked(storageContainer));
        DocData memory  d = DocData(slot, docLabel, docHash, docBin, now);

        docBins[key] = d;

    }

    function append( address a, string memory b) internal pure returns (bytes memory) {

    return bytes(abi.encodePacked(a, b));

}

 function getDoc(string memory slot) public view returns( string memory, string memory, bytes32, string memory, uint){
    return ( docBins[keccak256(append(msg.sender,slot))].slot,
    docBins[keccak256(append(msg.sender,slot))].docLabel,
    docBins[keccak256(append(msg.sender,slot))].docHash,
    docBins[keccak256(append(msg.sender,slot))].docBin,
    docBins[keccak256(append(msg.sender,slot))].timestamp);
}

}
