/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const OLSKIdentifier = require('OLSKIdentifier');

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
			OLSKRoutePath: '/api/notes/:wkc_note_id(\\d+)',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionAPINotesRead,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPINotesUpdate: {
			OLSKRoutePath: '/api/notes/:wkc_note_id(\\d+)',
			OLSKRouteMethod: 'put',
			OLSKRouteFunction: exports.WKCActionAPINotesUpdate,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPINotesPublish: {
			OLSKRoutePath: '/api/notes/:wkc_note_id(\\d+)/publish',
			OLSKRouteMethod: 'put',
			OLSKRouteFunction: exports.WKCActionAPINotesPublish,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
				'WKCSharedMiddlewareAPINotesFindByID',
			],
		},
		WKCRouteAPINotesPublicRead: {
			OLSKRoutePath: '/api/notes/:wkc_note_public_id(\\d+)',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionAPINotesPublicRead,
		},
		WKCRouteAPINotesDelete: {
			OLSKRoutePath: '/api/notes/:wkc_note_id(\\d+)',
			OLSKRouteMethod: 'delete',
			OLSKRouteFunction: exports.WKCActionAPINotesDelete,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPINotesSearch: {
			OLSKRoutePath: '/api/notes/search',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionAPINotesSearch,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
	};
};

//_ OLSKControllerSharedMiddlewares

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		WKCSharedMiddlewareAPINotesFindByID: exports.WKCAPINotesMiddlewareFindByID,
	};
};

//_ WKCAPINotesMiddlewareFindByID

exports.WKCAPINotesMiddlewareFindByID = function(req, res, next) {
	if (!req.params.wkc_note_id || !req.params.wkc_note_id.trim()) {
		return next(new Error('WKCAPIClientErrorNotFound'));
	}

	return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').findOne({
		WKCNoteID: parseInt(req.params.wkc_note_id),
	}, function(err, result) {
		if (err) {
			throw new Error('WKCErrorDatabaseFindOne');
		}

		if (!result) {
			return next(new Error('WKCAPIClientErrorNotFound'));
		}

		var noteObject = result;

		modelLibrary.WKCModelNotesHiddenPropertyNames().forEach(function(obj) {
			delete noteObject[obj];
		});

		req._WKCAPINotesMiddlewareFindByIDResult = noteObject;

		return next();
	});
};

//_ WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback

exports.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback = function(client, callback) {
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

	return OLSKIdentifier.OLSKIdentifierTimeBased().then(function (id) {
		var noteDate = new Date();
		return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').insertOne(Object.assign(inputData, {
			WKCNoteID: (new Date()) * 1,
			WKCNoteID2: id,
			WKCNoteDateCreated: noteDate,
			WKCNoteDateUpdated: noteDate,
		}), function(err, result) {
			if (err) {
				throw new Error('WKCErrorDatabaseCreate');
			}

			var noteObject = result.ops.pop();

			modelLibrary.WKCModelNotesHiddenPropertyNames().forEach(function(obj) {
				delete noteObject[obj];
			});

			return res.json(noteObject);
		});
	});
};

//_ WKCActionAPINotesRead

exports.WKCActionAPINotesRead = function(req, res, next) {
	return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').findOne({
		WKCNoteID: parseInt(req.params.wkc_note_id),
	}, function(err, result) {
		if (err) {
			throw new Error('WKCErrorDatabaseFindOne');
		}

		if (!result) {
			return next(new Error('WKCAPIClientErrorNotFound'));
		}

		var noteObject = result;

		modelLibrary.WKCModelNotesHiddenPropertyNames().forEach(function(obj) {
			delete noteObject[obj];
		});

		return res.json(noteObject);
	});
};

//_ WKCActionAPINotesUpdate

