'use client';
import React from 'react';

import { useBlockNumber } from 'wagmi';

const UseBlockNumber = () => {
	const { data, isError, isLoading } = useBlockNumber({
		scopeKey: 'wagmi',
		// suspense: true,
		// watch: true,
		// onBlock(blockNumber) {
		// 	console.log('New Block: ', blockNumber);
		// },
		onSuccess(data) {
			console.log('Success ->', data);
		},
		onError(error) {
			console.error('Error ->', error);
		},
	});

	if (isLoading) return <div>Fetching block number...</div>;
	if (isError) return <div>Error fetching block number</div>;
	return <div>Block number: {data?.toString()}</div>;
};

export default UseBlockNumber;
