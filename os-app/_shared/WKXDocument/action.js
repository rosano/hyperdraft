import * as WKXDocumentMetal from './metal.js';
import * as WKXDocumentModel from './model.js';
import * as WKCSettingAction from '../WKCSetting/action.js';
import * as WKCVersionAction from '../WKCVersion/action.js';
import * as WKCParser from '../WKCParser/main.js';
import { factory, detectPrng } from 'ulid';
const uniqueID = typeof require === 'undefined' && navigator.appName === 'Zombie' ? factory(detectPrng(true)) : factory();

export const WKXDocumentActionCreate = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	let creationDate = new Date();

	return await WKXDocumentMetal.WKXDocumentMetalWrite(storageClient, Object.assign(inputData, {
		WKXDocumentID: uniqueID(),
		WKXDocumentCreationDate: creationDate,
		WKXDocumentModificationDate: creationDate,
	}));
};

export const WKXDocumentActionRead = async function(storageClient, inputData) {
	return await WKXDocumentMetal.WKXDocumentMetalRead(storageClient, inputData);
};

export const WKXDocumentActionUpdate = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await WKXDocumentMetal.WKXDocumentMetalWrite(storageClient, Object.assign(inputData, {
		WKXDocumentModificationDate: new Date(),
	}));
};

export const WKXDocumentActionDelete = async function(storageClient, inputData) {
	await Promise.all((await WKCVersionAction.WKCVersionActionQuery(storageClient, {
		WKCVersionDocumentID: inputData,
	})).map(function (e) {
		return WKCVersionAction.WKCVersionActionDelete(storageClient, e.WKCVersionID);
	}));
	
	return await WKXDocumentMetal.WKXDocumentMetalDelete(storageClient, inputData);
};

export const WKXDocumentActionQuery = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return Promise.resolve(Object.values(await WKXDocumentMetal.WKXDocumentMetalList(storageClient)).sort(function (a, b) {
		return b.WKXDocumentModificationDate - a.WKXDocumentModificationDate;
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

export const WKXDocumentActionPublish = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	if (!inputData.WKXDocumentPublicID) {
		inputData.WKXDocumentPublicID = (parseInt((await WKCSettingAction.WKCSettingsActionProperty(storageClient, 'WKCSettingsLastRepoID')) || 0) + 1).toString();

		await WKCSettingAction.WKCSettingsActionProperty(storageClient, 'WKCSettingsLastRepoID', inputData.WKXDocumentPublicID);
	}

	return await WKXDocumentActionUpdate(storageClient, Object.assign(inputData, {
		WKXDocumentPublishStatusIsPublished: true,
	}));
};

export const WKXDocumentActionUnpublish = async function(storageClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputNotValid'));
	}

	return await WKXDocumentActionUpdate(storageClient, Object.assign(inputData, {
		WKXDocumentPublishStatusIsPublished: false,
	}));
};

export const WKXDocumentActionGetPublicLinks = async function(storageClient) {
	return Promise.resolve((await WKXDocumentActionQuery(storageClient, {
		WKXDocumentPublishStatusIsPublished: true,
	})).map(WKXDocumentModel.WKXDocumentModelPostJSONParse).map(function (e) {
		return [WKCParser.WKCParserTitleForPlaintext(e.WKXDocumentBody), e.WKXDocumentPublicID];
	}).reduce(function (coll, [key, val]) {
		if (typeof coll[key] === 'undefined') {
			coll[key] = val;
		}

		return coll;
	}, {}));
};
