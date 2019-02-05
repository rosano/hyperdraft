/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const modelLibrary = require('./model.js');
var metalLibrary = require('./metal.js');
var versionsMetalLibrary = require('../auth-versions/metal.js');
var settingsMetalLibrary = require('../auth-settings/metal.js');
const WKCParser = require('../../_shared/WKCParser/main.js');

//_ WKCNotesActionPublish

exports.WKCNotesActionPublish = async function(databaseClient, inputData) {
	let item = await metalLibrary.WKCNotesMetalRead(databaseClient, inputData);

	if (!item) {
		return new Error('WKCErrorNotFound');
	}

	if (!item.WKCNotePublicID) {
		item.WKCNotePublicID = (parseInt((await settingsMetalLibrary.WKCSettingsMetalProperty(databaseClient, 'WKCSettingsLastRepoID')) || 0) + 1).toString();

		await settingsMetalLibrary.WKCSettingsMetalProperty(databaseClient, 'WKCSettingsLastRepoID', item.WKCNotePublicID);
	}

	let outputData = await metalLibrary.WKCNotesMetalUpdate(databaseClient, inputData, {
		WKCNotePublishStatusIsPublished: true,
		WKCNotePublicID: item.WKCNotePublicID,
	});

	return Promise.resolve(outputData);
};

//_ WKCNotesActionPublicRead

exports.WKCNotesActionPublicRead = async function(databaseClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInvalidInput'));
	}

	let outputData = (await metalLibrary.WKCNotesMetalQuery(databaseClient, {
		WKCNotePublishStatusIsPublished: true,
		WKCNotePublicID: inputData,
	})).shift();

	if (!outputData) {
		return new Error('WKCErrorNotFound');
	}

	return Promise.resolve(outputData);
};

//_ WKCNotesActionUnpublish

exports.WKCNotesActionUnpublish = async function(databaseClient, inputData) {
	let outputData = await metalLibrary.WKCNotesMetalUpdate(databaseClient, inputData, {
		WKCNotePublishStatusIsPublished: false,
	});

	if (!outputData) {
		return new Error('WKCErrorNotFound');
	}

	return Promise.resolve(outputData);
};

//_ WKCNotesActionVersion

exports.WKCNotesActionVersion = async function(databaseClient, inputData) {
	let outputData = await metalLibrary.WKCNotesMetalUpdate(databaseClient, inputData.WKCVersionNoteID, {
		WKCNoteBody: inputData.WKCVersionBody,
	});

	if (!outputData) {
		return new Error('WKCErrorNotFound');
	}

	if ((await versionsMetalLibrary.WKCVersionsMetalCreate(databaseClient, inputData)).WKCErrors) {
		return Promise.reject(new Error('WKCErrorInvalidInput'));
	};

	return Promise.resolve(outputData);
};

//_ WKCNotesActionDelete

exports.WKCNotesActionDelete = async function(databaseClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInvalidInput'));
	}

	(await versionsMetalLibrary.WKCVersionsMetalQuery(databaseClient, {
		WKCVersionNoteID: inputData,
	})).map(async function (e) {
		return await versionsMetalLibrary.WKCVersionsMetalDelete(databaseClient, e.WKCVersionID);
	});

	return Promise.resolve(!(await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').deleteOne({
		WKCNoteID: inputData,
	})).result.n ? new Error('WKCErrorNotFound') : true);
};

//_ WKCNotesActionGetPublicLinks

exports.WKCNotesActionGetPublicLinks = async function(databaseClient) {
	return Promise.resolve((await metalLibrary.WKCNotesMetalQuery(databaseClient, {
		WKCNotePublishStatusIsPublished: true,
	})).map(modelLibrary.WKCNotesModelPrepare).sort(function (a, b) {
		return a.WKCNoteDateUpdated > b.WKCNoteDateUpdated;
	}).map(function (e) {
		return [WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody), e.WKCNotePublicID];
	}).reduce(function (coll, e) {
		coll[e[0]] = e[1];

		return coll;
	}, {}));
};
