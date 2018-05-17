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
	};
};

//_ OLSKControllerSharedMiddlewares

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		WKCSharedMiddlewareAPIAuthenticate: exports.WKCAPIMiddlewareAuthenticate,
		WKCSharedMiddlewareAPIErrorHandler: exports.WKCAPIMiddlewareErrorHandler,
	};
};

//_ WKCAPIMiddlewareAuthenticate

exports.WKCAPIMiddlewareAuthenticate = function(req, res, next) {
	if (!req.headers['x-client-key'] || req.headers['x-client-key'].trim() === '') {
		return next(new exports.WKCAPIClientError('WKCAPIClientErrorTokenNotSet'));
	}

	if (req.headers['x-client-key'] !== process.env.WKC_INSECURE_API_ACCESS_TOKEN) {
		return next(new exports.WKCAPIClientError('WKCAPIClientErrorTokenNotValid'));
	}

	return next();
};

//_ WKCAPISystemError

exports.WKCAPISystemError = class WKCAPISystemError extends Error {};

//_ WKCAPIClientError

exports.WKCAPIClientError = class WKCAPIClientError extends Error {};

//_ WKCAPIMiddlewareErrorHandler

exports.WKCAPIMiddlewareErrorHandler = function(err, req, res, next) {
	if (err instanceof exports.WKCAPISystemError) {
		return res.json({
			WKCAPISystemError: err.message,
		});
	}
	if (err instanceof exports.WKCAPIClientError) {
		return res.json({
			WKCAPIClientError: err.message,
		});
	}

	return next(err);
};

exports.WKCActionAPIRoot = function(req, res, next) {
	return res.text('Successfully authenticated');
};
