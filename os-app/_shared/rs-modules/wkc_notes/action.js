(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCNotesAction = global.WKCNotesAction || {})));
}(this, (function (exports) { 'use strict';	

	const WKCNotesModel = typeof require === 'undefined' ? window.WKCNotesModel : require('./model.js');
	const WKCNotesMetal = typeof require === 'undefined' ? window.WKCNotesMetal : require('./metal.js');
	const WKCVersionsAction = typeof require === 'undefined' ? window.WKCVersionsAction : require('../wkc_versions/action.js');
	const WKCSettingsAction = typeof require === 'undefined' ? window.WKCSettingsAction : require('../wkc_settings/action.js');
	const WKCParser = typeof require === 'undefined' ? window.WKCParser : require('../../WKCParser/main.js');

	//_ WKCNotesActionCreate

	const ULIDPackage = typeof require === 'undefined' ? window.ULID : require('ulid');

	exports.WKCNotesActionCreate = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		let creationDate = new Date();

		return await WKCNotesMetal.WKCNotesMetalWrite(storageClient, Object.assign(inputData, {
			WKCNoteID: ULIDPackage.ulid(),
			WKCNoteCreationDate: creationDate,
			WKCNoteModificationDate: creationDate,
		}));
	};

	//_ WKCNotesActionUpdate

	exports.WKCNotesActionUpdate = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		return await WKCNotesMetal.WKCNotesMetalWrite(storageClient, Object.assign(inputData, {
			WKCNoteModificationDate: new Date(),
		}));
	};

	//_ WKCNotesActionDelete

	exports.WKCNotesActionDelete = async function(storageClient, inputData) {
		await Promise.all((await WKCVersionsAction.WKCVersionsActionQuery(storageClient, {
			WKCVersionNoteID: inputData,
		})).map(function (e) {
			return WKCVersionsAction.WKCVersionsActionDelete(storageClient, e.WKCVersionID)
		}));
		return await WKCNotesMetal.WKCNotesMetalDelete(storageClient, inputData);
	};

	//_ WKCNotesActionQuery

	const d3Package = typeof require === 'undefined' ? window.d3 : require('d3');

	exports.WKCNotesActionQuery = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		return Promise.resolve(Object.values(await WKCNotesMetal.WKCNotesMetalList(storageClient)).sort(function (a, b) {
			return d3Package.descending(a.WKCNoteModificationDate, b.WKCNoteModificationDate)
		}).filter(function(e) {
			if (!Object.keys(inputData).length) {
				return true;
			}

			if (Object.entries(inputData).map(function ([key, value]) {
				return value === e[key];
			}).filter(function (e) {
				return !e;
			}).length) {
				return false;
			}

			return true;
		}));
	};

	//_ WKCNotesActionPublish

	exports.WKCNotesActionPublish = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		if (!inputData.WKCNotePublicID) {
			inputData.WKCNotePublicID = (parseInt((await WKCSettingsAction.WKCSettingsActionProperty(storageClient, 'WKCSettingsLastRepoID')) || 0) + 1).toString();

			await WKCSettingsAction.WKCSettingsActionProperty(storageClient, 'WKCSettingsLastRepoID', inputData.WKCNotePublicID);
		}

		return await exports.WKCNotesActionUpdate(storageClient, Object.assign(inputData, {
			WKCNotePublishStatusIsPublished: true,
		}));
	};

	//_ WKCNotesActionPublicRead

	exports.WKCNotesActionPublicRead = async function(storageClient, inputData) {
		if (typeof inputData !== 'string') {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		return (await exports.WKCNotesActionQuery(storageClient, {
			WKCNotePublishStatusIsPublished: true,
			WKCNotePublicID: inputData,
		})).pop() || new Error('WKCErrorNotFound');
	};

	//_ WKCNotesActionUnpublish

	exports.WKCNotesActionUnpublish = async function(storageClient, inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			return Promise.reject(new Error('WKCErrorInputInvalid'));
		}

		return await exports.WKCNotesActionUpdate(storageClient, Object.assign(inputData, {
			WKCNotePublishStatusIsPublished: false,
		}));
	};

	//_ WKCNotesActionGetPublicLinks

	exports.WKCNotesActionGetPublicLinks = async function(storageClient) {
		return Promise.resolve((await exports.WKCNotesActionQuery(storageClient, {
			WKCNotePublishStatusIsPublished: true,
		})).map(WKCNotesModel.WKCNotesModelPostJSONParse).map(function (e) {
			return [WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody), e.WKCNotePublicID];
		}).reduce(function (coll, [key, val]) {
			if (typeof coll[key] === 'undefined') {
				coll[key] = val;
			}

			return coll;
		}, {}));
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
