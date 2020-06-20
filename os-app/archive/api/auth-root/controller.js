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
			OLSKRouteMiddlewares: [
				'KVCSharedMiddlewareAuthenticate',
				'KVCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPIToken: {
			OLSKRoutePath: '/api/token',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionAPIToken,
			OLSKRouteMiddlewares: [
				'KVCSharedMiddlewareAuthenticate',
			],
		},
	};
};

//_ OLSKControllerSharedMiddlewares

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		KVCSharedMiddlewareAPIAuthenticate: exports.WKCAPIMiddlewareAuthenticate,
	};
};

//_ WKCAPIMiddlewareAuthenticate

exports.WKCAPIMiddlewareAuthenticate = function(req, res, next) {
	if (!req.headers['x-client-key'] || req.headers['x-client-key'].trim() === '') {
		return next(new Error('WKCAPIClientErrorAuthenticationTokenNotSet'));
	}

	if (req.headers['x-client-key'] !== process.env.WKC_INSECURE_API_ACCESS_TOKEN) {
		return next(new Error('WKCAPIClientErrorAuthenticationTokenNotValid'));
	}

	return next();
};

//_ OLSKControllerSharedErrorHandlers

exports.OLSKControllerSharedErrorHandlers = function() {
	return [
		// exports.WKCAPIErrorHandler,
	];
};

//_ WKCAPIErrorHandler

exports.WKCAPIErrorHandler = function(err, req, res, next) {
	res.status(err.message.indexOf('WKCAPIClientErrorAuthentication') === 0 ? 401 : 500);

	if (err.message.indexOf('WKCAPIClientError') === 0) {
		if (!err.message.includes('NotFound')) {
			res.status(404);
		}
		
		return res.json({
			WKCAPIClientError: err.message,
		});
	}

	if (err.message.indexOf('WKCAPISystemError') === 0) {
		return res.json({
			WKCAPISystemError: err.message,
		});
	}

	return next(err);
};

//_ WKCActionAPIRoot

exports.WKCActionAPIRoot = function(req, res, next) {
	return res.json({
		WKCAPIResponse: 'Successfully authenticated',
	});
};

//_ WKCActionAPIToken

exports.WKCActionAPIToken = function(req, res, next) {
	return res.json({
		WKCAPIToken: process.env.WKC_INSECURE_API_ACCESS_TOKEN,
	});
};
