import * as WKXVersionModel from './model.js';
import * as OLSKRemoteStorage from 'OLSKRemoteStorage';

const kType = 'wkc_version';
const kCollection = 'wkc_versions';

export const WKXVersionStoragePath = function(inputData) {
	return `${ kCollection }/${ inputData || '' }`;
};

export const WKXVersionStorage = function (privateClient, publicClient, changeDelegate) {
	privateClient.on('change', function (event) {
		if (!changeDelegate) {
			return;
		};
		
		if (event.relativePath.indexOf(kCollection) !== 0) {
			return;
		};

		const delegateMethod = OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateProperty(event);

		if (!delegateMethod) {
			return;
		};

		if (typeof changeDelegate[delegateMethod] !== 'function') {
			return console.warn(`${ delegateMethod } not function`);
		};

		changeDelegate[delegateMethod](WKXVersionModel.WKXVersionModelPostJSONParse(event[OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateInput(delegateMethod)]));
	});

	return {
		WKXStorageCollection: kCollection,
		WKXStorageType: kType,
		WKXStorageModelErrors: WKXVersionModel.WKXVersionModelErrorsFor({}),
		WKXStorageExports: {
			init: function () {
				return privateClient.cache(WKXVersionStoragePath());
			},
			listObjects: function () {
				return privateClient.getAll(WKXVersionStoragePath(), false);
			},
			writeObject: async function (param1, param2) {
				await privateClient.storeObject(kType, WKXVersionStoragePath(param1), WKXVersionModel.WKXVersionModelPreJSONSchemaValidate(param2));
				return WKXVersionModel.WKXVersionModelPostJSONParse(param2);
			},
			readObject: function (inputData) {
				return privateClient.getObject(WKXVersionStoragePath(inputData));
			},
			deleteObject: function (inputData) {
				return privateClient.remove(WKXVersionStoragePath(inputData));
			},
		},
	};
};
