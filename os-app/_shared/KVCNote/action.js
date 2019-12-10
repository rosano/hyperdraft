import * as KVCNoteMetal from './metal.js';
import * as KVCNoteModel from './model.js';
import * as KVCSettingAction from '../KVCSetting/action.js';
import * as KVCVersionAction from '../KVCVersion/action.js';
import * as WKCParser from '../WKCParser/main.js';
import { factory, detectPrng } from 'ulid';
const uniqueID = typeof require === 'undefined' && navigator.appName === 'Zombie' ? factory(detectPrng(true)) : factory();

export const KVCNoteActionCreate = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	let creationDate = new Date();

	return await KVCNoteMetal.KVCNoteMetalWrite(storageClient, Object.assign(inputData, {
		KVCNoteID: uniqueID(),
		KVCNoteCreationDate: creationDate,
		KVCNoteModificationDate: creationDate,
	}));
};

export const KVCNoteActionRead = async function(storageClient, inputData) {
	return await KVCNoteMetal.KVCNoteMetalRead(storageClient, inputData);
};

export const KVCNoteActionUpdate = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return await KVCNoteMetal.KVCNoteMetalWrite(storageClient, Object.assign(inputData, {
		KVCNoteModificationDate: new Date(),
	}));
};

export const KVCNoteActionDelete = async function(storageClient, inputData) {
	await Promise.all((await KVCVersionAction.KVCVersionActionQuery(storageClient, {
		KVCVersionNoteID: inputData,
	})).map(function (e) {
		return KVCVersionAction.KVCVersionActionDelete(storageClient, e.KVCVersionID);
	}));
	
	return await KVCNoteMetal.KVCNoteMetalDelete(storageClient, inputData);
};

export const KVCNoteActionQuery = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return Promise.resolve(Object.values(await KVCNoteMetal.KVCNoteMetalList(storageClient)).sort(function (a, b) {
		return b.KVCNoteModificationDate - a.KVCNoteModificationDate;
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

export const KVCNoteActionPublish = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	if (!inputData.KVCNotePublicID) {
		inputData.KVCNotePublicID = (parseInt((await KVCSettingAction.KVCSettingsActionProperty(storageClient, 'KVCSettingsLastRepoID')) || 0) + 1).toString();

		await KVCSettingAction.KVCSettingsActionProperty(storageClient, 'KVCSettingsLastRepoID', inputData.KVCNotePublicID);
	}

	return await KVCNoteActionUpdate(storageClient, Object.assign(inputData, {
		KVCNotePublishStatusIsPublished: true,
	}));
};

export const KVCNoteActionRetract = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	return await KVCNoteActionUpdate(storageClient, Object.assign(inputData, {
		KVCNotePublishStatusIsPublished: false,
	}));
};

export const KVCNoteActionGetPublicLinks = async function(storageClient) {
	return Promise.resolve((await KVCNoteActionQuery(storageClient, {
		KVCNotePublishStatusIsPublished: true,
	})).map(KVCNoteModel.KVCNoteModelPostJSONParse).map(function (e) {
		return [WKCParser.WKCParserTitleForPlaintext(e.KVCNoteBody), e.KVCNotePublicID];
	}).reduce(function (coll, [key, val]) {
		if (typeof coll[key] === 'undefined') {
			coll[key] = val;
		}

		return coll;
	}, {}));
};
