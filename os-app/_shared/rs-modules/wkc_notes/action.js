import * as WKCNotesModel from './model.js';
import * as WKCNotesMetal from './metal.js';
import * as WKCVersionsAction from '../wkc_versions/action.js';
import WKCSettingsAction from '../wkc_settings/action.js';
import * as WKCParser from '../../WKCParser/main.js';
import { _WIKIsTestingBehaviour } from '../../common/global.js';

import { factory, detectPrng } from 'ulid';
const uniqueID = _WIKIsTestingBehaviour() ? factory(detectPrng(true)) : factory();

export const WKCNotesActionCreate = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
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
		return Promise.reject(new Error('WKCErrorInputNotValid'));
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
		return Promise.reject(new Error('WKCErrorInputNotValid'));
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
		return Promise.reject(new Error('WKCErrorInputNotValid'));
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
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return (await WKCNotesActionQuery(storageClient, {
		WKCNotePublishStatusIsPublished: true,
		WKCNotePublicID: inputData,
	})).pop() || new Error('WKCErrorNotFound');
};

export const WKCNotesActionUnpublish = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
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
