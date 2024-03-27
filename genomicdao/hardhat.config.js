require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    deploy_network: {
      url: process.env.NETWORK_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
};
