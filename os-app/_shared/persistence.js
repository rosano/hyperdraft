/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const MongoClient = require('mongodb').MongoClient;
const kWKCDatabaseURL = 'mongodb://localhost:27017';
const kWKCDatabaseName = 'wkc_database';

//_ WKCPersistenceMembers

exports.WKCPersistenceMembers = function (callback) {
	MongoClient.connect(kWKCDatabaseURL, function(err, client) {
		if (err) {
			console.log(err);
			throw new Error('WKCErrorDatabaseConnectionFailed');
		}

		return client.db(kWKCDatabaseName).collection('wkc_members').find({}).toArray(function(err, items) {
			if (err) {
				console.log(err);
				throw new Error('WKCErrorDatabaseFindFailed');
			};

			client.close();

			return callback(items);
		});
	});
};

//_ WKCPersistenceNotesAdd

exports.WKCPersistenceNotesAdd = function (callback) {
	MongoClient.connect(kWKCDatabaseURL, function(err, client) {
		if (err) {
			console.log(err);
			throw new Error('WKCErrorDatabaseConnectionFailed');
		}

		var noteDate = new Date();

		return client.db(kWKCDatabaseName).collection('wkc_notes').insertOne({
			WKCNoteBody: noteDate.toLocaleDateString(),
			WKCNoteDateCreated: noteDate,
			WKCNoteDateUpdated: noteDate,
		}, function(err, result) {
			if (err) {
				console.log(err);
				throw new Error('WKCErrorDatabaseFindFailed');
			};

			client.close();

			return callback(result.ops.pop());
		});
	});
};
