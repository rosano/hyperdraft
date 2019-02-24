(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCStorageClient = global.WKCStorageClient || {})));
}(this, (function (exports) { 'use strict';

	const RemoteStorage = typeof require === 'undefined' ? window.RemoteStorage : require('remotestoragejs');

	exports.WKCStorageClientForChangeDelegateMap = function (changeDelegateMap) {
		let modules = Object.entries(changeDelegateMap).map(function ([key, val]) {
			return (typeof require === 'undefined' ? window[`RSModuleProtocol_${ key }`] : require(`../rs-modules/${ key }/rs-module.js`)).RSModuleProtocolModuleForChangeDelegate(val);
		});

		let remoteStorage = new RemoteStorage({
			modules: modules,
		});

		let outputData = {};

		outputData.remoteStorage = remoteStorage;

		modules.forEach(function (e) {
			remoteStorage.access.claim(e.name, 'rw');

			remoteStorage.caching.enable(`/${e.name}/`);

			outputData[e.name] = remoteStorage[e.name];
		});

		return outputData;
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));