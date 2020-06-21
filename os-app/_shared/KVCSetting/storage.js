import KVCSettingModel from './model.js';

const kType = 'kvc_setting';
const kCollection = 'kvc_settings';

const mod = {

	KVCSettingStoragePath (inputData) {
		return `${ kCollection }/${ inputData || '' }`;
	},

	KVCSettingStorageBuild (privateClient, publicClient, changeDelegate) {
		const OLSKRemoteStorageCollectionExports = {

			async KVCStorageList () {
				return privateClient.getAll(mod.KVCSettingStoragePath(), false);
			},

			async KVCStorageWrite (param1, param2) {
				await privateClient.storeObject(kType, mod.KVCSettingStoragePath(param1), param2);
				return param2;
			},

			KVCStorageRead (inputData) {
				return privateClient.getObject(mod.KVCSettingStoragePath(inputData));
			},
			KVCStorageDelete (inputData) {
				return privateClient.remove(mod.KVCSettingStoragePath(inputData));
			},
			
		};

		return {
			OLSKRemoteStorageCollectionName: kCollection,
			OLSKRemoteStorageCollectionType: kType,
			OLSKRemoteStorageCollectionModelErrors: Object.entries(KVCSettingModel.KVCSettingModelErrorsFor({}, {
				KVCOptionValidateIfNotPresent: true,
			})).map(function (e) {
				if (!Object.keys(KVCSettingModel.KVCSettingModelErrorsFor({})).includes(e[0])) {
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
