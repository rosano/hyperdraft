import * as WKCSettingsModel from './model.js';

export const WKCSettingsMetalWrite = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	let errors = WKCSettingsModel.WKCSettingModelErrorsFor(inputData);
	if (errors) {
		return Promise.resolve({
			WKCErrors: errors,
		});
	}

	return await storageClient.wikiavec.wkc_settings.writeObject(inputData.WKCSettingKey, inputData);
};

export const WKCSettingsMetalRead = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.wkc_settings.readObject(inputData);
};

export const WKCSettingsMetalList = async function(storageClient) {
	return await storageClient.wikiavec.wkc_settings.listObjects();
};

export const WKCSettingsMetalDelete = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.wkc_settings.deleteObject(inputData);
};
