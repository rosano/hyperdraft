//# OLSKStartExternalAssets

(function OLSKStartExternalAssets() {
	const OLSKAssets = require('./node_modules/OldSkool/modules/OLSKAssets/main.js');
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
	], pathPackage.join(__dirname, 'node_modules'), pathPackage.join(__dirname, 'os-app/_shared/_external'));
})();
