/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ OLSKControllerSharedConnections

exports.OLSKControllerSharedConnections = function() {
	return {
		WKCSharedConnectionMongo: exports.WKCSharedConnectionInitializerMongo,
	};
};

//_ OLSKControllerSharedMiddlewares

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		WKCSharedMiddlewareEnsureDatabase: exports.WKCSharedMiddlewareEnsureDatabase,
	};
};
