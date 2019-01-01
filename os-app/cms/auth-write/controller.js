/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCWriteRoute: {
			OLSKRoutePath: '/cms/write',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCWriteAction,
			OLSKRouteLanguages: ['en'],
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAuthenticate',
			],
		},
		WKCWriteLegacyRoute: {
			OLSKRoutePath: '/cms',
			OLSKRouteMethod: 'get',
			OLSKRouteRedirect: '/cms/write',
		},
	};
};

//_ WKCWriteAction

exports.WKCWriteAction = function(req, res, next) {
	return res.render([
		__dirname,
		'view',
	].join('/'), {});
};
