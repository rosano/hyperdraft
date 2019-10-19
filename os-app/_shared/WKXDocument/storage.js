import * as WKXDocumentModel from './model.js';
import * as OLSKRemoteStorage from 'OLSKRemoteStorage';

const kType = 'wkc_document';
const kCollection = 'wkc_documents';

export const WKXDocumentStoragePath = function(inputData) {
	return `${ kCollection }/${ inputData || '' }`;
};

export const WKXDocumentStorage = function (privateClient, publicClient, changeDelegate) {
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

		changeDelegate[delegateMethod](WKXDocumentModel.WKXDocumentModelPostJSONParse(event[OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateInput(delegateMethod)]));
	});

	return {
		WKXStorageCollection: kCollection,
		WKXStorageType: kType,
		WKXStorageModelErrors: WKXDocumentModel.WKXDocumentModelErrorsFor({}),
		WKXStorageExports: {
			init: function () {
				return privateClient.cache(WKXDocumentStoragePath());
			},
			listObjects: function () {
				return privateClient.getAll(WKXDocumentStoragePath(), false);
			},
			writeObject: async function (param1, param2) {
				await privateClient.storeObject(kType, WKXDocumentStoragePath(param1), WKXDocumentModel.WKXDocumentModelPreJSONSchemaValidate(param2));
				return WKXDocumentModel.WKXDocumentModelPostJSONParse(param2);
			},
			readObject: function (inputData) {
				return privateClient.getObject(WKXDocumentStoragePath(inputData));
			},
			deleteObject: function (inputData) {
				return privateClient.remove(WKXDocumentStoragePath(inputData));
			},
		},
	};
};
