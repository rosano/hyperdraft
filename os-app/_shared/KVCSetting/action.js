import KVCSettingStorage from './storage.js';

const mod = {

	async _KVCSettingsActionSet (storageClient, param1, param2) {
		if (typeof param1 !== 'string') {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		if (typeof param2 === 'undefined') {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return await KVCSettingStorage.KVCSettingStorageWrite(storageClient, {
			KVCSettingKey: param1,
			KVCSettingValue: param2,
		});
	},

	async _KVCSettingsActionGet (storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return await KVCSettingStorage.KVCSettingStorageRead(storageClient, inputData);
	},

	async KVCSettingsActionProperty (storageClient, param1, param2) {
		if (typeof param2 === 'undefined') {
			return await mod._KVCSettingsActionGet(storageClient, param1);
		}

		return await mod._KVCSettingsActionSet(storageClient, param1, param2);
	},

	async KVCSettingsActionDelete (storageClient, inputData) {
		return await KVCSettingStorage.KVCSettingStorageDelete(storageClient, inputData);
	},

	async KVCSettingsActionQuery (storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('KVCErrorInputNotValid'));
		}

		return Promise.resolve(Object.values(await KVCSettingStorage.KVCSettingStorageList(storageClient)).filter(function(e) {
			if (!Object.keys(inputData).length) {
				return true;
			}

			if (Object.keys(inputData).filter(function (key) {
				return e[key].match(inputData[key]);
			}).length) {
				return true;
			}

			return false;
		}));
	},
	
};
	
export default mod;
