exports.OLSKControllerRoutes = function() {
	return {
		KVCCommonIdentityRedirect: {
			OLSKRoutePath: '/identity.svg',
			OLSKRouteMethod: 'get',
			OLSKRouteRedirect: '/_shared/KVCRootLink/ui-assets/identity.svg',
		},
	};
};

//_ OLSKControllerSharedConnections

exports.OLSKControllerSharedConnections = function() {
	return {
		KVCSharedConnectionMongo: {
			OLSKConnectionInitializer: exports.KVCSharedConnectionInitializerMongo,
			OLSKConnectionCleanup: exports.KVCSharedConnectionCleanupMongo,
		},
	};
};

//_ KVCSharedConnectionInitializerMongo

exports.KVCSharedConnectionInitializerMongo = function(olskCallback) {
	var mongodbPackage = require('mongodb');

	mongodbPackage.MongoClient.connect(process.env.WKC_DATABASE_URL, {
		useNewUrlParser: true,
	}, function(err, client) {
		if (err) {
			return olskCallback(err);
		}

		return olskCallback(null, client);
	});
};

//_ KVCSharedConnectionCleanupMongo

exports.KVCSharedConnectionCleanupMongo = function(client) {
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
		KVCSharedMiddlewareEnsureDatabase: exports.KVCSharedMiddlewareEnsureDatabase,
		KVCSharedDonateLinkGuardMiddleware (req, res, next) {
			return next(require('./logic.js').KVCSharedDonateLinkGuard(process.env));
		},
		KVCSharedGitHubLinkGuardMiddleware (req, res, next) {
			return next(require('./logic.js').KVCSharedGitHubLinkGuard(process.env));
		},
	};
};

//_ KVCSharedMiddlewareEnsureDatabase

exports.KVCSharedMiddlewareEnsureDatabase = function(req, res, next) {
	if (!req.OLSKSharedConnectionFor('KVCSharedConnectionMongo').OLSKConnectionAttempted) {
		return next(new Error('KVCErrorConnectionNotAttempted'));
	}

	if (req.OLSKSharedConnectionFor('KVCSharedConnectionMongo').OLSKConnectionError) {
		return next(req.OLSKSharedConnectionFor('KVCSharedConnectionMongo').OLSKConnectionError);
	}

	return next();
};
