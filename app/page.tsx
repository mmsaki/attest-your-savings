'use client';
import { useAccount } from 'wagmi';
import UseConnect from '@/app/hooks/UseConnect';
import UseSwitchNetwork from '@/app/hooks/UseSwitchNetwork';
import UseBalance from '@/app/hooks/UseBalance';
import UseToken from '@/app/hooks/UseToken';
import UseBlockNumber from '@/app/hooks/UseBlockNumber';

export default function Home() {
	const { address, isConnected } = useAccount();
	return (
		<main>
			<div className='flex flex-col'>
				<UseConnect />
			</div>
			<div className='flex flex-col'>
				<UseSwitchNetwork />
			</div>
			{isConnected && (
				<>
					<div className=''>
						<UseBalance address={address} />
						<UseBalance
							address={address}
							token={'0x3393C3b8DD9e44657358e6fE092D9a3110181E78'}
						/>
					</div>
					<h1 className='text-2xl'>Cross Chain Saving Account!</h1>
					<UseToken address={'0x3393C3b8DD9e44657358e6fE092D9a3110181E78'} />
					<UseBlockNumber />
				</>
			)}
		</main>
	);
}
