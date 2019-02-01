/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var metalLibrary = require('./metal');

//_ WKCNotesActionPublish

exports.WKCNotesActionPublish = async function(databaseClient, inputData) {
	let outputData = await metalLibrary.WKCNotesMetalUpdate(databaseClient, inputData, {
		WKCNotePublishStatusIsPublished: true,
	});

	if (!outputData) {
		return new Error('WKCErrorNotFound');
	}

	return Promise.resolve(outputData);
};
