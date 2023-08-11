'use client';
import Connect from '@/hooks/Connect';
import SwitchNetwork from '@/hooks/SwitchNetwork';
import Balance from '@/hooks/Balance';

export default function Home() {
	return (
		<main>
			<Connect />
			<SwitchNetwork />
			<Balance />
			<h1>Hello World!</h1>
		</main>
	);
}
