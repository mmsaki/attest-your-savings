'use client';

import React from 'react';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { createPublicClient, http } from 'viem';
import {
	base,
	goerli,
	zora,
	zoraTestnet,
	baseGoerli,
	sepolia,
	polygonMumbai,
	modeTestnet,
} from '../constants/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { LedgerConnector } from 'wagmi/connectors/ledger';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { SafeConnector } from 'wagmi/connectors/safe';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY!;
const infuraKey = process.env.NEXT_PUBLIC_INFURA_KEY!;
const walletConnectID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

const { chains, publicClient, webSocketPublicClient } = configureChains(
	[
		baseGoerli,
		zoraTestnet,
		modeTestnet,
		sepolia,
		base,
		zora,
		goerli,
		polygonMumbai,
	],
	[
		alchemyProvider({ apiKey: alchemyKey as string }),
		infuraProvider({ apiKey: infuraKey as string }),
		publicProvider(),
	],
	{
		batch: { multicall: true },
		rank: true,
		retryCount: 5,
		stallTimeout: 5000,
		pollingInterval: 10_000,
	}
);

const config = createConfig({
	autoConnect: true,
	connectors: [
		new MetaMaskConnector({
			chains,
			options: {
				UNSTABLE_shimOnConnectSelectAccount: true,
			},
		}),
		new CoinbaseWalletConnector({
			chains,
			options: {
				appName: 'wagmi',
			},
		}),
		new WalletConnectConnector({
			chains,
			options: {
				projectId: walletConnectID ?? '',
			},
		}),
		new LedgerConnector({
			chains,
			options: {
				projectId: walletConnectID ?? '',
			},
		}),
		new InjectedConnector({
			chains,
			options: {
				name: (detectedName) =>
					`Injected (${
						typeof detectedName === 'string'
							? detectedName
							: detectedName.join(', ')
					})`,
				shimDisconnect: true,
			},
		}),
		new SafeConnector({
			chains,
			options: {
				allowedDomains: [/gnosis-safe.io$/, /https:\/\/app.safe.global$/],
				debug: true,
			},
		}),
	],
	publicClient,
	webSocketPublicClient,
});

export const Providers = ({ children }: { children: React.ReactNode }) => {
	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => setMounted(true), []);
	return <WagmiConfig config={config}>{mounted && children}</WagmiConfig>;
};
