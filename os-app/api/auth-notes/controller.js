/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const metalLibrary = require('./metal.js');
const actionLibrary = require('./action.js');

var modelLibrary = require('./model');
const versionsModelLibrary = require('../auth-versions/model.js');

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
		WKCRouteAPINotesUpdate: {
			OLSKRoutePath: '/api/notes/:wkc_note_id',
			OLSKRouteMethod: 'put',
			OLSKRouteFunction: exports.WKCActionAPINotesUpdate,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPINotesDelete: {
			OLSKRoutePath: '/api/notes/:wkc_note_id',
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
		WKCRouteAPINotesVersion: {
			OLSKRoutePath: '/api/notes/:wkc_note_id/version',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.WKCAPINotesVersionAction,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPINotesPublish: {
			OLSKRoutePath: '/api/notes/:wkc_note_id/publish',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCAPINotesPublishAction,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPINotesUnpublish: {
			OLSKRoutePath: '/api/notes/:wkc_note_id/unpublish',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCAPINotesUnpublishAction,
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
	return next(new Error('WKCAPIClientErrorNotAvailable'));

	let outputData = await metalLibrary.WKCNotesMetalUpdate(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_note_id, req.body);

	if (!outputData) {
		return next(new Error('WKCAPIClientErrorNotFound'));
	}

	if (outputData.WKCErrors) {
		res.status(400);
	}

	return res.json(outputData);
};

//_ WKCAPINotesVersionAction

exports.WKCAPINotesVersionAction = async function(req, res, next) {
	let outputData = await actionLibrary.WKCNotesActionVersion(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, versionsModelLibrary.WKCVersionsModelPrepare(req.body));
	
	if (outputData instanceof Error) {
		return next(new Error('WKCAPIClientErrorNotFound'));
	}

	return res.json(outputData);
};

//_ WKCAPINotesPublishAction

exports.WKCAPINotesPublishAction = async function(req, res, next) {
	let outputData = await actionLibrary.WKCNotesActionPublish(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_note_id);
	
	if (outputData instanceof Error) {
		return next(new Error('WKCAPIClientErrorNotFound'));
	}

	return res.json(outputData);
};

//_ WKCAPINotesUnpublishAction

exports.WKCAPINotesUnpublishAction = async function(req, res, next) {
	let outputData = await actionLibrary.WKCNotesActionUnpublish(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_note_id);
	
	if (outputData instanceof Error) {
		return next(new Error('WKCAPIClientErrorNotFound'));
	}

	return res.json(outputData);
};

//_ WKCAPINotesDeleteAction

exports.WKCAPINotesDeleteAction = async function(req, res, next) {
	let outputData = await actionLibrary.WKCNotesActionDelete(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_note_id);
	
	if (outputData !== true) {
		return next(new Error('WKCAPIClientErrorNotFound'));
	}

	return res.json(outputData);
};

//_ WKCAPINotesSearchAction

exports.WKCAPINotesSearchAction = async function(req, res, next) {
	return res.json(await metalLibrary.WKCNotesMetalQuery(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.body));
};
