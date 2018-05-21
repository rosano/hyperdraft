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
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPIToken: {
			OLSKRoutePath: '/api/token',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionAPIToken,
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
		return next(new Error('WKCAPIClientErrorTokenNotSet'));
	}

	if (req.headers['x-client-key'] !== process.env.WKC_INSECURE_API_ACCESS_TOKEN) {
		return next(new Error('WKCAPIClientErrorTokenNotValid'));
	}

	return next();
};

//_ OLSKControllerSharedErrorHandlers

exports.OLSKControllerSharedErrorHandlers = function() {
	return [
		exports.WKCAPIErrorHandler,
	];
};

//_ WKCAPIErrorHandler

exports.WKCAPIErrorHandler = function(err, req, res, next) {
	if (err.message.indexOf('WKCAPISystemError') === 0) {
		return res.json({
			WKCAPISystemError: err.message,
		});
	}
	
	if (err.message.indexOf('WKCAPIClientError') === 0) {
		return res.json({
			WKCAPIClientError: err.message,
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
