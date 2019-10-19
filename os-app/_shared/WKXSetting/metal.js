import * as WKXSettingsModel from './model.js';

export const WKXSettingsMetalWrite = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	let errors = WKXSettingsModel.WKXSettingModelErrorsFor(inputData);
	if (errors) {
		return Promise.resolve({
			WKCErrors: errors,
		});
	}

	return await storageClient.wikiavec.wkc_settings.writeObject(inputData.WKXSettingKey, inputData);
};

export const WKXSettingsMetalRead = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.wkc_settings.readObject(inputData);
};

export const WKXSettingsMetalList = async function(storageClient) {
	return await storageClient.wikiavec.wkc_settings.listObjects();
};

export const WKXSettingsMetalDelete = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await storageClient.wikiavec.wkc_settings.deleteObject(inputData);
};
