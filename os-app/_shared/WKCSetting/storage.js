const kType = 'wkc_setting';
const kCollection = 'wkc_settings';

export const WKCSettingStoragePath = function(inputData) {
	return `${ kCollection }/${ inputData || '' }`;
};

import * as WKCSettingModel from './model.js';

export const WKCSettingStorage = function (privateClient, publicClient, changeDelegate) {
	return {
		WKCStorageCollection: kCollection,
		WKCStorageType: kType,
		WKCStorageModelErrors: WKCSettingModel.WKCSettingModelErrorsFor({}),
		WKCStorageExports: {
			init () {
				return privateClient.cache(WKCSettingStoragePath());
			},
			listObjects () {
				return privateClient.getAll(WKCSettingStoragePath(), false);
			},
			async writeObject (param1, param2) {
				await privateClient.storeObject(kType, WKCSettingStoragePath(param1), param2);
				return param2;
			},
			readObject (inputData) {
				return privateClient.getObject(WKCSettingStoragePath(inputData));
			},
			deleteObject (inputData) {
				return privateClient.remove(WKCSettingStoragePath(inputData));
			},
		},
	};
};


