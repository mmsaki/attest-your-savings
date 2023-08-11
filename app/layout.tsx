import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Menu from '@/components/Menu';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Crosschain Savings Accounts',
	description: 'Save your crypto daily',
};

type LayoutProps = {
	background?: boolean;
	children: React.ReactNode;
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<Providers>
					<div className='relative pl-[18.75rem xl:pl-20 md:pl-0 md:pb-20'>
						<div>{children}</div>
					</div>
					<Menu />
				</Providers>
			</body>
		</html>
	);
}
