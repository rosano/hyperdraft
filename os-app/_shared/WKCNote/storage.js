import * as WKCNoteModel from './model.js';
import * as OLSKRemoteStorage from 'OLSKRemoteStorage';

const kType = 'wkc_note';
const kCollection = 'wkc_notes';

export const WKCNoteStoragePath = function(inputData) {
	return `${ kCollection }/${ inputData || '' }`;
};

export const WKCNoteStorage = function (privateClient, publicClient, changeDelegate) {
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

		changeDelegate[delegateMethod](WKCNoteModel.WKCNoteModelPostJSONParse(event[OLSKRemoteStorage.OLSKRemoteStorageChangeDelegateInput(delegateMethod)]));
	});

	return {
		WKCStorageCollection: kCollection,
		WKCStorageType: kType,
		WKCStorageModelErrors: WKCNoteModel.WKCNoteModelErrorsFor({}),
		WKCStorageExports: {
			init: function () {
				return privateClient.cache(WKCNoteStoragePath());
			},
			listObjects: function () {
				return privateClient.getAll(WKCNoteStoragePath(), false);
			},
			writeObject: async function (param1, param2) {
				await privateClient.storeObject(kType, WKCNoteStoragePath(param1), WKCNoteModel.WKCNoteModelPreJSONSchemaValidate(param2));
				return WKCNoteModel.WKCNoteModelPostJSONParse(param2);
			},
			readObject: function (inputData) {
				return privateClient.getObject(WKCNoteStoragePath(inputData));
			},
			deleteObject: function (inputData) {
				return privateClient.remove(WKCNoteStoragePath(inputData));
			},
		},
	};
};
