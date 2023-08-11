export const navigation = [
	{
		title: 'Dashboard',
		icons: 'dashboard',
		counter: 16,
		url: '/dashboard',
	},
	{
		title: 'Projects',
		icons: 'projects',
		url: '/projects',
	},
	{
		title: 'Tasks',
		icon: 'tasks',
		url: '/projects/tasks',
	},
	{
		title: 'Layers',
		icons: 'layers',
		url: '/projects/layers',
	},
	{
		title: 'Calendar',
		icon: 'calendar',
		url: '/projects/calendar',
	},
	{
		title: 'Inbox',
		icon: 'email',
		url: '/inbox/mail-list',
	},
];

export const mobileNavigation = [
	{
		icon: 'dashboard',
		url: '/dashboard',
	},
	{
		icon: 'projects',
		url: 'projects',
	},
	{
		icon: 'tasks',
		url: '/projects/tasks',
	},
	{
		icon: 'layers',
		url: 'projects/layers',
	},
	{
		icon: 'dots',
		url: '/modal',
		onclick: () => console.log('Click on dots'),
	},
];
