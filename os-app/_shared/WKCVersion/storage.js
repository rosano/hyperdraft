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
			WKCVersionStorageCache () {
				return privateClient.cache(WKCVersionStoragePath());
			},
			listObjects () {
				return privateClient.getAll(WKCVersionStoragePath(), false);
			},
			async writeObject (param1, param2) {
				await privateClient.storeObject(kType, WKCVersionStoragePath(param1), WKCVersionModel.WKCVersionModelPreJSONSchemaValidate(param2));
				return WKCVersionModel.WKCVersionModelPostJSONParse(param2);
			},
			readObject (inputData) {
				return privateClient.getObject(WKCVersionStoragePath(inputData));
			},
			deleteObject (inputData) {
				return privateClient.remove(WKCVersionStoragePath(inputData));
			},
		},
	};
};
