/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const OLSKIdentifier = require('OLSKIdentifier');

const WKCParser = require('../../_shared/WKCParser/main.js');

const metalLibrary = require('./metal.js');
const actionLibrary = require('./action.js');
const versionsMetal = require('../auth-versions/metal.js');

var modelLibrary = require('./model');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteAPINotesCreate: {
			OLSKRoutePath: '/api/notes',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.WKCAPINotesCreateAction,
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
			OLSKRouteFunction: exports.WKCAPINotesPublishAction,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
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
			OLSKRouteFunction: exports.WKCAPINotesDeleteAction,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPINotesSearch: {
			OLSKRoutePath: '/api/notes/search',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCAPINotesSearchAction,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
	};
};

//_ WKCAPINotesCreateAction

exports.WKCAPINotesCreateAction = async function(req, res, next) {
	let outputData = await metalLibrary.WKCNotesMetalCreate(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.body);

	if (outputData.WKCErrors) {
		res.status(400);
	}

	return res.json(outputData);
};

//_ WKCActionAPINotesUpdate

exports.WKCActionAPINotesUpdate = async function(req, res, next) {
	let outputData = await metalLibrary.WKCNotesMetalUpdate(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_note_id, req.body);

	if (!outputData) {
		return next(new Error('WKCAPIClientErrorNotFound'));
	}

	if (outputData.WKCErrors) {
		res.status(400);
	}

	return res.json(outputData);
};

//_ WKCAPINotesPublishAction

exports.WKCAPINotesPublishAction = async function(req, res, next) {
	let outputData = await actionLibrary.WKCNotesActionPublish(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_note_id);
	
	if (modelLibrary.WKCNotesModelErrorsFor(outputData)) {
		return next(new Error('WKCAPIClientErrorNotFound'));
	}

	return res.json(outputData);
};

//_ WKCActionAPINotesPublicRead

exports.WKCActionAPINotesPublicRead = function(req, res, next) {
	// let outputData = await metalLibrary.WKCNotesMetalRead(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_note_id);

	// if (!outputData) {
	// 	return next(new Error('WKCAPIClientErrorNotFound'));
	// }

	// return res.json(Object.assign(outputData, {
	// 	WKCNoteDetectedTitle: WKCParser.WKCParserTitleForPlaintext(outputData.WKCNoteBody),
	// 	WKCNoteDetectedBody: WKCParser.WKCParserBodyForPlaintext(outputData.WKCNoteBody),
	// }));

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

		noteObject.WKCNoteDetectedTitle = WKCParser.WKCParserTitleForPlaintext(noteObject.WKCNoteBody);
		noteObject.WKCNoteDetectedBody = WKCParser.WKCParserBodyForPlaintext(noteObject.WKCNoteBody);

		return res.json(noteObject);
	});
};

//_ WKCAPINotesDeleteAction

exports.WKCAPINotesDeleteAction = async function(req, res, next) {
	let outputData = await metalLibrary.WKCNotesMetalDelete(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_note_id);
	
	if (outputData !== true) {
		return next(new Error('WKCAPIClientErrorNotFound'));
	}

	return res.json(outputData);
};

//_ WKCAPINotesSearchAction

exports.WKCAPINotesSearchAction = async function(req, res, next) {
	return res.json(await metalLibrary.WKCNotesMetalSearch(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.body));
};
