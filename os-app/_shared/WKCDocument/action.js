import * as WKCDocumentMetal from './metal.js';
import * as WKCDocumentModel from './model.js';
import * as WKCSettingAction from '../WKCSetting/action.js';
import * as WKCVersionAction from '../WKCVersion/action.js';
import * as WKCParser from '../WKCParser/main.js';
import { factory, detectPrng } from 'ulid';
const uniqueID = typeof require === 'undefined' && navigator.appName === 'Zombie' ? factory(detectPrng(true)) : factory();

export const WKCDocumentActionCreate = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	let creationDate = new Date();

	return await WKCDocumentMetal.WKCDocumentMetalWrite(storageClient, Object.assign(inputData, {
		WKCDocumentID: uniqueID(),
		WKCDocumentCreationDate: creationDate,
		WKCDocumentModificationDate: creationDate,
	}));
};

export const WKCDocumentActionRead = async function(storageClient, inputData) {
	return await WKCDocumentMetal.WKCDocumentMetalRead(storageClient, inputData);
};

export const WKCDocumentActionUpdate = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await WKCDocumentMetal.WKCDocumentMetalWrite(storageClient, Object.assign(inputData, {
		WKCDocumentModificationDate: new Date(),
	}));
};

export const WKCDocumentActionDelete = async function(storageClient, inputData) {
	await Promise.all((await WKCVersionAction.WKCVersionActionQuery(storageClient, {
		WKCVersionDocumentID: inputData,
	})).map(function (e) {
		return WKCVersionAction.WKCVersionActionDelete(storageClient, e.WKCVersionID);
	}));
	
	return await WKCDocumentMetal.WKCDocumentMetalDelete(storageClient, inputData);
};

export const WKCDocumentActionQuery = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return Promise.resolve(Object.values(await WKCDocumentMetal.WKCDocumentMetalList(storageClient)).sort(function (a, b) {
		return b.WKCDocumentModificationDate - a.WKCDocumentModificationDate;
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

export const WKCDocumentActionPublish = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	if (!inputData.WKCDocumentPublicID) {
		inputData.WKCDocumentPublicID = (parseInt((await WKCSettingAction.WKCSettingsActionProperty(storageClient, 'WKCSettingsLastRepoID')) || 0) + 1).toString();

		await WKCSettingAction.WKCSettingsActionProperty(storageClient, 'WKCSettingsLastRepoID', inputData.WKCDocumentPublicID);
	}

	return await WKCDocumentActionUpdate(storageClient, Object.assign(inputData, {
		WKCDocumentPublishStatusIsPublished: true,
	}));
};

export const WKCDocumentActionUnpublish = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await WKCDocumentActionUpdate(storageClient, Object.assign(inputData, {
		WKCDocumentPublishStatusIsPublished: false,
	}));
};

export const WKCDocumentActionGetPublicLinks = async function(storageClient) {
	return Promise.resolve((await WKCDocumentActionQuery(storageClient, {
		WKCDocumentPublishStatusIsPublished: true,
	})).map(WKCDocumentModel.WKCDocumentModelPostJSONParse).map(function (e) {
		return [WKCParser.WKCParserTitleForPlaintext(e.WKCDocumentBody), e.WKCDocumentPublicID];
	}).reduce(function (coll, [key, val]) {
		if (typeof coll[key] === 'undefined') {
			coll[key] = val;
		}

		return coll;
	}, {}));
};
