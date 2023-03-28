# Tenderly Snap

Made from [@metamask/template-snap-monorepo](https://github.com/MetaMask/template-snap-monorepo)

# About

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/da44bbb7-b6d8-4dd5-8e46-5031f027fcfd/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/727af367-bf50-405f-8955-1ab066576c5c/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/01360d78-31fa-4d56-82ed-5ec166adbcf8/Untitled.png)

This project combines power of Tenderly simulation with MetaMask Snaps for improved transparency of dApp contract calls. 

Before transaction confirmation user is provided with: 

- Native-asset balance changes
- Output value
- Storage changes
- Event logs
- Call traces
- Link to simulation in Tenderly Dashboard

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