(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCSettingsMetal = global.WKCSettingsMetal || {})));
}(this, (function (exports) { 'use strict';

	const WKCSettingsModel = typeof require === 'undefined' ? window.WKCSettingsModel : require('./model.js');

	//_ WKCSettingsMetalWrite

	exports.WKCSettingsMetalWrite = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputNotValid'));
		}

		let errors = WKCSettingsModel.WKCSettingsModelErrorsFor(inputData);
		if (errors) {
			return Promise.resolve({
				WKCErrors: errors,
			});
		}

		return await storageClient.wkc_settings.writeObject(inputData.WKCSettingKey, inputData);
	};

	//_ WKCSettingsMetalRead

	exports.WKCSettingsMetalRead = async function(storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('WKCErrorInputNotValid'));
		}

		return await storageClient.wkc_settings.readObject(inputData);
	};

	//_ WKCSettingsMetalList

	exports.WKCSettingsMetalList = async function(storageClient) {
		return await storageClient.wkc_settings.listObjects();
	};

	//_ WKCSettingsMetalDelete

	exports.WKCSettingsMetalDelete = async function(storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('WKCErrorInputNotValid'));
		}

		return await storageClient.wkc_settings.deleteObject(inputData);
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
