# Tenderly Snap

Made from [@metamask/template-snap-monorepo](https://github.com/MetaMask/template-snap-monorepo)

# About

This project combines power of Tenderly simulation with MetaMask Snaps for improved transparency of dApp contract calls. 

Before transaction confirmation user is provided with: 

- Native-asset balance changes
- Output value
- Storage changes
- Event logs
- Call traces
- Link to simulation in Tenderly Dashboard

<p float="left">
  <img src="https://user-images.githubusercontent.com/46010359/228225024-52b93ed8-8101-4207-81cd-b2cf630e4bef.png" width="300" height="900" />
  <img src="https://user-images.githubusercontent.com/46010359/228225492-04e234d4-3002-496b-ac93-e6d40824a804.png" width="300" height="900" />
  <img src="https://user-images.githubusercontent.com/46010359/228225527-3c69e5af-50f8-445e-819e-9232bdbb56ef.png" width="300" height="900" />
</p>

### Metamask Snap

MetaMask Snaps are plugins that enhance MetaMask's capabilities, allowing for customized interactions with various blockchain assets and applications. The purpose of the Snaps system is to extend the functionality of MetaMask, allowing developers to create custom plugins that can interact with various blockchain networks, assets, and decentralized applications (dApps).

- [Snap template repo](https://github.com/MetaMask/template-snap-monorepo)
- [Dev docs](https://docs.metamask.io/guide/snaps.html#extend-the-functionality-of-metamask)

### Tenderly simulator API

The Tenderly Simulator is a powerful tool designed to help Ethereum developers test and debug smart contract transactions. It provides a sandboxed environment where developers can simulate transactions, evaluate gas usage, and perform step-by-step execution tracing. Simulator can be integrated with other system through simulator API.

- [Dev docs](https://docs.tenderly.co/simulations-and-forks/simulation-api)

# Setup

### Metmask dev

If production version of MetaMask is installed disable it in `chome://extensions/` or start a new Chrome/Brave profile.

Install [MetaMask Flask development plugin](https://chrome.google.com/webstore/detail/metamask-flask-developmen/ljfoeinjpaedjfecbmggjgodbgkmjkjk). 

### Tenderly access

Open Tenderly account and create an `access-key`. 

### Webapp

After cloning repo run `yarn start` to start a web app on port 8000. 

### Connection & Credentials

With webapp running first install snap with **“Reconnect”,** then add Tenderly credentials with **“Update access key”**. Latter needs to be in format `{user_id}@{project_id}@{access_key}`. 

### Usage

Through normal interaction with MetaMask formatted simulation response will appear in a tab on the right. 

# Contributions

Please feel free to contribute.

# Security

Note that this is experimental code as are currently MetaMask snaps so don’t rely on it using real financial assets or accounts that you wouldn’t like exploited.
