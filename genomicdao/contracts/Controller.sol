// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./NFT.sol";
import "./Token.sol";

contract Controller {
    // remove using Counters for Counters.Counter;
    // https://github.com/OpenZeppelin/openzeppelin-contracts/issues/4233
    
    //
    // STATE VARIABLES
    //
    uint256 private _sessionIdCounter;
    GeneNFT public geneNFT;
    PostCovidStrokePrevention public pcspToken;

    struct UploadSession {
        uint256 id;
        address user;
        string proof;
        bool confirmed;
    }

    struct DataDoc {
        string id;
        string hashContent;
    }

    mapping(uint256 => UploadSession) sessions;
    mapping(string => DataDoc) docs;
    mapping(string => bool) docSubmits;
    mapping(uint256 => string) nftDocs;

    //
    // EVENTS
    //
    event UploadData(string docId, uint256 sessionId);

    constructor(address nftAddress, address pcspAddress) {
        geneNFT = GeneNFT(nftAddress);
        pcspToken = PostCovidStrokePrevention(pcspAddress);
    }

    function uploadData(string memory docId) public docNotSubmited(docId) returns (uint256) {
        uint256 currentSessionId = _sessionIdCounter;
        sessions[currentSessionId] = UploadSession(currentSessionId, msg.sender, "", false);
        _sessionIdCounter += 1;
        emit UploadData(docId, currentSessionId);

        return currentSessionId;
    }

    function confirm(
        string memory docId,
        string memory contentHash,
        string memory proof,
        uint256 sessionId,
        uint256 riskScore
    ) public docNotSubmited(docId) validSession(sessionId) {
        // TODO: Implement this method: The proof here is used to verify that the result is returned from a valid computation on the gene data. For simplicity, we will skip the proof verification in this implementation. The gene data's owner will receive a NFT as a ownership certicate for his/her gene profile.

        // TODO: Verify proof, we can skip this step

        // Update doc content
        docSubmits[docId] = true;
        docs[docId] = DataDoc(docId, contentHash);

        // Mint NFT
        uint256 tokenId = geneNFT.safeMint(msg.sender);
        nftDocs[tokenId] = docId;

        // Reward PCSP token based on risk stroke
        pcspToken.reward(msg.sender, riskScore);

        // Close session
        sessions[sessionId] = UploadSession(sessionId, msg.sender, proof, true);
    }

    function getSession(uint256 sessionId) public view returns(UploadSession memory) {
        return sessions[sessionId];
    }

    function getDoc(string memory docId) public view returns(DataDoc memory) {
        return docs[docId];
    }

    modifier docNotSubmited(string memory docId) {
        require(!docSubmits[docId], "Doc already been submitted");
        _;
    }

    modifier validSession(uint256 sessionId) {
        require(sessions[sessionId].user == msg.sender, "Invalid session owner");
        require(!sessions[sessionId].confirmed, "Session is ended");
        _;
    }
}
