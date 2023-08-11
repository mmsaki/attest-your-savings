/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			screens: {
				'4xl': { max: '1719px' },
				'2xl': { max: '1419px' },
				xl: { max: '1259px' },
				xls: { max: '1179px' },
				lg: { max: '1023px' },
				md: { max: '767px' },
				sm: { max: '480px' },
			},
			zIndex: {
				1: '1',
				2: '2',
				3: '3',
				4: '4',
				5: '5',
			},
			borderRadius: {
				1: '0.0635rem',
			},
			colors: {
				background: '#f4f4f0',
				n: {
					1: '#000000',
					2: '#161616',
					3: '#5f646d',
					4: '#e7e8e9',
				},
			},
		},
	},
	plugins: [],
};
