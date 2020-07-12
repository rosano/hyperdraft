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

			async KVCStorageList () {
				return privateClient.getAll(mod.KVCVersionStorageCollectionPath(), false);
			},

			async KVCStorageWrite (inputData) {
				await privateClient.storeObject(mod.KVCVersionStorageCollectionType(), mod.KVCVersionStorageObjectPath(inputData), OLSKRemoteStorage.OLSKRemoteStoragePreJSONSchemaValidate(inputData));
				return OLSKRemoteStorage.OLSKRemoteStoragePostJSONParse(inputData);
			},

			KVCStorageRead (inputData) {
				return privateClient.getObject(mod.KVCVersionStorageObjectPath({
					KVCVersionID: inputData,
					KVCVersionNoteID: inputData,
					KVCVersionBody: '',
					KVCVersionDate: new Date(),
				}));
			},
			
			KVCStorageDelete (inputData) {
				return privateClient.remove(mod.KVCVersionStorageObjectPath({
					KVCVersionID: inputData,
					KVCVersionNoteID: inputData,
					KVCVersionBody: '',
					KVCVersionDate: new Date(),
				}));
			},
			
		};

		return {
			OLSKRemoteStorageCollectionName: mod.KVCVersionStorageCollectionName(),
			OLSKRemoteStorageCollectionType: mod.KVCVersionStorageCollectionType(),
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
