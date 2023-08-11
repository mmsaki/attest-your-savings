'use client';

import React from 'react';
import { useToken, useAccount } from 'wagmi';

type TokenProps = {
	address: any;
	chainId?: number;
};

const UseToken = ({ address, chainId }: TokenProps) => {
	const { isConnected } = useAccount();
	const { data, isError, isLoading } = useToken({
		address: address,
		chainId: chainId,
		formatUnits: 'ether',
		scopeKey: 'wagmi',
		suspense: true,
		onError(error) {
			console.error('Error ->', error);
		},
		onSuccess(data) {
			console.log('Success ->', data);
		},
		onSettled(data, error) {
			console.log('Settled ->', { data, error });
		},
	});
	if (isLoading) return <div>Fetching token data...</div>;
	if (isError) return <div>Error fetching token</div>;
	return (
		<>
			<div>Name: {data?.name}</div>
			<div>Symbol: {data?.symbol}</div>
			<div>Address: {data?.address}</div>
			<div>TotalSupply: {data?.totalSupply.formatted}</div>
		</>
	);
};

export default UseToken;
