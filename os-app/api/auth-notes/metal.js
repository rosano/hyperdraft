/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const modelLibrary = require('./model.js');

//_ WKCNotesMetalCreate

exports.WKCNotesMetalCreate = async function(databaseClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
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

	modelLibrary.WKCNotesModelHiddenPropertyNames().forEach(function (e) {
		delete outputData[e];
	});

	return Promise.resolve(outputData);
};

//_ WKCNotesMetalRead

exports.WKCNotesMetalRead = async function(databaseClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	let outputData = await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').findOne({
		WKCNoteID: inputData,
	});

	if (outputData) {
		modelLibrary.WKCNotesModelHiddenPropertyNames().forEach(function(obj) {
			delete outputData[obj];
		});
	}

	return outputData;
};

//_ WKCNotesMetalUpdate

exports.WKCNotesMetalUpdate = async function(databaseClient, param1, param2) {
	if (typeof param1 !== 'string') {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	if (typeof param2 !== 'object' || param2 === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	let errors;
	if (errors = modelLibrary.WKCNotesModelErrorsFor(param2, {
		WKCOptionValidatePresentOnly: true,
	})) {
		return Promise.resolve(Object.assign(param2, {
			WKCErrors: errors,
		}));
	}

	let outputData = (await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').findOneAndUpdate({
		WKCNoteID: param1,
	}, {
		'$set': Object.assign(param2, {
			WKCNoteDateUpdated: new Date(),
		}),
	}, {
		returnOriginal: false,
	})).value;

	if (outputData) {
		modelLibrary.WKCNotesModelHiddenPropertyNames().forEach(function (e) {
			delete outputData[e];
		});
	}

	return Promise.resolve(outputData);
};

//_ WKCNotesMetalQuery

exports.WKCNotesMetalQuery = async function(databaseClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	return Promise.resolve((await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').find(inputData).toArray()).map(function(e) {
		modelLibrary.WKCNotesModelHiddenPropertyNames().forEach(function(key) {
			delete e[key];
		});

		return e;
	}));
};
