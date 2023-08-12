'use client';
import { useAccount, useNetwork } from 'wagmi';
import UseConnect from '@/app/hooks/UseConnect';
import UseSwitchNetwork from '@/app/hooks/UseSwitchNetwork';
import UseBalance from '@/app/hooks/UseBalance';
import UseToken from '@/app/hooks/UseToken';
import UseBlockNumber from '@/app/hooks/UseBlockNumber';
import { Suspense } from 'react';

export default function Home() {
	const { address, isConnected } = useAccount();
	const { chain } = useNetwork();
	return (
		<main>
			<div className='flex flex-col'>
				<UseConnect />
			</div>
			<div className='flex flex-col'>
				<UseSwitchNetwork />
			</div>
			{isConnected && chain?.network === 'sepolia' && (
				<>
					<div className=''>
						<UseBalance address={address} />
						<UseBalance
							address={address}
							token={'0x3393C3b8DD9e44657358e6fE092D9a3110181E78'}
						/>
					</div>
					<h1 className='text-2xl'>Cross Chain Saving Account!</h1>
					<Suspense fallback={<p>Loading saving details...</p>}>
						<UseToken address={'0x3393C3b8DD9e44657358e6fE092D9a3110181E78'} />
					</Suspense>
					<Suspense fallback={<p>Loading block number...</p>}>
						<UseBlockNumber />
					</Suspense>
				</>
			)}
		</main>
	);
}
