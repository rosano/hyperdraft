(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCVersionsAction = global.WKCVersionsAction || {})));
}(this, (function (exports) { 'use strict';	

	const WKCVersionsMetal = typeof require === 'undefined' ? window.WKCVersionsMetal : require('./metal.js');

	//_ WKCVersionsActionCreate

	const ULIDPackage = typeof require === 'undefined' ? window.ULID : require('ulid');

	exports.WKCVersionsActionCreate = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		return await WKCVersionsMetal.WKCVersionsMetalWrite(storageClient, Object.assign(inputData, {
			WKCVersionID: ULIDPackage.ulid(),
			WKCVersionDate: new Date(),
		}));
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
