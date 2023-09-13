# Waku Meme board.

A Vite project bootstrapped with React & Typescript.

This project contains code the bounty challenge by @waku-org.

In this project I have leveraged the Decentralized communication solution `waku` and a IPFS service `pinata`.

You can easily upload/download memes shared by others, fully decentralized fully open. No authentication need or so ever.

## Setting up this project.

This project uses `pnpm` as the base package manager and expects atleast node v16.

if you don't have `pnpm` you can install using the following command

```shell
npm install -g pnpm
```

### Installing requirements

Run `pnpm install` to install the packages required for the repo to run.

> This repo uses `shadcn/ui` package for components

## Environment setup.

To keep this application fully decentralized we're going to use local IPFS node instead of a hosted nodes/not fully decentralized nodes.

### Installing IPFS locally.

Please follow guide provided here to install the IPFS node locally https://docs.ipfs.tech/install/ipfs-desktop/

After installing the IPFS & running your local IPFS node we need to update the config of application.

We need to add the allowed origins to the IPFS config to support cors error inside browser.

Please follow this guide on how to add the config to IPFS https://docs.ipfs.tech/reference/kubo/rpc/#origin-based-security.

### Configuring Environment variables for application.

Basic environments need for the application are already included `.env.local` file you can copy it to `.env` and update them.

`REACT_APP_MEME_CONTENT_TOPIC`: Topic which we will be subscribing via waku
`REACT_APP_IPFS_GATEWAY`: IPFS gateway URL to fetch memes from.
`REACT_APP_LOCAL_IPFS_GATEWAY`: Local IPFS gateway for faster fetches (optional)
`REACT_APP_IPFS_API`: Local running IPFS API.

All these variables contains defaults values which are tested with the application, be cautious when changing.

> Always available if need any help :)

### Why local IPFS?

Well, at this point to achieve the decentralization that waku is expecting I feel local IPFS is way to go.

As a POC I have tested JS IPFS which doesn't require user to install any desktop or use any third party services.

How? helia more info here - https://github.com/ipfs/helia