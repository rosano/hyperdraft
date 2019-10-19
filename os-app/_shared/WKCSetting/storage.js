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
			init: function () {
				return privateClient.cache(WKCSettingStoragePath());
			},
			listObjects: function () {
				return privateClient.getAll(WKCSettingStoragePath(), false);
			},
			writeObject: async function (param1, param2) {
				await privateClient.storeObject(kType, WKCSettingStoragePath(param1), param2);
				return param2;
			},
			readObject: function (inputData) {
				return privateClient.getObject(WKCSettingStoragePath(inputData));
			},
			deleteObject: function (inputData) {
				return privateClient.remove(WKCSettingStoragePath(inputData));
			},
		},
	};
};


