"use client";

import { useEffect, useState } from "react";
import { ChangeEvent } from "react";
import Layout from "../components/Layout";
import Image from "../components/Image";
import Icon from "../components/Icon";
import Details from "./Details";

import {
  useAccount,
  useNetwork,
  usePublicClient,
  useWalletClient,
  useBalance,
} from "wagmi";
import {
  useSigner,
  useProvider,
  walletClientToSigner,
} from "../hooks/useSigner";

// 2. Safe SDK
import { ethers } from "ethers";
import SafeL2, {
  EthersAdapter,
  SafeFactory,
  SafeAccountConfig,
} from "@safe-global/protocol-kit";
import SafeApiKit from "@safe-global/api-kit";
import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import Safe from "@safe-global/protocol-kit";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import {
  EAS,
  SchemaEncoder,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";

type DetailsProps = {
  hash: string;
  options: {
    from: string;
    gasLimit: string;
  };
  transactionResponse: {
    accessList: null;
    blockHash: null;
    blockNumber: null;
    chainId: number;
    confirmations: number;
    creates: null;
    data: string;
    from: string;
    gasLimit: BigInt;
    gasPrice: BigInt;
    hash: string;
    maxFeePerGas: BigInt;
    maxPriorityFeePerGas: BigInt;
    nonce: number;
    r: string;
    s: string;
    to: string;
    transactionIndex: null;
    type: number;
    v: number;
    value: BigInt;
  };
};

const transactionDetails = [
  {
    title: "Hash",
    value: "",
  },
  {
    title: "from",
    value: "",
  },
  {
    title: "to",
    value: "",
  },
  {
    title: "gasLimit",
    value: "",
  },
  {
    title: "data",
    value: "",
  },
  {
    title: "value",
    value: "",
  },
  {
    title: "maxFeePerGas",
    value: "",
  },
  {
    title: "nonce",
    value: "",
  },
  {
    title: "type",
    value: "",
  },
  {
    title: "r",
    value: "",
  },
  {
    title: "s",
    value: "",
  },
  {
    title: "v",
    value: "",
  },
];

// 3. EAS

const network = "goerli";
const owner1 = "0xFE948CB2122FDD87bAf43dCe8aFa254B1242c199";
const owner2 = "0xc5Bfc2fc66F3d1E34B2772dA07f39358De0377f3";
const owner3 = "0x6D490b1281579ad14c8d760c1D47d812a81193b2";

const CryptoTransactionPage = () => {
  const [logTx, setLogTx] = useState<DetailsProps>();
  const [attestationValue, setAttestationValue] = useState();

  const { address, isConnected } = useAccount();
  const { data: userBalance } = useBalance({
    address: address,
  });
  const { chain } = useNetwork();
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const publicClient = usePublicClient();
  const provider = useProvider();
  const signer = useSigner();

  // 1. View Safe
  async function getGoerliSafe() {
    let network;
    let safeAddress;
    if (!chain) return;
    if (chain.network === "goerli") {
      safeAddress = "0xfa616b2F374665C9ECfEa1D29c1cfB488d5e7136"; // goerli
      network = "goerli";
    } else if (chain.network === "base-goerli") {
      safeAddress = "0x60C49Dad2C19A3C019b7275C131404A35A31EB5C"; // base-goerli
      network = "base-goerli";
    }
    // 0a. Create the EthersAdapter
    console.log("wallet Client", walletClient);
    if (!walletClient) return;
    const safeOwner = walletClientToSigner(walletClient);
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: safeOwner,
    });

    // 0b. Initialize the safe api kit
    const txServiceUrl = `https://safe-transaction-${network}.safe.global`;
    if (!ethAdapter) return;
    const safeService = new SafeApiKit({ txServiceUrl, ethAdapter });

    var safe: HTMLElement | null = document.getElementById("safe-sdk");

    if (!safeAddress) return;
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

    // 0a. Create the EthersAdapter
    console.log("wallet Client", walletClient);
    if (!walletClient) return;
    const safeOwner = walletClientToSigner(walletClient);
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: safeOwner,
    });

    // 0b. Initialize the safe api kit
    const txServiceUrl = `https://safe-transaction-${network}.safe.global`;
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

    let safeAddress;
    if (!chain) return;
    if (chain.network === "goerli") {
      safeAddress = "0xfa616b2F374665C9ECfEa1D29c1cfB488d5e7136"; // goerli
    } else if (chain.network === "base-goerli") {
      safeAddress = "0x60C49Dad2C19A3C019b7275C131404A35A31EB5C"; // base-goerli
    }

    if (!walletClient) return;
    const safeOwner = walletClientToSigner(walletClient);
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: safeOwner,
    });

    if (!safeAddress || !ethAdapter) return;
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
    // @ts-ignore
    setLogTx(txResponse);

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

  function writeElements() {
    if (!logTx) return;
    for (let index = 0; index < transactionDetails.length; index++) {
      const element: HTMLElement | null = document.getElementById(
        transactionDetails[index].title
      );
      if (!element) return;
      if (transactionDetails[index].title in logTx.transactionResponse)
        // @ts-ignore
        transactionDetails[index].value = logTx.transactionResponse.hash;
      // element.innerText = JSON.stringify(logTx["transactionResponse"][`${transactionDetails[index].title}`]`);
    }
  }

  // useEffect(() => {
  //   // setLogTx;
  //   writeElements();
  //   console.log(logTx);
  // }, []);

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
        "0xda9d6436541a774dc7a0b990e22c7dc2b6db70c9780e8bae7da0e5ca6e88ba31";
    }

    if (chain.network === "base-goerli") {
      EASContractAddress = "0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A"; // base-goeli v0.27
      SchemaRegistryContractAddress =
        "0x720c2bA66D19A725143FBf5fDC5b4ADA2742682E";
      uid =
        "0xee01e26c01ee186d3cb2e5e9f959b8ebadd642110000046954e87ab132c5938f";
    }

    if (EASContractAddress && SchemaRegistryContractAddress) {
      eas = new EAS(EASContractAddress);
      schemaRegistry = new SchemaRegistry(SchemaRegistryContractAddress);
    }

    if (!publicClient) return;
    // const provider = publicClientToProvider(publicClient);
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
    // @ts-ignore
    setTransaction(transaction);

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

  async function createAttestation() {
    var newAttestationElement: HTMLElement | null =
      document.getElementById("new-attestation");
    var newAttestationTxElement: HTMLElement | null =
      document.getElementById("new-attestation-tx");

    let safeAddress;
    let network;
    let EASContractAddress;
    let uid;
    let eas;
    let schemaRegistry;

    if (!chain) return;
    if (chain.network === "goerli") {
      network = "goerli";
      safeAddress = "0xfa616b2F374665C9ECfEa1D29c1cfB488d5e7136"; // goerli
    } else if (chain.network === "base-goerli") {
      network = "base-goerli";
      safeAddress = "0x60C49Dad2C19A3C019b7275C131404A35A31EB5C"; // base-goerli
      EASContractAddress = "0xAcfE09Fd03f7812F022FBf636700AdEA18Fd2A7A"; // base-goeli v0.27
      uid =
        "0x1f068dfdd592c27617c573d5f669c3f9367113c8cb3231afe6b06bb2839f12c4";
    } else if (chain.network === "sepolia") {
      network = "sepolia";
      EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // sepolia v0.26
      uid =
        "0x5c308a858c3289f7a8756bd66f5aab60691b71fdac2cd9d9555c6cd0d0d8b1ce";
    }

    if (!EASContractAddress) return;
    eas = new EAS(EASContractAddress);
    if (!eas) return;
    // @ts-ignore
    eas.connect(signer);

    // Initialize SchemaEncoder with the schema string
    const schemaEncoder = new SchemaEncoder("bytes txHash, uint256 amount");
    const encodedData = schemaEncoder.encodeData([
      {
        name: "txHash",
        value:
          "0x2f50e4c0d6578e53596e20e1699f4a0d1f8cf7edfbf4d04324f65ee43b1bd257",
        type: "bytes",
      },
      { name: "amount", value: 100, type: "uint256" },
    ]);

    if (!uid || !safeAddress) return;
    const tx = await eas.attest({
      schema: uid,
      data: {
        recipient: safeAddress,
        expirationTime: BigInt(0),
        revocable: true, // Be aware that if your schema is not revocable, this MUST be false
        data: encodedData,
      },
    });

    const newAttestationUID = await tx.wait();
    console.log("New attestation UID:", newAttestationUID);
    console.log(
      "🧾 Attestation Tx:",
      `https://${network}.easscan.org/attestation/view/${newAttestationUID}`
    );

    if (newAttestationElement && newAttestationUID && newAttestationTxElement) {
      newAttestationElement.innerHTML = `
      <p>Attestation UID ${newAttestationUID}</p>
      `;
      newAttestationTxElement.innerText = "🧾 Confirm Transaction";
      newAttestationTxElement.setAttribute(
        "href",
        `https://${network}.easscan.org/attestation/view/${newAttestationUID}`
      );
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    setAttestationValue(event.target.value);
    console.log("NEW VALUE", event.target.value);
  };
  return (
    <Layout title="My Safe" back>
      <div className="flex space-x-5 lg:block lg:space-x-0 lg:space-y-5">
        <div className="flex flex-col flex-1 card p-5">
          <div className="flex items-center mb-6">
            <div className="w-8 mr-3 text-0 rounded-full dark:bg-white">
              {chain?.network === "base" || chain?.network === "base-goerli" ? (
                <div className="rounded-full h-[24px] w-[24px] bg-[conic-gradient(#0000ff,#0000ff,#fff)]"></div>
              ) : (
                <Image
                  className="w-full dark:scale-105"
                  src="/images/ethereum.svg"
                  width={28}
                  height={28}
                  alt=""
                />
              )}
            </div>
            <div className="mr-1 font-bold">
              {chain ? chain?.name + " " + chain?.nativeCurrency.symbol : ""}
            </div>
          </div>
          <div className="text-h4">
            Balance:{" "}
            {userBalance
              ? userBalance?.formatted + userBalance?.symbol
              : "0 ETH"}
          </div>
          <div className="mb-6 text-sm font-medium text-n-3 dark:text-white/50">
            $
            {userBalance
              ? eval(userBalance?.formatted + "*" + "1800").toFixed(2)
              : "0"}
          </div>
          <div className="mb-6 pb-6 border-b border-dashed border-n-1 text-sm dark:border-white"></div>
          {/* 1. Deploy Safe */}
          <h2>1. Deploy Safe</h2>
          <button
            type="button"
            onClick={() => createNewSafe()}
            className="btn-stroke btn-small mt-5"
          >
            🏦 Create New Safe
          </button>
          <div
            id="safe-factoy"
            className="text-green-700 overflow-x-auto"
          ></div>
          <div className="mb-6 pb-6 border-b border-dashed border-n-1 dark:border-white">
            <div className="flex justify-between items-center mb-2.5 text-xs font-medium text-n-3 dark:text-white/50">
              <div>From</div>
              <div>
                {userBalance?.formatted} {userBalance?.symbol}{" "}
              </div>
            </div>
            {/* 2. View Safes */}
            <h2 className="bold">2. View Safes</h2>
            <button
              type="button"
              onClick={() => getGoerliSafe()}
              className="btn-stroke btn-small my-5 w-full"
            >
              <Icon name="repeat" />
              View Safe
            </button>
          </div>
          <div className="mb-2 md:mb-7">
            <div id="safe-sdk" className="overflow-x-auto"></div>
          </div>
          {/* 3. Execute transactions */}
          <h1>3. Execute Safe Tranaction</h1>
          <div id="safe-transaction" className="overflow-x-auto"></div>
          <button
            type="button"
            onClick={() => createTransaction()}
            className="btn-stroke btn-large mt-5"
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
        </div>
        <div className="flex-1">
          <div className="card">
            <div className="card-head">
              <div className="text-h6">Transaction Details</div>

              <button className="group">
                <Icon
                  className="icon-18 transition-colors dark:fill-white group-hover:fill-purple-1"
                  name="chart"
                />
              </button>
            </div>
            <div className="pt-2 px-5 pb-5">
              <div
                className="text-sky-600 overflow-x-auto  overflow-scroll"
                id="execute-transaction"
              ></div>
              <div>
                {transactionDetails.map((item, index) => (
                  <div
                    className="flex justify-between items-center py-3.5 border-b border-dashed border-n-1 text-sm last:border-none dark:border-white"
                    key={index}
                  >
                    <div className="font-medium text-n-3 dark:text-white/50">
                      {item.title}
                    </div>
                    <div className="font-bold" id={item.title}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
              <a
                id="tx-link"
                href=""
                className="btn-stroke btn-small w-full mt-4"
              >
                <Icon name="chart-fill" />
                <span>See more details</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* 1. Base Goerli */}
      {isConnected &&
        (chain?.network === "base-goerli" || "sepolia" || "goerli") && (
          <>
            <div className="border p-4">
              {/* 3. Create Safe Transaction */}
              <h2>3. Create Safe Transaction</h2>
              <button
                type="button"
                onClick={() => createTransaction()}
                className="bg-red-100 px-1"
              >
                Send Transaction
              </button>

              {/* 5. Making Attestations */}
              <h1 className="text=2xl">5. Make Attestations</h1>
              <button
                type="button"
                onClick={() => getAttestation()}
                className="bg-red-100 px-1"
              >
                Get Attestation
              </button>
              <div id="get-attestation" className="overflow-scroll"></div>
              {/* 6. Register Schema */}
              <h1>6. Register Schema</h1>
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
              {/* 7. Create Attesation */}
              <h1>7. Create Attestation</h1>
              <button
                type="button"
                onClick={() => createAttestation()}
                className="bg-red-100 px-1 pb-3"
              >
                🐾 Attest!
              </button>
              <div
                className={`flex w-[18rem] pl-1 py-1 pr-5 bg-white border border-n-1 shadow-primary-4 md:pr-4 dark:bg-n-1 dark:border-white`}
              >
                <input
                  className="grow self-center py-1 px-4 bg-transparent text-sm font-medium text-n-1 outline-none resize-none placeholder:text-n-1 md:px-3 dark:text-white dark:placeholder:text-white"
                  autoFocus
                  onChange={handleInputChange}
                  placeholder="Add something to attest"
                  required
                  id="attestation-value"
                  name="attestation"
                  type="text"
                />

                <div className="flex items-center shrink-0 h-[3.375rem]">
                  <button
                    className="btn-purple btn-square btn-small"
                    type="button"
                    onClick={createAttestation}
                  >
                    <Icon name="send" />
                  </button>
                </div>
              </div>
              <div
                id="new-attestation"
                className="text-green-700 overflow-x-auto"
              ></div>
              <div>
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                  id="new-attestation-tx"
                  className="text-sky-700 hover:underline"
                ></a>
              </div>
            </div>
          </>
        )}
    </Layout>
  );
};

export default CryptoTransactionPage;
