const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

    const NTFToken = await ethers.getContractFactory("GeneNFT");
    const ntfToken = await NTFToken.deploy();
    console.log("NTF Token address:", ntfToken.target);

    const PCSPToken = await ethers.getContractFactory("PostCovidStrokePrevention");
    const pcspToken = await PCSPToken.deploy();
    console.log("PCSP Token address:", pcspToken.target);

    const Controller = await ethers.getContractFactory("Controller");
    const controller = await Controller.deploy(ntfToken.target, pcspToken.target);

    await ntfToken.transferOwnership(controller.target);
    await pcspToken.transferOwnership(controller.target);

    console.log("Controller address:", controller.target);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });