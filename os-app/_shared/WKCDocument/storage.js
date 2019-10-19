import * as WKCDocumentModel from './model.js';
import * as OLSKRemoteStorage from 'OLSKRemoteStorage';

const kType = 'wkc_document';
const kCollection = 'wkc_documents';

export const WKCDocumentStoragePath = function(inputData) {
	return `${ kCollection }/${ inputData || '' }`;
};

export const WKCDocumentStorage = function (privateClient, publicClient, changeDelegate) {
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

		changeDelegate[delegateMethod](WKCDocumentModel.WKCDocumentModelPostJSONParse(event[OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateInput(delegateMethod)]));
	});

	return {
		WKCStorageCollection: kCollection,
		WKCStorageType: kType,
		WKCStorageModelErrors: WKCDocumentModel.WKCDocumentModelErrorsFor({}),
		WKCStorageExports: {
			init: function () {
				return privateClient.cache(WKCDocumentStoragePath());
			},
			listObjects: function () {
				return privateClient.getAll(WKCDocumentStoragePath(), false);
			},
			writeObject: async function (param1, param2) {
				await privateClient.storeObject(kType, WKCDocumentStoragePath(param1), WKCDocumentModel.WKCDocumentModelPreJSONSchemaValidate(param2));
				return WKCDocumentModel.WKCDocumentModelPostJSONParse(param2);
			},
			readObject: function (inputData) {
				return privateClient.getObject(WKCDocumentStoragePath(inputData));
			},
			deleteObject: function (inputData) {
				return privateClient.remove(WKCDocumentStoragePath(inputData));
			},
		},
	};
};
