(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCVersionsAction = global.WKCVersionsAction || {})));
}(this, (function (exports) { 'use strict';	

	const WKCVersionsMetal = typeof require === 'undefined' ? window.WKCVersionsMetal : require('./metal.js');
	const d3Package = typeof require === 'undefined' ? window.d3 : require('d3');

	//_ WKCVersionsActionCreate

	const ULIDPackage = typeof require === 'undefined' ? window.ULID : require('ulid');

	exports.WKCVersionsActionCreate = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		return await WKCVersionsMetal.WKCVersionsMetalWrite(storageClient, Object.assign(inputData, {
			WKCVersionID: ULIDPackage.ulid(),
		}));
	};

//_ WKCVersionsActionQuery

exports.WKCVersionsActionQuery = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	return Promise.resolve(Object.values(await WKCVersionsMetal.WKCVersionsMetalList(storageClient)).sort(function (a, b) {
		return d3Package.descending(a.WKCVersionID, b.WKCVersionID)
	}).filter(function(e) {
		if (!Object.keys(inputData).length) {
			return true;
		}

		if (Object.keys(inputData).filter(function (key) {
			return e[key].match(inputData[key]);
		}).length) {
			return true;
		}

		return false;
	}));
};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
