'use client';

import React from 'react';
import { useBalance } from 'wagmi';

type UseBalanceProps = {
	address?: any;
	token?: any;
};

const UseBalance = ({ address, token }: UseBalanceProps) => {
	const { data, isError, isLoading } = useBalance({
		address: address,
		token: token,
		watch: true,
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
		<div className='text-red-100'>
			Balance: {data?.formatted} {data?.symbol}
		</div>
	);
};

export default UseBalance;
