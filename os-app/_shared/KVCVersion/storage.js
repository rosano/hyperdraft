import * as KVCVersionModel from './model.js';
import * as OLSKRemoteStoragePackage from 'OLSKRemoteStorage';
const OLSKRemoteStorage = OLSKRemoteStoragePackage.default || OLSKRemoteStoragePackage;

const kType = 'kvc_version';
const kCollection = 'kvc_versions';

const mod = {

	KVCVersionStoragePath (inputData) {
		return `${ kCollection }/${ inputData || '' }`;
	},

	KVCVersionStorageBuild (privateClient, publicClient, changeDelegate) {
		const OLSKRemoteStorageCollectionExports = {

			async KVCStorageList () {
				return privateClient.getAll(mod.KVCVersionStoragePath(), false);
			},

			async KVCStorageWrite (inputData) {
				await privateClient.storeObject(kType, mod.KVCVersionStoragePath(inputData.KVCVersionID), OLSKRemoteStorage.OLSKRemoteStoragePreJSONSchemaValidate(inputData));
				return OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(inputData);
			},

			KVCStorageRead (inputData) {
				return privateClient.getObject(mod.KVCVersionStoragePath(inputData));
			},
			
			KVCStorageDelete (inputData) {
				return privateClient.remove(mod.KVCVersionStoragePath(inputData));
			},
			
		};

		return {
			OLSKRemoteStorageCollectionName: kCollection,
			OLSKRemoteStorageCollectionType: kType,
			OLSKRemoteStorageCollectionModelErrors: Object.entries(KVCVersionModel.KVCVersionModelErrorsFor({}, {
				KVCOptionValidateIfNotPresent: true,
			})).map(function (e) {
				if (!Object.keys(KVCVersionModel.KVCVersionModelErrorsFor({})).includes(e[0])) {
					e[1].push('__RSOptional');
				}

				return e;
			}).reduce(function (coll, item) {
				coll[item[0]] = item[1];

				return coll;
			}, {}),
			OLSKRemoteStorageCollectionExports,
		};
	},

};

export default mod;
