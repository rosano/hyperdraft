/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const persistenceLibrary = require('../_shared/persistence');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteAPIRoot: {
			OLSKRoutePath: '/api/',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.WKCActionAPIRoot,
			OLSKRouteMiddlewares: ['WKCSharedMiddlewareAPIAuthenticate'],
		},
		WKCRouteAPINotesAdd: {
			OLSKRoutePath: '/api/notes',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.index,
			OLSKRouteMiddlewares: ['WKCSharedMiddlewareAPIAuthenticate'],
		},
	};
};

//_ OLSKControllerSharedMiddlewares

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		WKCSharedMiddlewareAPIAuthenticate: exports.WKCAPIMiddlewareAuthenticate,
	};
};

//_ WKCAPIMiddlewareAuthenticate

exports.WKCAPIMiddlewareAuthenticate = function(req, res, next) {
	if (!req.headers['x-client-key'] || req.headers['x-client-key'].trim() === '') {
		return res.json({
			WKCError: 'API Token Not Set',
		});
	}
	
	if (req.headers['x-client-key'] !== ['Bearer', process.env.WKC_INSECURE_API_ACCESS_TOKEN].join(' ')) {
		return res.json({
			WKCError: 'Invalid access token',
		});
	}

	return next();
};

exports.WKCActionAPIRoot = function(req, res, next) {
	return res.text('Successfully authenticated');
};

exports.index = function(req, res, next) {
	return persistenceLibrary.WKCPersistenceNotesAdd(function(item) {
		return res.json({
			WKCNewItem: item,
		});
	});
};
