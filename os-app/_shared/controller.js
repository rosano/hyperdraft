/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ OLSKControllerSharedConnections

exports.OLSKControllerSharedConnections = function() {
	return {
		WKCSharedConnectionMongo: {
			OLSKConnectionInitializer: exports.WKCSharedConnectionInitializerMongo,
			OLSKConnectionCleanup: exports.WKCSharedConnectionCleanupMongo,
		},
	};
};

//_ WKCSharedConnectionInitializerMongo

exports.WKCSharedConnectionInitializerMongo = function(olskCallback) {
};

//_ WKCSharedConnectionCleanupMongo

exports.WKCSharedConnectionCleanupMongo = function(client) {
};

//_ OLSKControllerSharedMiddlewares

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		WKCSharedMiddlewareEnsureDatabase: exports.WKCSharedMiddlewareEnsureDatabase,
	};
};

//_ WKCSharedMiddlewareEnsureDatabase

exports.WKCSharedMiddlewareEnsureDatabase = function(req, res, next) {
	if (!req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionAttempted) {
		return next(new Error('WKCErrorConnectionNotAttempted'));
	}

	if (req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionError) {
		return next(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionError);
	}

	return next();
};
