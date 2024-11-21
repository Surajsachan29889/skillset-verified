require("babel-register");
require("babel-polyfill");

const HDWalletProvider = require("@truffle/hdwallet-provider");
const { SEED_PHRASE, INFURA_KEY } = require("./seed-phrase");
const infuraKey = `https://holesky.infura.io/v3/${INFURA_KEY}`; // Ensure this URL is correct
const seedPhrase = SEED_PHRASE;

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 7545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    holesky: {
      provider: () => new HDWalletProvider(seedPhrase, infuraKey),
      network_id: 17000, // Replace with the correct network ID for Holesky
      gas: 6000000,
      gasPrice: 20000000000,
      confirmations: 2,
      timeoutBlocks: 200000000000000,
      skipDryRun: true,
      networkCheckTimeout: 1000000 // Increase the network timeout
    },
  },
  contracts_directory: "./src/contracts/",
  contracts_build_directory: "./src/abis/",
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "petersburg",
    },
  },
  plugins: ["truffle-contract-size"],
};
