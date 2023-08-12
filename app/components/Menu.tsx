'use client';

import React from 'react';
import Icon from './Icon';
import { mobileNavigation } from '@/constants/navigation';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type MenuProps = {};

const Menu = ({}: MenuProps) => {
	const pathname = usePathname();
	return (
		<div>
			{mobileNavigation.map((link: any, index: number) =>
				link.url ? (
					<Link
						className='fixed left-0 bottom-0 right-0 z-0 justify-between items-center px-3 bg-background border-t border-n-1 md:flex dark:bg-n-2 dark:border-white hidden'
						href={link.url}
						key={index}
					>
						<Icon
							className={`icon-22 transition-colors dark:fill-white ${
								pathname === link.url && '!fill - purple - 400'
							}`}
							name={link.icon}
						/>
					</Link>
				) : (
					<button
						className='flex justify-center items-center w-12 h-18'
						key={index}
						type='button'
					>
						<Icon
							className={`dark:bg-slate-50 transition-colors icon-22 ${
								pathname == link.url ||
								(pathname.startsWith(link.url) ? '!fill-purple-400' : '')
							}`}
							name={link.icon}
						/>
					</button>
				)
			)}
		</div>
	);
};

export default Menu;
