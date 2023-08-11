'use client';

import React from 'react';
import { useBalance } from 'wagmi';

type UseBalanceProps = {
	address?: any;
	token?: any;
};

const UseBalance = ({ address, token }: UseBalanceProps) => {
	const { data, isError, isLoading, refetch } = useBalance({
		address: address,
		token: token,
		// watch: true,
		scopeKey: 'wagmi',
		suspense: true,
		onError(error) {
			console.log('Error ->', error);
		},
		onSettled(data, error) {
			console.log('Settled ->', { data, error });
		},
		onSuccess(data) {
			console.log('Success', data);
		},
	});
	if (isLoading) return <div>Fetching balance...</div>;
	if (isError) return <div>Error fetching balance</div>;
	return (
		<div className='flex flex-row'>
			<div>
				Balance: {data?.formatted} {data?.symbol}
			</div>
			<button className='px-2' type='button' onClick={() => refetch()}>
				refetch
			</button>
		</div>
	);
};

export default UseBalance;
