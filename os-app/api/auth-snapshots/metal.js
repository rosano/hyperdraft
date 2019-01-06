/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const OLSKIdentifier = require('OLSKIdentifier');

var modelLibrary = require('./model');

//_ WKCSnapshotsMetalCreate

exports.WKCSnapshotsMetalCreate = function(databaseClient, inputData, completionHandler) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	const errors = modelLibrary.WKCSnapshotsModelErrorsFor(inputData);
	if (errors) {
		return completionHandler(null, Object.assign(inputData, {
			WKCErrors: errors,
		}));
	}

	return OLSKIdentifier.OLSKIdentifierTimeBased().then(function (id) {
		var currentDate = new Date();

		return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_snapshots').insertOne(Object.assign(inputData, {
			WKCSnapshotID: parseInt(new Date() * 1).toString(),
			WKCSnapshotID2: id,
			WKCSnapshotDateCreated: currentDate,
			WKCSnapshotDateUpdated: currentDate,
		}), function(err, result) {
			if (err) {
				return completionHandler(err);
			}

			var snapshotObject = result.ops.pop();

			modelLibrary.WKCSnapshotHiddenPropertyNames().forEach(function(obj) {
				delete snapshotObject[obj];
			});

			return completionHandler(null, snapshotObject);
		});
	});
};
