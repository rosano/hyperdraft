/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var modelLibrary = require('./model');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteAPINotesAdd: {
			OLSKRoutePath: '/api/notes',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.WKCActionAPINotesCreate,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
	};
};

//_ WKCActionAPINotesCreate

exports.WKCActionAPINotesCreate = function(req, res, next) {
	var inputData = req.body;

	if (!modelLibrary.WKCModelInputDataIsNotesObject(inputData)) {
		return res.json(inputData);
	}

	var noteDate = new Date();
	return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_notes').insertOne(Object.assign(inputData, {
		WKCNoteDateCreated: noteDate,
		WKCNoteDateUpdated: noteDate,
	}), function(err, result) {
		if (err) {
			throw new Error('WKCErrorDatabaseCreate');
		}

		return res.json(result.ops.pop());
	});
};
