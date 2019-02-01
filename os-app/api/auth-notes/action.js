/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var metalLibrary = require('./metal.js');
var settingsMetalLibrary = require('../auth-settings/metal.js');

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
