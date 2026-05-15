
module.exports = {
	apps: [
		{
			name: 'frontend',
			script: 'node_modules/next/dist/bin/next',
			cwd: 'modules/frontend',
			args: `start`,
		},
		{
			name: 'database',
			script: 'dist/index.js',
			cwd: 'modules/database',
		},
		{
			name: 'authentication',
			script: 'dist/index.js',
			cwd: 'modules/authentication',
		},
		{
			name: 'checkout',
			script: 'dist/index.js',
			cwd: 'modules/checkout',
		},
	],
};
