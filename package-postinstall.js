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

(function OLSKPostinstallPatchRemoteStorageAuthRedirectURI() {
	let filePath = './node_modules/remotestoragejs/release/remotestorage.js';

	require('fs').writeFileSync(filePath, require('OLSKString').OLSKStringPatch(
		require('fs').readFileSync(filePath, 'utf8'),
		// 'options.redirectUri = globalContext.cordova ? config.cordovaRedirectUri : String(Authorize.getLocation());',
		'e.redirectUri=m.cordova?l.cordovaRedirectUri:String(h.getLocation())',
		// 'options.redirectUri = globalContext.cordova ? config.cordovaRedirectUri : String(config.OLSKPatchRemoteStorageAuthRedirectURI || Authorize.getLocation());'
		'e.redirectUri=m.cordova?l.cordovaRedirectUri:String(l.OLSKPatchRemoteStorageAuthRedirectURI || h.getLocation())'
	));
})();

(function ROCOHotfixLaunchletForSkipWait() {
	if (process.env.NODE_ENV === 'production') {
		return;
	}

	const filePath = './node_modules/launchlet/__compiled/launchlet.js';
	require('fs').writeFileSync(filePath, require('OLSKString').OLSKStringPatch(
		require('fs').readFileSync(filePath, 'utf8'),
		',100',
		',1',
	));
})();

(function OLSKPostinstallExternalAssets() {
	const OLSKAssets = require('./node_modules/OLSKExpress/modules/OLSKAssets/main.js');
	const pathPackage = require('path');

	OLSKAssets.OLSKAssetsCopyAssetsFromTo([
		'codemirror',
		'file-saver',
		'jszip',
		'launchlet',
		'normalize.css',
		'OLSKInternational',
		'OLSKLanguageSwitcher',
		'OLSKLayout',
		'OLSKRootLink',
		'OLSKRouting',
		'OLSKServiceWorker',
		'OLSKStorageWidget',
		'OLSKUIAssets',
		'ROCORootLink',
		'showdown',
		'turndown',
		'url-parse',
	].concat([
	]), pathPackage.join(__dirname, 'node_modules'), pathPackage.join(__dirname, 'os-app/_shared/__external'));
})();

