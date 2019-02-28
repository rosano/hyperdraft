(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCSettingsAction = global.WKCSettingsAction || {})));
}(this, (function (exports) { 'use strict';	

	const WKCSettingsMetal = typeof require === 'undefined' ? window.WKCSettingsMetal : require('./metal.js');

	//_ _WKCSettingsActionSet

	exports._WKCSettingsActionSet = async function(storageClient, param1, param2) {
		if (typeof param1 !== 'string') {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		if (typeof param2 === 'undefined') {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		let outputData = (await WKCSettingsMetal.WKCSettingsMetalWrite(storageClient, {
			WKCSettingKey: param1,
			WKCSettingValue: param2,
		}));

		return Promise.resolve(true);
	};

	//_ _WKCSettingsActionGet

	exports._WKCSettingsActionGet = async function(storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		let outputData = await WKCSettingsMetal.WKCSettingsMetalRead(storageClient, inputData);

		return Promise.resolve(outputData ? outputData.WKCSettingValue : undefined);
	};

	//_ WKCSettingsActionProperty

	exports.WKCSettingsActionProperty = async function(storageClient, param1, param2) {
		if (typeof param2 === 'undefined') {
			return await exports._WKCSettingsActionGet(storageClient, param1);
		}

		return await exports._WKCSettingsActionSet(storageClient, param1, param2);
	};

	//_ WKCSettingsActionDelete

	exports.WKCSettingsActionDelete = async function(storageClient, inputData) {
		return await WKCSettingsMetal.WKCSettingsMetalDelete(storageClient, inputData);
	};

	//_ WKCSettingsActionQuery

	exports.WKCSettingsActionQuery = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		return Promise.resolve(Object.values(await WKCSettingsMetal.WKCSettingsMetalList(storageClient)).filter(function(e) {
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
