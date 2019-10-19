const kType = 'wkc_setting';
const kCollection = 'wkc_settings';

export const WKXSettingStoragePath = function(inputData) {
	return `${ kCollection }/${ inputData || '' }`;
};

import * as WKXSettingModel from './model.js';

export const WKXSettingStorage = function (privateClient, publicClient, changeDelegate) {
	return {
		WKXStorageCollection: kCollection,
		WKXStorageType: kType,
		WKXStorageModelErrors: WKXSettingModel.WKXSettingModelErrorsFor({}),
		WKXStorageExports: {
			init: function () {
				return privateClient.cache(WKXSettingStoragePath());
			},
			listObjects: function () {
				return privateClient.getAll(WKXSettingStoragePath(), false);
			},
			writeObject: async function (param1, param2) {
				await privateClient.storeObject(kType, WKXSettingStoragePath(param1), param2);
				return param2;
			},
			readObject: function (inputData) {
				return privateClient.getObject(WKXSettingStoragePath(inputData));
			},
			deleteObject: function (inputData) {
				return privateClient.remove(WKXSettingStoragePath(inputData));
			},
		},
	};
};


