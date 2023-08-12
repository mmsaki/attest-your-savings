# Crosschain Savings Account

1. First, install packages

   ```sh
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

1. Then, run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

## Project scope

1. Initialize safe contract with protocol sdk for savings account
1. View all your porfolio in one place
1. No need to use bridges

## Initialize Safe

1. We install safe sdks
   ```sh
   npm i @safe-global/safe-core-sdk-types @safe-global/protocol-kit @safe-global/api-kit
   ```
1. Created Ethers adapter

   > Ethers.js wrapper that contains some utilities and the Safe contracts types (generated with typechain ethers-v5). It is used to initialize the Protocol Kit.

1. Initialize safekit api using https://safe-transaction-base.safe.global/, https://safe-transaction-goerli.safe.global/, https://safe-transaction-optimism.safe.global/

   ```

   ```

## Layerzero

A user can pay from one source chain and trigger an action on destination chain. No bridging risk.

1. Example for omnichain messaging - [Ominmessage](https://github.com/St0rmBr3w/OmniMessage)
1. Testnet scan - [testnet.layerzeroscan.com](https://testnet.layerzeroscan.com/)
