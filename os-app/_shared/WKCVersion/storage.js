import * as WKCVersionModel from './model.js';
import * as OLSKRemoteStorage from 'OLSKRemoteStorage';

const kType = 'wkc_version';
const kCollection = 'wkc_versions';

export const WKCVersionStoragePath = function(inputData) {
	return `${ kCollection }/${ inputData || '' }`;
};

export const WKCVersionStorage = function (privateClient, publicClient, changeDelegate) {
	return {
		WKCStorageCollection: kCollection,
		WKCStorageType: kType,
		WKCStorageModelErrors: WKCVersionModel.WKCVersionModelErrorsFor({}),
		WKCStorageExports: {
			init: function () {
				return privateClient.cache(WKCVersionStoragePath());
			},
			listObjects: function () {
				return privateClient.getAll(WKCVersionStoragePath(), false);
			},
			writeObject: async function (param1, param2) {
				await privateClient.storeObject(kType, WKCVersionStoragePath(param1), WKCVersionModel.WKCVersionModelPreJSONSchemaValidate(param2));
				return WKCVersionModel.WKCVersionModelPostJSONParse(param2);
			},
			readObject: function (inputData) {
				return privateClient.getObject(WKCVersionStoragePath(inputData));
			},
			deleteObject: function (inputData) {
				return privateClient.remove(WKCVersionStoragePath(inputData));
			},
		},
	};
};
