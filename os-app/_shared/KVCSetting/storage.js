import KVCSettingModel from './model.js';

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

			async KVCStorageList () {
				return privateClient.getAll(mod.KVCSettingStorageCollectionPath(), false);
			},

			async KVCStorageWrite (param1, param2) {
				await privateClient.storeObject(mod.KVCSettingStorageCollectionType(), mod.KVCSettingStorageObjectPath(param2), param2);
				return param2;
			},

			KVCStorageRead (inputData) {
				return privateClient.getObject(mod.KVCSettingStorageObjectPath({
					KVCSettingKey: inputData,
					KVCSettingValue: '',
				}));
			},
			KVCStorageDelete (inputData) {
				return privateClient.remove(mod.KVCSettingStorageObjectPath({
					KVCSettingKey: inputData,
					KVCSettingValue: '',
				}));
			},
			
		};

		return {
			OLSKRemoteStorageCollectionName: mod.KVCSettingStorageCollectionName(),
			OLSKRemoteStorageCollectionType: mod.KVCSettingStorageCollectionType(),
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
