require("dotenv").config();
const { Web3 } = require('web3');

// This is example code to interact with the Controller contract

// run `npx hardhat compile` to generate artifacts
// or you can copy contract ABI from Etherscan,...
// const controllerAbi = [...];
const controllerAbi = require("../artifacts/contracts/Controller.sol/Controller.json").abi;

// after deploying the contract, get the address
const controllerAddress = "0x62b2f22c3B4CF29f0D04417ec32A7Ea0b26b3a5D";

// set values from .env file
const web3js = new Web3(new Web3.providers.HttpProvider(`${process.env.NETWORK_URL}`));
const walletAddress = process.env.WALLET_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

async function interact() {
    const account = web3js.eth.accounts.privateKeyToAccount('0x' + privateKey);
    web3js.eth.accounts.wallet.add(account);

    controllerContract = await new web3js.eth.Contract(controllerAbi, controllerAddress);

    // updateData function
    sessionId = await controllerContract.methods.uploadData("doc1").send({ 
        from: walletAddress, 
        gas: 300000     // can change this value for faster processing
    })
    .on('receipt', (receipt) => {
        console.log(receipt);
    })
    .on('error', console.error);

    // getDoc function
    uploadSesstion = await controllerContract.methods.getDoc("doc1").call();
    console.log(uploadSesstion);

    // confirm function
    confirm = await controllerContract.methods.confirm(
        "doc1",
        "content-hash",
        "proof",
        1, 2,
    ).send({ 
        from: walletAddress, 
        gas: 300000
    })
    .on('receipt', (receipt) => {
        console.log(receipt);
    })
    .on('error', console.error);
}

interact();