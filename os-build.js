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
		'jszip',
		'file-saver',
	], pathPackage.join(__dirname, 'node_modules'), pathPackage.join(__dirname, 'os-app/_shared/_external'));
})();

//# OLSKStartRollup

(function OLSKStartRollup() {
	const executeCommand = require('child_process').exec;

	const globPackage = require('glob');
	const pathPackage = require('path');

	globPackage.sync(['os-app/**/rollup-config.js'], {
		matchBase: true,
	}).filter(function (e) {
		return !e.match(/node_modules|_external/ig);
	}).forEach(function (e) {
		executeCommand(`ROLLUP_PATH='${ e }' npm run svelte-build-manual`);
	});
})();

