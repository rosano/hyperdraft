const WKCNotesModel = typeof require === 'undefined' ? window.WKCNotesModel : require('./model.js');
const WKCNotesMetal = typeof require === 'undefined' ? window.WKCNotesMetal : require('./metal.js');
const WKCVersionsAction = typeof require === 'undefined' ? window.WKCVersionsAction : require('../wkc_versions/action.js');
const WKCSettingsAction = typeof require === 'undefined' ? window.WKCSettingsAction : require('../wkc_settings/action.js');
const WKCParser = typeof require === 'undefined' ? window.WKCParser : require('../../WKCParser/main.js');

import { factory, detectPrng } from 'ulid'
const uniqueID = typeof require === 'undefined' && navigator.appName === 'Zombie' ? factory(detectPrng(true)) : factory();

export const WKCNotesActionCreate = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	let creationDate = new Date();

	return await WKCNotesMetal.WKCNotesMetalWrite(storageClient, Object.assign(inputData, {
		WKCNoteID: uniqueID(),
		WKCNoteCreationDate: creationDate,
		WKCNoteModificationDate: creationDate,
	}));
};

export const WKCNotesActionUpdate = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	return await WKCNotesMetal.WKCNotesMetalWrite(storageClient, Object.assign(inputData, {
		WKCNoteModificationDate: new Date(),
	}));
};

export const WKCNotesActionDelete = async function(storageClient, inputData) {
	await Promise.all((await WKCVersionsAction.WKCVersionsActionQuery(storageClient, {
		WKCVersionNoteID: inputData,
	})).map(function (e) {
		return WKCVersionsAction.WKCVersionsActionDelete(storageClient, e.WKCVersionID);
	}));
	return await WKCNotesMetal.WKCNotesMetalDelete(storageClient, inputData);
};

export const WKCNotesActionQuery = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	return Promise.resolve(Object.values(await WKCNotesMetal.WKCNotesMetalList(storageClient)).sort(function (a, b) {
		return b.WKCNoteModificationDate - a.WKCNoteModificationDate;
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

export const WKCNotesActionPublish = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	if (!inputData.WKCNotePublicID) {
		inputData.WKCNotePublicID = (parseInt((await WKCSettingsAction.WKCSettingsActionProperty(storageClient, 'WKCSettingsLastRepoID')) || 0) + 1).toString();

		await WKCSettingsAction.WKCSettingsActionProperty(storageClient, 'WKCSettingsLastRepoID', inputData.WKCNotePublicID);
	}

	return await WKCNotesActionUpdate(storageClient, Object.assign(inputData, {
		WKCNotePublishStatusIsPublished: true,
	}));
};

export const WKCNotesActionPublicRead = async function(storageClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	return (await WKCNotesActionQuery(storageClient, {
		WKCNotePublishStatusIsPublished: true,
		WKCNotePublicID: inputData,
	})).pop() || new Error('WKCErrorNotFound');
};

export const WKCNotesActionUnpublish = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	return await WKCNotesActionUpdate(storageClient, Object.assign(inputData, {
		WKCNotePublishStatusIsPublished: false,
	}));
};

export const WKCNotesActionGetPublicLinks = async function(storageClient) {
	return Promise.resolve((await WKCNotesActionQuery(storageClient, {
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
