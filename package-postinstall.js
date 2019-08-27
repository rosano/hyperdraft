//# ROCOHotfixULIDForBrowserTesting

(function ROCOHotfixULIDForBrowserTesting() {
	if (process.env.NODE_ENV === 'production') {
		return;
	}

	let filePath = './node_modules/ulid/dist/index.esm.js';
	require('fs').writeFileSync(filePath, require('fs')
		.readFileSync(filePath, 'utf8')
		.replace(
			'console.error("secure crypto unusable, falling back to insecure Math.random()!");',
			'// console.error("secure crypto unusable, falling back to insecure Math.random()!");')
		.replace(
			'var ulid = factory();',
			'// var ulid = factory();')
		.replace(
			'export { replaceCharAt, incrementBase32, randomChar, encodeTime, encodeRandom, decodeTime, detectPrng, factory, monotonicFactory, ulid };',
			'export { replaceCharAt, incrementBase32, randomChar, encodeTime, encodeRandom, decodeTime, detectPrng, factory, monotonicFactory };')
	);
})();

//# OLSKPostinstallExternalAssets

(function OLSKPostinstallExternalAssets() {
	const OLSKAssets = require('./node_modules/OLSKApp/modules/OLSKAssets/main.js');
	const pathPackage = require('path');

	OLSKAssets.OLSKAssetsCopyAssetsFromTo([
		'blueimp-md5',
		'codemirror',
		'd3',
		'file-saver',
		'identicon.js',
		'ispinner.css',
		'jszip',
		'launchlet',
		'moment',
		'normalize.css',
		'OLSKInternational',
		'OLSKLayout',
		'OLSKRouting',
		'OLSKServiceWorker',
		'OLSKString',
		'OLSKThrottle',
		'OLSKType',
		'remotestorage-widget',
		'remotestoragejs',
		'showdown',
		'turndown',
		'ulid',
		'url-parse',

		// pass tests
		'OLSKInputWrapper',
	].concat([
	]), pathPackage.join(__dirname, 'node_modules'), pathPackage.join(__dirname, 'os-app/_shared/__external'));
})();

//# OLSKPostinstallRollup

(function OLSKPostinstallRollup() {
	if (process.env.NODE_ENV !== 'production') {
		return;
	}

	require('child_process').execSync('npm run svelte-build');
})();

