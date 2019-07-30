//# ROCOHotfixULIDForBrowserTesting

(function ROCOHotfixULIDForBrowserTesting() {
	if (process.env.NODE_ENV === 'production') {
		return;
	}

	let filePath = './node_modules/ulid/dist/index.esm.js';
	require('fs').writeFileSync(filePath, require('fs')
		.readFileSync(filePath, 'utf8')
		.replace(
			`console.error("secure crypto unusable, falling back to insecure Math.random()!");`,
			'// console.error("secure crypto unusable, falling back to insecure Math.random()!");')
		.replace(
			`var ulid = factory();`,
			`// var ulid = factory();`)
		.replace(
			`export { replaceCharAt, incrementBase32, randomChar, encodeTime, encodeRandom, decodeTime, detectPrng, factory, monotonicFactory, ulid };`,
			`// export { replaceCharAt, incrementBase32, randomChar, encodeTime, encodeRandom, decodeTime, detectPrng, factory, monotonicFactory, ulid };
export { replaceCharAt, incrementBase32, randomChar, encodeTime, encodeRandom, decodeTime, detectPrng, factory, monotonicFactory };`)
		)
})();

//# OLSKStartExternalAssets

(function OLSKStartExternalAssets() {
	const OLSKAssets = require('./node_modules/OLSKApp/modules/OLSKAssets/main.js');
	const pathPackage = require('path');

	OLSKAssets.OLSKAssetsCopyAssetsFromTo([
		'normalize.css',
		'd3',
		'remotestoragejs',
		'remotestorage-widget',
		'ulid',
		'OLSKInternational',
		'OLSKRouting',
		'OLSKType',
		'OLSKString',
		'OLSKThrottle',
		'ispinner.css',
		'identicon.js',
		'blueimp-md5',
		'turndown',
		'showdown',
		'moment',
		'url-parse',
		'codemirror',
		'jszip',
		'file-saver',
		'launchlet',
	], pathPackage.join(__dirname, 'node_modules'), pathPackage.join(__dirname, 'os-app/_shared/_external'));
})();

//# OLSKStartRollup

(function OLSKStartRollup() {
	if (process.env.NODE_ENV !== 'production') {
		return;
	}

	require('child_process').exec('npm run svelte-build');
})();

