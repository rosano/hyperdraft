import * as KVCSettingsModel from './model.js';

const mod = {

	async KVCSettingsMetalWrite (storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		let errors = KVCSettingsModel.KVCSettingModelErrorsFor(inputData);
		if (errors) {
			return Promise.resolve({
				KVCErrors: errors,
			});
		}

		return await storageClient.wikiavec.kvc_settings.KVCStorageWrite(inputData.KVCSettingKey, inputData);
	},

	async KVCSettingsMetalRead (storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return await storageClient.wikiavec.kvc_settings.readObject(inputData);
	},

	async KVCSettingsMetalList (storageClient) {
		return await storageClient.wikiavec.kvc_settings.KVCStorageList();
	},

	async KVCSettingsMetalDelete (storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return await storageClient.wikiavec.kvc_settings.KVCStorageDelete(inputData);
	},
	
};
	
export default mod;
