import * as WKCSettingsModel from './model.js';

export const WKCSettingsMetalWrite = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	let errors = WKCSettingsModel.WKCSettingModelErrorsFor(inputData);
	if (errors) {
		return Promise.resolve({
			KVCErrors: errors,
		});
	}

	return await storageClient.wikiavec.kvc_settings.writeObject(inputData.WKCSettingKey, inputData);
};

export const WKCSettingsMetalRead = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.kvc_settings.readObject(inputData);
};

export const WKCSettingsMetalList = async function(storageClient) {
	return await storageClient.wikiavec.kvc_settings.listObjects();
};

export const WKCSettingsMetalDelete = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.kvc_settings.deleteObject(inputData);
};
