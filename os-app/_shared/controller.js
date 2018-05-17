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
	var mongodbPackage = require('mongodb');

	mongodbPackage.MongoClient.connect(process.env.WKC_DATABASE_URL, function(err, client) {
		if (err) {
			return olskCallback(err);
		}

		return olskCallback(null, client);
	});
};

//_ WKCSharedConnectionCleanupMongo

exports.WKCSharedConnectionCleanupMongo = function(client) {
	return client.close();
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
