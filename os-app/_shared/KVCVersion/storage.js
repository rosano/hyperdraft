import * as KVCVersionModel from './model.js';
import * as OLSKRemoteStorage from 'OLSKRemoteStorage';

const kType = 'kvc_version';
const kCollection = 'kvc_versions';

const mod = {

	KVCVersionStoragePath (inputData) {
		return `${ kCollection }/${ inputData || '' }`;
	},

	KVCVersionStorage  (privateClient, publicClient, changeDelegate) {
		return {
			KVCStorageCollection: kCollection,
			KVCStorageType: kType,
			KVCStorageModelErrors: KVCVersionModel.KVCVersionModelErrorsFor({}),
			KVCStorageExports: {
				KVCStorageList () {
					return privateClient.getAll(mod.KVCVersionStoragePath(), false);
				},
				async KVCStorageWrite (param1, param2) {
					await privateClient.storeObject(kType, mod.KVCVersionStoragePath(param1), KVCVersionModel.KVCVersionModelPreJSONSchemaValidate(param2));
					return KVCVersionModel.KVCVersionModelPostJSONParse(param2);
				},
				KVCStorageRead (inputData) {
					return privateClient.getObject(mod.KVCVersionStoragePath(inputData));
				},
				KVCStorageDelete (inputData) {
					return privateClient.remove(mod.KVCVersionStoragePath(inputData));
				},
			},
		};
	},

};

export default mod;
