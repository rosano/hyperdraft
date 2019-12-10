import * as KVCSettingsModel from './model.js';

export const KVCSettingsMetalWrite = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	let errors = KVCSettingsModel.KVCSettingModelErrorsFor(inputData);
	if (errors) {
		return Promise.resolve({
			KVCErrors: errors,
		});
	}

	return await storageClient.wikiavec.kvc_settings.writeObject(inputData.KVCSettingKey, inputData);
};

export const KVCSettingsMetalRead = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.kvc_settings.readObject(inputData);
};

export const KVCSettingsMetalList = async function(storageClient) {
	return await storageClient.wikiavec.kvc_settings.listObjects();
};

export const KVCSettingsMetalDelete = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.kvc_settings.deleteObject(inputData);
};
