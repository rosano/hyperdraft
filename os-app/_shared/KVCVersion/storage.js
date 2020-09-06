import KVCVersionModel from './model.js';
import * as OLSKRemoteStoragePackage from 'OLSKRemoteStorage';
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;

const mod = {

	KVCVersionStorageCollectionName () {
		return 'kvc_versions';
	},

	KVCVersionStorageCollectionType () {
		return 'kvc_version';
	},

	KVCVersionStorageCollectionPath () {
		return mod.KVCVersionStorageCollectionName() + '/';
	},

	KVCVersionStorageObjectPath (inputData) {
		if (KVCVersionModel.KVCVersionModelErrorsFor(inputData)) {
			throw new Error('KVCErrorInputNotValid');
		}

		return mod.KVCVersionStorageCollectionPath() + inputData.KVCVersionID;
	},

	KVCVersionStorageBuild (privateClient, publicClient, changeDelegate) {
		const OLSKRemoteStorageCollectionExports = {

			async _KVCVersionStorageWrite (inputData) {
				if (typeof inputData !== 'object' || inputData === null) {
					return Promise.reject(new Error('KVCErrorInputNotValid'));
				}

				let errors = KVCVersionModel.KVCVersionModelErrorsFor(inputData);
				if (errors) {
					return Promise.resolve({
						KVCErrors: errors,
					});
				}

				try {
					return OLSKRemoteStorage.OLSKRemoteStorageWriteObject(privateClient, mod.KVCVersionStorageObjectPath(inputData), inputData);
				} catch (e) {
					return Promise.reject(e);
				}
			},

			async _KVCVersionStorageList () {
				let outputData = await privateClient.getAll(mod.KVCVersionStorageCollectionPath(), false);

				for (let key in outputData) {
					OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(outputData[key]);
				}
				
				return outputData;
			},
			
			_KVCVersionStorageDelete (inputData) {
				if (typeof inputData !== 'string') {
					throw new Error('KVCErrorInputNotValid');
				}
				
				return privateClient.remove(mod.KVCVersionStorageCollectionPath() + inputData);
			},
			
		};

		return {
			OLSKRemoteStorageCollectionName: mod.KVCVersionStorageCollectionName(),
			OLSKRemoteStorageCollectionExports,
		};
	},

	KVCVersionStorageWrite (storageClient, inputData) {
		return storageClient.wikiavec[mod.KVCVersionStorageCollectionName()]._KVCVersionStorageWrite(inputData);
	},

	KVCVersionStorageList (storageClient) {
		return storageClient.wikiavec[mod.KVCVersionStorageCollectionName()]._KVCVersionStorageList();
	},

	KVCVersionStorageDelete (storageClient, inputData) {
		return storageClient.wikiavec[mod.KVCVersionStorageCollectionName()]._KVCVersionStorageDelete(inputData);
	},

};

export default mod;
