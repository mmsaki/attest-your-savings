'use client';

import React from 'react';
import { useNetwork, useSwitchNetwork } from 'wagmi';

const UseSwitchNetwork = () => {
	const { chain } = useNetwork();
	const { chains, error, isLoading, pendingChainId, switchNetwork, status } =
		useSwitchNetwork({
			onError(error) {
				console.error('Error ->', error);
			},
			onMutate(args) {
				console.log('Changing network ->', args);
			},
			onSettled(data, error) {
				console.log('Settled ->', { data, error });
			},
			onSuccess(data) {
				console.log('Success ->', data);
			},
		});

	return (
		<>
			{chain && (
				<div>
					Connected to {chain.name}
					{' id: ' + chain.id}
				</div>
			)}
			{chains.map((x) => (
				<button
					disabled={!switchNetwork || x.id === chain?.id}
					key={x.id}
					onClick={() => switchNetwork?.(x.id)}
				>
					{x.name}
					{isLoading && pendingChainId === x.id && ' (switching)'}
				</button>
			))}
			<div>{error && (error?.message ?? 'Failed to switch')}</div>
		</>
	);
};

export default UseSwitchNetwork;
