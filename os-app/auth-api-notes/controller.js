/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var modelLibrary = require('./model');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteAPINotesCreate: {
			OLSKRoutePath: '/api/notes',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.WKCActionAPINotesCreate,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPINotesRead: {
			OLSKRoutePath: '/api/notes/:wkc_note_id',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionAPINotesRead,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
	};
};

//_ WKCAPISettingsLastRepoIDWithClientAndCallback

exports.WKCAPISettingsLastRepoIDWithClientAndCallback = function(client, callback) {
	if (!client) {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof callback !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	return client.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_settings').findOne({
		WKCSettingsKey: 'WKCSettingsLastRepoID',
	}, function(err, result) {
		if (err) {
			throw new Error('WKCErrorDatabaseFind');
		}

		if (!result) {
			return callback(0);
		}

		return callback(result.WKCSettingsValue);
	});
};

//_ WKCActionAPINotesCreate

exports.WKCActionAPINotesCreate = function(req, res, next) {
	var inputData = req.body;

	if (!modelLibrary.WKCModelInputDataIsNotesObject(inputData)) {
		return res.json(inputData);
	}

	var noteDate = new Date();
	var client = req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient;

	return exports.WKCAPISettingsLastRepoIDWithClientAndCallback(client, function(lastRepoID) {
		var newRepoID = lastRepoID + 1;

		return client.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').insertOne(Object.assign(inputData, {
			WKCNoteID: newRepoID,
			WKCNoteDateCreated: noteDate,
			WKCNoteDateUpdated: noteDate,
		}), function(err, result) {
			if (err) {
				throw new Error('WKCErrorDatabaseCreate');
			}

			return client.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_settings').findOneAndUpdate({
				WKCSettingsKey: 'WKCSettingsLastRepoID',
			}, {
				WKCSettingsKey: 'WKCSettingsLastRepoID',
				WKCSettingsValue: newRepoID,
			}, {
				upsert: true,
			}, function(err) {
				if (err) {
					throw err;
				}

				return res.json(result.ops.pop());
			});
		});
	});
};

//_ WKCActionAPINotesRead

exports.WKCActionAPINotesRead = function(req, res, next) {
	return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').findOne({
		WKCNoteID: req.params.wkc_note_id,
	}, function(err, result) {
		if (err) {
			throw new Error('WKCErrorDatabaseFindOne');
		}

		if (!result) {
			return next(new (class WKCAPIClientError extends Error {})('WKCAPIClientErrorNotFound'));
		}

		return res.json(result);
	});
};
