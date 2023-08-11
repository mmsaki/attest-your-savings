'use client';

import React from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

const Connect = () => {
	const {
		connector: activeConnector,
		isConnected,
		isReconnecting,
		isConnecting,
	} = useAccount({
		onConnect({ address, connector, isReconnected }) {
			console.log('connected', { address, connector, isReconnected });
		},
		onDisconnect() {
			console.log('Disconnected');
		},
	});
	const {
		connect,
		connectors,
		error: connectError,
		isLoading: connectLoading,
		pendingConnector,
	} = useConnect({
		onError(error) {
			console.error('Error ->', error);
		},
		onMutate(connector) {
			console.log('Before connect ->', connector);
		},
		onSettled(data, error) {
			console.log('Settled ->', { data, error });
		},
		onSuccess(data) {
			console.log('Connect ->', data);
		},
	});

	const { disconnect } = useDisconnect({
		onError(error) {
			console.log('Error ->', error);
		},
		onMutate() {
			console.log('Intiating ->');
		},
		onSettled(data, error) {
			console.log('Settled ->', { data, error });
		},
		onSuccess(data) {
			console.log('Disconnected ->', data);
		},
	});
	return (
		<>
			{isConnected && (
				<div>
					Connected to {activeConnector?.name}{' '}
					<button onClick={() => disconnect()}>Disconnect</button>
				</div>
			)}
			{connectors.map((connector) => (
				<button
					disabled={!connector.ready}
					key={connector.id}
					onClick={() => connect({ connector })}
					type='button'
				>
					{connector.name}
					{connectLoading &&
						pendingConnector?.id === connector.id &&
						' (connecting)'}
				</button>
			))}
			{connectError && <div>{connectError.message}</div>}
		</>
	);
};

export default Connect;
