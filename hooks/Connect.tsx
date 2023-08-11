'use client';

import React from 'react';
import { useAccount, useConnect } from 'wagmi';

const Connect = () => {
	const {
		connector: activeConnector,
		isConnected,
		isReconnecting,
		isConnecting,
	} = useAccount();
	const {
		connect,
		connectors,
		error: connectError,
		isLoading: connectLoading,
		pendingConnector,
	} = useConnect();
	return (
		<>
			{isConnected && <div>Connected to {activeConnector?.name}</div>}
			{connectors.map((connector) => (
				<button
					disabled={!connector.ready}
					key={connector.id}
					onClick={() => connect({ connector })}
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
