import * as WKXSettingsMetal from './metal.js';

export const _WKXSettingsActionSet = async function(storageClient, param1, param2) {
	if (typeof param1 !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	if (typeof param2 === 'undefined') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	let outputData = (await WKXSettingsMetal.WKXSettingsMetalWrite(storageClient, {
		WKXSettingKey: param1,
		WKXSettingValue: param2,
	}));

	return Promise.resolve(true);
};

export const _WKXSettingsActionGet = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	let outputData = await WKXSettingsMetal.WKXSettingsMetalRead(storageClient, inputData);

	return Promise.resolve(outputData ? outputData.WKXSettingValue : undefined);
};

export const WKXSettingsActionProperty = async function(storageClient, param1, param2) {
	if (typeof param2 === 'undefined') {
		return await _WKXSettingsActionGet(storageClient, param1);
	}

	return await _WKXSettingsActionSet(storageClient, param1, param2);
};

export const WKXSettingsActionDelete = async function(storageClient, inputData) {
	return await WKXSettingsMetal.WKXSettingsMetalDelete(storageClient, inputData);
};

export const WKXSettingsActionQuery = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return Promise.resolve(Object.values(await WKXSettingsMetal.WKXSettingsMetalList(storageClient)).filter(function(e) {
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
