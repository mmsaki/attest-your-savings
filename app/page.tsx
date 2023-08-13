"use client";
import { Suspense } from "react";
import {
  useAccount,
  useNetwork,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import {
  useSigner,
  useProvider,
  walletClientToSigner,
  publicClientToProvider,
} from "./hooks/useSigner";
import UseConnect from "@/app/hooks/UseConnect";
import UseSwitchNetwork from "@/app/hooks/UseSwitchNetwork";
import UseBalance from "@/app/hooks/UseBalance";
import UseToken from "@/app/hooks/UseToken";
import UseBlockNumber from "@/app/hooks/UseBlockNumber";

// 2. Safe SDK
import { ethers } from "ethers";
import SafeL2, {
  EthersAdapter,
  SafeFactory,
  SafeAccountConfig,
  SafeConfig,
} from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import Safe from "@safe-global/protocol-kit";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";

// 3. EAS
import {
  EAS,
  Offchain,
  SchemaEncoder,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";

const network = "goerli";
const owner1 = "0xFE948CB2122FDD87bAf43dCe8aFa254B1242c199";
const owner2 = "0xc5Bfc2fc66F3d1E34B2772dA07f39358De0377f3";
const owner3 = "0x6D490b1281579ad14c8d760c1D47d812a81193b2";
// const safeAddress = "0xfa616b2F374665C9ECfEa1D29c1cfB488d5e7136"; // goerli
const safeAddress = "0x60C49Dad2C19A3C019b7275C131404A35A31EB5C"; // base-goerli

export default function Home() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const publicClient = usePublicClient();
  const provider = useProvider();
  const signer = useSigner();

  // 0a. Create the EthersAdapter
  if (!walletClient) return;
  const safeOwner = walletClientToSigner(walletClient);
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: safeOwner,
  });

  // 0b. Initialize the safe api kit
  const txServiceUrl = `https://safe-transaction-${network}.safe.global`;
  const safeService = new SafeApiKit({ txServiceUrl, ethAdapter });

  // 1. View Safe
  async function getGoerliSafe() {
    var safe: HTMLElement | null = document.getElementById("safe-sdk");

    const mySafe = await safeService.getSafeInfo(safeAddress);
    console.log("My Safe ==> ", mySafe);

    if (mySafe && safe) {
      safe.innerHTML = `
			<p>Safe Address: ${JSON.stringify(mySafe.address)}</p>
			<p>Fallback Handler: ${JSON.stringify(mySafe.fallbackHandler)}</p>
			<p>Master Copy: ${JSON.stringify(mySafe.masterCopy)}</p>
			<p>Owners: ${JSON.stringify(mySafe.owners)}</p>
			<p>Threshhold: ${JSON.stringify(mySafe.threshold)}</p>
			<p>Version: ${JSON.stringify(mySafe.version)}</p>
			`;
    }
  }

  // 2. Deploy Safe
  async function createNewSafe() {
    var factory: HTMLElement | null = document.getElementById("safe-factory");

    const safeFactory = await SafeFactory.create({ ethAdapter });

    const owners = [owner1, owner2, owner3];
    const threshold = 1;
    const safeAccountConfig: SafeAccountConfig = {
      owners,
      threshold,
    };

    const safeSdk: Safe = await safeFactory.deploySafe({
      safeAccountConfig,
      options: {
        gasLimit: 300_000,
      },
    });

    const newSafeAddress = safeSdk.getAddress();
    const newSafeBalance = safeSdk.getBalance();
    const newSafeOwners = safeSdk.getOwners();

    console.log("🏦 New Safe Created: ", newSafeAddress);

    if (factory && safeSdk) {
      factory.innerHTML = `
			<p>New Safe Address: ${JSON.stringify(newSafeAddress, null, 2)}</p>
			<p>Balance: ${JSON.stringify(newSafeBalance, null, 2)}</p>
			<p>Safe Owners: ${JSON.stringify(newSafeOwners, null, 2)}</p>
			`;
    }
  }

  // 3. Create Transaction Safe
  async function createTransaction() {
    var txElement: HTMLElement | null =
      document.getElementById("safe-transaction");
    var executeElement: HTMLElement | null = document.getElementById(
      "execute-transaction"
    );
    var linkElement: HTMLElement | null = document.getElementById("tx-link");

    const safeSdk: Safe = await Safe.create({
      ethAdapter: ethAdapter,
      safeAddress,
    });

    const safeTransactionData: SafeTransactionDataPartial = {
      to: owner3,
      value: "100",
      data: "0x",
    };
    const safeTransaction = await safeSdk.createTransaction({
      safeTransactionData,
    });

    console.log("Safe Transaction", safeTransaction);

    if (txElement && safeTransaction) {
      txElement.innerHTML = `
			<p>Safe Transaction: ${JSON.stringify(safeTransaction, null, 2)}</p>
			`;
    }

    const txResponse = await safeSdk.executeTransaction(safeTransaction);
    await txResponse.transactionResponse?.wait();
    console.log("🧾 Tx Reponse", txResponse);

    if (executeElement && linkElement && txResponse) {
      executeElement.innerHTML = `
			<p>Executed Tx: ${JSON.stringify(txResponse, null, 2)}</p>
			`;
      linkElement.innerText = "🧾 view transaction";
      if (chain?.network === "base-goerli") {
        linkElement.setAttribute(
          "href",
          `https://goerli.basescan.org/tx/${txResponse.hash}`
        );
      }
      if (chain?.network === "goerli") {
        linkElement.setAttribute(
          "href",
          `https://goerli.etherscan.io/tx/${txResponse.hash}`
        );
      }
    }
  }

  // 3. EAS
  async function getAttestation() {
    var getAttestationElement: HTMLElement | null =
      document.getElementById("get-attestation");

    let EASContractAddress;
    let SchemaRegistryContractAddress;
    let uid;
    let eas;
    let schemaRegistry;
    if (!chain) return;
    if (chain.network === "sepolia") {
      EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // sepolia v0.26
      SchemaRegistryContractAddress =
        "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0";
      uid =
        "0x5c308a858c3289f7a8756bd66f5aab60691b71fdac2cd9d9555c6cd0d0d8b1ce";
    }

    if (chain.network === "base-goerli") {
      EASContractAddress = "0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A"; // base-goeli v0.27
      SchemaRegistryContractAddress =
        "0x720c2bA66D19A725143FBf5fDC5b4ADA2742682E";
      uid =
        "0x1f068dfdd592c27617c573d5f669c3f9367113c8cb3231afe6b06bb2839f12c4";
    }

    if (EASContractAddress && SchemaRegistryContractAddress) {
      eas = new EAS(EASContractAddress);
      schemaRegistry = new SchemaRegistry(SchemaRegistryContractAddress);
    }

    if (!publicClient) return;
    const provider = publicClientToProvider(publicClient);
    // @ts-ignore
    eas.connect(provider);
    console.log("uid", uid);

    if (!eas || !uid) return;
    const attestation = await eas.getAttestation(uid);
    console.log(attestation);

    console.log(schemaRegistry);
    if (!schemaRegistry) return;
    // const schemaRecord = await schemaRegistry.getSchema({ uid });
    // console.log(schemaRecord);

    if (getAttestationElement && attestation) {
      getAttestationElement.innerHTML = `
      <p>🐾 Attestation: ${JSON.stringify(attestation)}</p>
      `;
    }
  }

  // 4. Create Schema
  async function registerSchema() {
    var registerElement: HTMLElement | null =
      document.getElementById("register-schema");
    var registerSchemaTxElement: HTMLElement | null =
      document.getElementById("resiger-schema-tx");

    let schemaRegistryContractAddress;
    let resolverAddress;

    if (chain?.network === "base-goerli") {
      schemaRegistryContractAddress =
        "0x720c2bA66D19A725143FBf5fDC5b4ADA2742682E"; // base-goerli v0.27
    }
    if (chain?.network === "sepolia") {
      resolverAddress = "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
      schemaRegistryContractAddress =
        "0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0"; // Sepolia 0.26
    }

    if (!schemaRegistryContractAddress) return;
    const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
    // @ts-ignore
    schemaRegistry.connect(signer);
    const schema = "bytes txHash, uint256 amount";
    const revocable = true;
    const transaction = await schemaRegistry.register({
      schema,
      resolverAddress,
      revocable,
    });

    await transaction.wait();
    console.log("🧾 Created Schema: ", transaction);

    if (registerElement && registerSchemaTxElement && transaction) {
      registerElement.innerHTML = `
      <p>📚 Schema: ${JSON.stringify(transaction)}</p>
      `;
      registerSchemaTxElement.innerHTML = "🧾 view transaction";
      if (!chain) return;
      if (chain.network === "base-goerli") {
        registerSchemaTxElement.setAttribute(
          "href",
          `https://goerli.basescan.org/tx/${transaction.tx.hash}`
        );
      }
      if (chain.network === "goerli") {
        registerSchemaTxElement.setAttribute(
          "href",
          `https://goerli.etherscan.io/tx/${transaction.tx.hash}`
        );
      }
      if (chain.network === "sepolia") {
        registerSchemaTxElement.setAttribute(
          "href",
          `https://sepolia.etherscan.io/tx/${transaction.tx.hash}`
        );
      }
    }
  }

  async function createAttestation() {}

  return (
    <main>
      <div className="flex flex-col">
        <UseConnect />
      </div>
      <div className="flex flex-col">
        <UseSwitchNetwork />
      </div>
      {isConnected && chain?.network === "sepolia" && (
        <>
          <div className="">
            <UseBalance address={address} />
            <UseBalance
              address={address}
              token={"0x3393C3b8DD9e44657358e6fE092D9a3110181E78"}
            />
          </div>
          <h1 className="text-2xl">Cross Chain Saving Account!</h1>
          <Suspense fallback={<p>Loading saving details...</p>}>
            <UseToken address={"0x3393C3b8DD9e44657358e6fE092D9a3110181E78"} />
          </Suspense>
          <Suspense fallback={<p>Loading block number...</p>}>
            <UseBlockNumber />
          </Suspense>
        </>
      )}
      {/* 1. Safe Goerli */}
      {isConnected && chain?.network === "goerli" && (
        <>
          <div className="">
            {/* 1. View Safe */}
            <h1 className="bold text-2xl">Goerli Safe 🏦</h1>
            <h2 className="bold">1. View Safes</h2>
            <button
              type="button"
              onClick={() => getGoerliSafe()}
              className="bg-red-100 px-1"
            >
              View Safe
            </button>
            <div id="safe-sdk"></div>
            {/* 2. Deploy New Safe */}
            <h2>2. Deploy Safe</h2>
            <button
              type="button"
              onClick={() => createNewSafe()}
              className="bg-red-100 px-1"
            >
              Create New Safe
            </button>
            <div id="safe-factoy"></div>
            {/* 3. Create Safe Transaction */}
            <h2>2. Create Safe Transaction</h2>
            <button
              type="button"
              onClick={() => createTransaction()}
              className="bg-red-100 px-1"
            >
              Send Transaction
            </button>
            <div id="safe-transaction"></div>
            <button
              type="button"
              onClick={() => createTransaction()}
              className="bg-red-100 px-1"
            >
              Execute Transaction
            </button>
            <div className="text-sky-500" id="execute-transaction"></div>
          </div>
        </>
      )}
      {/* 2. Safe Base Goerli */}
      {isConnected && (chain?.network === "base-goerli" || "sepolia") && (
        <>
          <div className="border p-4">
            <div id="safe-sdk"></div>
            {/* 1. Deploy New Safe */}
            <h2>1. Deploy Safe</h2>
            <button
              type="button"
              onClick={() => createNewSafe()}
              className="bg-red-100 px-1"
            >
              Create New Safe
            </button>
            <div id="safe-factoy"></div>
            {/* 2. Create Safe Transaction */}
            <h2>2. Create Safe Transaction</h2>
            <button
              type="button"
              onClick={() => createTransaction()}
              className="bg-red-100 px-1"
            >
              Send Transaction
            </button>
            <div id="safe-transaction" className="overflow-x-auto"></div>
            <button
              type="button"
              onClick={() => createTransaction()}
              className="bg-red-100 px-1"
            >
              Execute Transaction
            </button>
            <div>
              <a
                id="tx-link"
                href=""
                className="text-sky-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              ></a>
            </div>
            <div
              className="text-sky-600 overflow-x-auto"
              id="execute-transaction"
            ></div>
            {/* 3. Making Attestations */}
            <h1 className="text=2xl">Attestations</h1>
            <button
              type="button"
              onClick={() => getAttestation()}
              className="bg-red-100 px-1"
            >
              Get Attestation
            </button>
            <div id="get-attestation" className="overflow-scroll"></div>
            <button
              type="button"
              onClick={() => registerSchema()}
              className="bg-red-100 px-1"
            >
              Register Schema
            </button>
            <div>
              <a
                href=""
                id="resiger-schema-tx"
                className="text-sky-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              ></a>
            </div>
            <div
              id="register-schema"
              className="text-sky-600 overflow-x-auto"
            ></div>
            {/* 4. Create Attesation */}
            <h1>4. Create Attestation</h1>
            <button
              type="button"
              onClick={() => createAttestation()}
              className="bg-red-100 px-1"
            >
              Attest!
            </button>
          </div>
        </>
      )}
    </main>
  );
}
