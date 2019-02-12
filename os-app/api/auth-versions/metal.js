/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var modelLibrary = require('./model');

//_ WKCVersionsMetalCreate

exports.WKCVersionsMetalCreate = async function(databaseClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	let errors;
	if (errors = modelLibrary.WKCVersionsModelErrorsFor(inputData)) {
		return Promise.resolve(Object.assign(inputData, {
			WKCErrors: errors,
		}));
	}

	let outputData = (await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_versions').insertOne(Object.assign(inputData, {
		WKCVersionID: parseInt(new Date() * 1).toString(),
	}))).ops.pop();

	modelLibrary.WKCVersionsHiddenPropertyNames().forEach(function(key) {
		delete outputData[key];
	});

	return Promise.resolve(outputData);
};

//_ WKCVersionsMetalDelete

exports.WKCVersionsMetalDelete = async function(databaseClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	return Promise.resolve(!(await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_versions').deleteOne({
		WKCVersionID: inputData,
	})).result.n ? new Error('WKCErrorNotFound') : true);
};

//_ WKCVersionsMetalQuery

exports.WKCVersionsMetalQuery = async function(databaseClient, inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return Promise.reject(new Error('WKCErrorInputInvalid'));
	}

	return Promise.resolve((await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_versions').find(inputData).sort({
		WKCVersionID: -1,
	}).toArray()).map(function(e) {
		modelLibrary.WKCVersionsHiddenPropertyNames().forEach(function(key) {
			delete e[key];
		});

		return e;
	}));
};
