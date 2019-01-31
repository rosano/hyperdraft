 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var modelLibrary = require('./model');

//_ WKCNotesMetalCreate

exports.WKCNotesMetalCreate = async function(databaseClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInvalidInput'));
	}

	let errors;
	if (errors = modelLibrary.WKCNotesModelErrorsFor(inputData)) {
		return Promise.resolve(Object.assign(inputData, {
			WKCErrors: errors,
		}));
	}

	let sharedDate = new Date();
	let outputData = (await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').insertOne(Object.assign(inputData, {
		WKCNoteID: parseInt(new Date() * 1).toString(),
		WKCNoteDateCreated: sharedDate,
		WKCNoteDateUpdated: sharedDate,
	}))).ops.pop();

	modelLibrary.WKCNotesHiddenPropertyNames().forEach(function (e) {
		delete outputData[e];
	});

	return Promise.resolve(outputData);
};
