(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCVersionsMetal = global.WKCVersionsMetal || {})));
}(this, (function (exports) { 'use strict';	

	const WKCVersionsModel = typeof require === 'undefined' ? window.WKCVersionsModel : require('./model.js');

	//_ WKCVersionsMetalWrite

	exports.WKCVersionsMetalWrite = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		let errors = WKCVersionsModel.WKCVersionsModelErrorsFor(inputData);
		if (errors) {
			return Promise.resolve({
				WKCErrors: errors,
			});
		}

		return await storageClient.wkc_versions.writeObject(inputData.WKCVersionID, inputData);
	};

	//_ WKCVersionsMetalRead

	exports.WKCVersionsMetalRead = async function(storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		return WKCVersionsModel.WKCVersionsModelPostJSONParse(await storageClient.wkc_versions.readObject(inputData));
	};

	//_ WKCVersionsMetalList

	exports.WKCVersionsMetalList = async function(storageClient) {
		let outputData = await storageClient.wkc_versions.listObjects();

		for (let key in outputData) {
			WKCVersionsModel.WKCVersionsModelPostJSONParse(outputData[key]);
		}
		
		return outputData;
	};

	//_ WKCVersionsMetalDelete

	exports.WKCVersionsMetalDelete = async function(storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		return await storageClient.wkc_versions.deleteObject(inputData);
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
