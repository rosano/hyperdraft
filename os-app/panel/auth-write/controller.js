/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCWriteRoute: {
			OLSKRoutePath: '/panel/write',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCWriteAction,
			OLSKRouteLanguages: ['en'],
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAuthenticate',
			],
		},
	};
};

//_ WKCWriteAction

exports.WKCWriteAction = function(req, res, next) {
	return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'view'), {});
};
