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

	mongodbPackage.MongoClient.connect(process.env.KVC_DATABASE_URL, {
		useNewUrlParser: true,
	}, function(err, client) {
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

//_ OLSKControllerSharedStaticAssetFolders

exports.OLSKControllerSharedStaticAssetFolders = function() {
	return [
		'_shared/__external',
	];
};

//_ OLSKControllerSharedMiddlewares

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		WKCSharedMiddlewareEnsureDatabase: exports.WKCSharedMiddlewareEnsureDatabase,
		WKCSharedDonateLinkGuardMiddleware (req, res, next) {
			return next(require('./logic.js').WKCSharedDonateLinkGuard(process.env));
		},
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
