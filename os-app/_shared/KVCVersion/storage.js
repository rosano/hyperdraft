import * as KVCVersionModel from './model.js';
import * as OLSKRemoteStorage from 'OLSKRemoteStorage';

const kType = 'kvc_version';
const kCollection = 'kvc_versions';

export const KVCVersionStoragePath = function(inputData) {
	return `${ kCollection }/${ inputData || '' }`;
};

export const KVCVersionStorage = function (privateClient, publicClient, changeDelegate) {
	return {
		KVCStorageCollection: kCollection,
		KVCStorageType: kType,
		KVCStorageModelErrors: KVCVersionModel.KVCVersionModelErrorsFor({}),
		KVCStorageExports: {
			KVCStorageList () {
				return privateClient.getAll(KVCVersionStoragePath(), false);
			},
			async writeObject (param1, param2) {
				await privateClient.storeObject(kType, KVCVersionStoragePath(param1), KVCVersionModel.KVCVersionModelPreJSONSchemaValidate(param2));
				return KVCVersionModel.KVCVersionModelPostJSONParse(param2);
			},
			readObject (inputData) {
				return privateClient.getObject(KVCVersionStoragePath(inputData));
			},
			KVCStorageDelete (inputData) {
				return privateClient.remove(KVCVersionStoragePath(inputData));
			},
		},
	};
};
