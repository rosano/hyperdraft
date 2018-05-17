/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteAPIRoot: {
			OLSKRoutePath: '/api/',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionAPIRoot,
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

	if (req.headers['x-client-key'] !== process.env.WKC_INSECURE_API_ACCESS_TOKEN) {
		return res.json({
			WKCError: 'Invalid access token',
		});
	}

	return next();
};

exports.WKCActionAPIRoot = function(req, res, next) {
	return res.text('Successfully authenticated');
};
