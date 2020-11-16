(function OLSKPostinstallHotfix() {
	Object.entries(require('OLSKHotfix').OLSKHotfixPatches(process.env.NODE_ENV)).forEach(function ([path, patches]) {
		if (!require('fs').existsSync(path)) {
			return;
		}
		
		Object.entries(patches).forEach(function ([search, replace]) {
			require('fs').writeFileSync(path, require('OLSKString').OLSKStringPatch(
				require('fs').readFileSync(path, 'utf8'), search, replace));
		});
	});
})();

(function OLSKPostinstallExternalAssets() {
	require('./node_modules/OLSKExpress/modules/OLSKAssets/main.js').OLSKAssetsCopyAssetsFromTo([
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
	], require('path').join(__dirname, 'node_modules'), require('path').join(__dirname, 'os-app/_shared/__external'));
})();
