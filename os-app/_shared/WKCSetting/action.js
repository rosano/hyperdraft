import * as WKCSettingsMetal from './metal.js';

export const _WKCSettingsActionSet = async function(storageClient, param1, param2) {
	if (typeof param1 !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	if (typeof param2 === 'undefined') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	let outputData = (await WKCSettingsMetal.WKCSettingsMetalWrite(storageClient, {
		WKCSettingKey: param1,
		WKCSettingValue: param2,
	}));

	return Promise.resolve(true);
};

export const _WKCSettingsActionGet = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	let outputData = await WKCSettingsMetal.WKCSettingsMetalRead(storageClient, inputData);

	return Promise.resolve(outputData ? outputData.WKCSettingValue : undefined);
};

export const WKCSettingsActionProperty = async function(storageClient, param1, param2) {
	if (typeof param2 === 'undefined') {
		return await _WKCSettingsActionGet(storageClient, param1);
	}

	return await _WKCSettingsActionSet(storageClient, param1, param2);
};

export const WKCSettingsActionDelete = async function(storageClient, inputData) {
	return await WKCSettingsMetal.WKCSettingsMetalDelete(storageClient, inputData);
};

export const WKCSettingsActionQuery = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
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
