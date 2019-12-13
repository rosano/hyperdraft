import * as KVCSettingsMetal from './metal.js';

export const _KVCSettingsActionSet = async function(storageClient, param1, param2) {
	if (typeof param1 !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	if (typeof param2 === 'undefined') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	let outputData = (await KVCSettingsMetal.KVCSettingsMetalWrite(storageClient, {
		KVCSettingKey: param1,
		KVCSettingValue: param2,
	}));

	return Promise.resolve(true);
};

export const _KVCSettingsActionGet = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	let outputData = await KVCSettingsMetal.KVCSettingsMetalRead(storageClient, inputData);

	return Promise.resolve(outputData ? outputData.KVCSettingValue : undefined);
};

export const KVCSettingsActionProperty = async function(storageClient, param1, param2) {
	if (typeof param2 === 'undefined') {
		return await _KVCSettingsActionGet(storageClient, param1);
	}

	return await _KVCSettingsActionSet(storageClient, param1, param2);
};

export const KVCSettingsActionDelete = async function(storageClient, inputData) {
	return await KVCSettingsMetal.KVCSettingsMetalDelete(storageClient, inputData);
};

export const KVCSettingsActionQuery = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return Promise.resolve(Object.values(await KVCSettingsMetal.KVCSettingsMetalList(storageClient)).filter(function(e) {
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