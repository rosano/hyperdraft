//# OLSKStartExternalAssets

(function OLSKStartExternalAssets() {
	const OLSKExternalAssets = require('./node_modules/OldSkool/modules/OLSKExternalAssets/main.js');
	const pathPackage = require('path');

	OLSKExternalAssets.OLSKExternalAssetsCopyAssetsFromTo([
		'normalize.css',
		'd3',
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
