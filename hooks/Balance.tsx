import React from 'react';
import { useBalance, useAccount } from 'wagmi';

const Balance = () => {
	const { address } = useAccount();

	const { data, isError, isLoading } = useBalance({
		address: address,
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
		<div>
			Balance: {data?.formatted} {data?.symbol}
		</div>
	);
};

export default Balance;