exports.WKCActionAPINotesUpdate = function(req, res, next) {
	var inputData = req.body;

	if (!modelLibrary.WKCModelInputDataIsNotesObject(inputData)) {
		return res.json(inputData);
	}

	return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').findOneAndUpdate({
		WKCNoteID: parseInt(req.params.wkc_note_id),
	}, {
		'$set': Object.assign(inputData, {
			WKCNoteDateUpdated: new Date(),
		}),
	}, function(err, result) {
		if (err) {
			throw new Error('WKCErrorDatabaseFindOne');
		}

		if (!result.value) {
			return next(new Error('WKCAPIClientErrorNotFound'));
		}

		return res.json(inputData);
	});
};

//_ WKCActionAPINotesPublish

exports.WKCActionAPINotesPublish = function(req, res, next) {
	var inputData = Object.assign({}, req.body);

	if (!modelLibrary.WKCModelInputDataIsNotePublishStatusObject(inputData)) {
		return res.json(inputData);
	}

	var completionHandler = function() {
		return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').findOneAndUpdate({
			WKCNoteID: parseInt(req.params.wkc_note_id),
		}, {
			'$set': Object.assign(req._WKCAPINotesMiddlewareFindByIDResult, {
				WKCNoteIsPublished: inputData.WKCNotePublishStatusIsPublished,
				WKCNoteDateUpdated: new Date(),
			}),
		}, function(err, result) {
			if (err) {
				throw new Error('WKCErrorDatabaseFindOne');
			}

			if (!result.value) {
				return next(new Error('WKCAPIClientErrorNotFound'));
			}

			return res.json(req.body);
		});
	};

	if (inputData.WKCNotePublishStatusIsPublished && !req._WKCAPINotesMiddlewareFindByIDResult.WKCNotePublicID) {
		return exports.WKCAPISettingsLastGeneratedPublicIDWithClientAndCallback(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, function(lastRepoID) {
			var newRepoID = lastRepoID + 1;

			Object.assign(req._WKCAPINotesMiddlewareFindByIDResult, {
				WKCNotePublicID: newRepoID,
			});

			return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_settings').findOneAndUpdate({
				WKCSettingsKey: 'WKCSettingsLastRepoID',
			}, {
				'$set': {
					WKCSettingsKey: 'WKCSettingsLastRepoID',
					WKCSettingsValue: newRepoID,
				},
			}, {
				upsert: true,
			}, function(err) {
				if (err) {
					throw err;
				}

				return completionHandler();
			});
		});
	}

	return completionHandler();
};

//_ WKCActionAPINotesPublicRead

exports.WKCActionAPINotesPublicRead = function(req, res, next) {
	return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').findOne({
		WKCNotePublicID: parseInt(req.params.wkc_note_public_id),
	}, function(err, result) {
		if (err) {
			throw new Error('WKCErrorDatabaseFindOne');
		}

		if (!result) {
			return next(new Error('WKCAPIClientErrorNotFound'));
		}

		var noteObject = {};

		modelLibrary.WKCModelNotesPublicPropertyNames().forEach(function(obj) {
			noteObject[obj] = result[obj];
		});

		noteObject.WKCNoteDetectedTitle = modelLibrary.WKCModelNoteDetectedTitleFor(noteObject.WKCNoteBody);
		noteObject.WKCNoteDetectedBody = modelLibrary.WKCModelNoteDetectedBodyFor(noteObject.WKCNoteBody);

		return res.json(noteObject);
	});
};

//_ WKCActionAPINotesDelete

exports.WKCActionAPINotesDelete = function(req, res, next) {
	return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').deleteOne({
		WKCNoteID: parseInt(req.params.wkc_note_id),
	}, function(err, result) {
		if (err) {
			throw new Error('WKCErrorDatabaseFindOne');
		}

		if (!result.result.n) {
			return next(new Error('WKCAPIClientErrorNotFound'));
		}

		return res.json({
			WKCAPIResponse: true,
		});
	});
};

//_ WKCActionAPINotesSearch

exports.WKCActionAPINotesSearch = function(req, res, next) {
	return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').find({}).project(modelLibrary.WKCModelNotesHiddenPropertyNames().reduce(function(hash, e) {
		hash[e] = 0;

		return hash;
	}, {})).toArray(function(err, items) {
		if (err) {
			throw new Error('WKCErrorDatabaseFind');
		}

		return res.json(items);
	});
};
