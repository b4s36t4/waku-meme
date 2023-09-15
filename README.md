# Waku Meme board.

A Vite project bootstrapped with React & Typescript.

This project contains code the bounty challenge by @waku-org.

In this project I have leveraged the Decentralized communication solution `waku` and Decentralized storage solution IPFS.

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

Please follow this guide on how to add the config to IPFS https://docs.ipfs.tech/reference/kubo/rpc/#origin-based-security.

### Installing IPFS in browser.

If you're using brave browser you can easily install IPFS node within your browser fully managed by brave.

If you're using any other browser you can either follow above guide to install IPFS locally or you can use experimental IPFS companion app which spins up a local IPFS node.

> [!WARNING]  
> IPFS companion app is highly experimental issues might be there.

Checkout more on IPFS companion extension [here](https://github.com/ipfs/ipfs-companion)

**Steps to enable IPFS in brave**

1. Go to brave settings
2. Select Web3 option on left side nav
3. Scroll down and move to `IPFS` section
4. Under **Method to resolve IPFS resources** Select **Brave Local IPFS Node**

![IPFS setup](/images/ipfs-setup-brave.png)

Once all these steps are done navigate `brave://ipfs` and see weather the node is started or not.

If not click on start and boom!!!! you have a running local IPFS node.

> [!IMPORTANT]  
> We need IPFS API endpoint & gateway endpoint for the node that we just started.

It might look like this

```json
API: /ip4/127.0.0.1/tcp/45005
Gateway: /ip4/127.0.0.1/tcp/48084
```

We need these values configured into our environment variables which you can by defining the value inside `.env`

**Example ENV**

```shell
REACT_APP_IPFS_GATEWAY=http://127.0.0.1:48084
REACT_APP_IPFS_API=http://127.0.0.1:45005
```

> You can also use public gateway's to load the content from ipfs. Example are `ipfs.io` or `dweb.link`

> [!NOTE]
> We need to add the allowed origins to the IPFS config to support cors error inside browser.

### Configuring the CORS

If you've followed everything as per the above doc you should be having IPFS webui available inside your system.

> If you're using brave IPFS and following guide correctly you can access the webi from `brave://ipfs` and then click on `My Node` option.

1. Open IPFS web UI
2. Go to settings
3. Navigate to **IPFS Config** Section

```json
"API": {
    "HTTPHeaders": {
        "Access-Control-Allow-Origin": [
            "*"
        ]
    }
},
```

Add the above snippet to the config to access the IPFS from browser.

> - means we're allowing every origin to upload file. It's not a security threat because API is resolved again localhost.

More on CORS [here](https://docs.ipfs.tech/reference/kubo/rpc/#origin-based-security)

### Configuring Environment variables for application.

Basic environments need for the application are already included `.env.local` file you can copy it to `.env` and update them.

`REACT_APP_MEME_CONTENT_TOPIC`: Topic which we will be subscribing via waku
`REACT_APP_IPFS_GATEWAY`: IPFS gateway URL to fetch memes from.
`REACT_APP_IPFS_API`: Local running IPFS API.

All these variables contains defaults values which are tested with the application, be cautious when changing.

> Always available if need any help :)

### Why local IPFS?

Well, at this point to achieve the decentralization that waku is expecting BYON(Bring your own Node) is the way to go.
