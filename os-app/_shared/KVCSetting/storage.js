import KVCSettingModel from './model.js';

import * as OLSKRemoteStoragePackage from 'OLSKRemoteStorage';
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;

const mod = {

	KVCSettingStorageCollectionName () {
		return 'kvc_settings';
	},

	KVCSettingStorageCollectionType () {
		return 'kvc_setting';
	},

	KVCSettingStorageCollectionPath () {
		return mod.KVCSettingStorageCollectionName() + '/';
	},

	KVCSettingStorageObjectPath (inputData) {
		if (KVCSettingModel.KVCSettingModelErrorsFor(inputData)) {
			throw new Error('KVCErrorInputNotValid');
		}

		return mod.KVCSettingStorageCollectionPath() + inputData.KVCSettingKey;
	},

	KVCSettingStorageBuild (privateClient, publicClient, changeDelegate) {
		const OLSKRemoteStorageCollectionExports = {

			async _KVCSettingStorageWrite (inputData) {
				if (typeof inputData !== 'object' || inputData === null) {
					return Promise.reject(new Error('KVCErrorInputNotValid'));
				}

				let errors = KVCSettingModel.KVCSettingModelErrorsFor(inputData);
				if (errors) {
					return Promise.resolve({
						KVCErrors: errors,
					});
				}

				try {
					return OLSKRemoteStorage.OLSKRemoteStorageWriteObject(privateClient, mod.KVCSettingStorageObjectPath(inputData), inputData);
				} catch (e) {
					return Promise.reject(e);
				}
			},

			_KVCSettingStorageRead (inputData) {
				if (typeof inputData !== 'string') {
					throw new Error('KVCErrorInputNotValid');
				}

				return privateClient.getObject(mod.KVCSettingStorageObjectPath({
					KVCSettingKey: inputData,
					KVCSettingValue: '',
				}), false);
			},

			_KVCSettingStorageList () {
				return privateClient.getAll(mod.KVCSettingStorageCollectionPath(), false);
			},

			_KVCSettingStorageDelete (inputData) {
				if (typeof inputData !== 'string') {
					throw new Error('KVCErrorInputNotValid');
				}

				return privateClient.remove(mod.KVCSettingStorageObjectPath({
					KVCSettingKey: inputData,
					KVCSettingValue: '',
				}));
			},
			
		};

		return {
			OLSKRemoteStorageCollectionName: mod.KVCSettingStorageCollectionName(),
			OLSKRemoteStorageCollectionExports,
		};
	},

	KVCSettingStorageWrite (storageClient, inputData) {
		return storageClient.wikiavec[mod.KVCSettingStorageCollectionName()]._KVCSettingStorageWrite(inputData);
	},

	KVCSettingStorageRead (storageClient, inputData) {
		return storageClient.wikiavec[mod.KVCSettingStorageCollectionName()]._KVCSettingStorageRead(inputData);
	},

	KVCSettingStorageList (storageClient) {
		return storageClient.wikiavec[mod.KVCSettingStorageCollectionName()]._KVCSettingStorageList();
	},

	KVCSettingStorageDelete (storageClient, inputData) {
		return storageClient.wikiavec[mod.KVCSettingStorageCollectionName()]._KVCSettingStorageDelete(inputData);
	},

};

export default mod;
