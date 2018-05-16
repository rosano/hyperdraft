/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const persistenceLibrary = require('../_shared/persistence');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteLogin: {
			OLSKRoutePath: '/login',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionLoginIndex,
			OLSKRouteLanguages: ['en'],
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareEnsureDatabase',
			],
		},
		WKCRouteLoginSubmit: {
			OLSKRoutePath: '/login',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.WKCActionLoginSubmit,
			OLSKRouteLanguages: ['en'],
		},
		WKCRouteLoginDestroy: {
			OLSKRoutePath: '/logout',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionLoginDestroy,
			OLSKRouteLanguages: ['en'],
		},
	};
};

//_ OLSKControllerSharedMiddlewares

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		WKCSharedMiddlewareAuthenticate: exports.WKCLoginMiddlewareAuthenticate,
	};
};

//_ WKCLoginMiddlewareAuthenticate

exports.WKCLoginMiddlewareAuthenticate = function(req, res, next) {
	if (!req.session.WKCInsecureSessionToken || !req.session.WKCInsecureSessionToken.trim()) {
		return res.redirect(exports.OLSKControllerRoutes().WKCRouteLogin.OLSKRoutePath);
	}

	return next();
};

//_ WKCActionLoginIndex

exports.WKCActionLoginIndex = function(req, res, next) {
	res.render([
		res.locals.OLSKSharedPageControllerSlug,
		'index',
	].join('/'), {});
};

//_ WKCActionLoginSubmit

exports.WKCActionLoginSubmit = function(req, res, next) {
	return persistenceLibrary.WKCPersistenceMembers(function(items) {
		var memberObject = items.filter(function(e) {
			return req.body.WKCLoginUsername === e.WKCMemberHandle && req.body.WKCLoginPassword === e.WKCMemberInsecurePassword;
		}).pop();

		if (!memberObject) {
			return res.render([
				res.locals.OLSKSharedPageControllerSlug,
				'index',
			].join('/'), {
				WKCLoginUsername: req.body.WKCLoginUsername,
				WKCLoginError: true,
			});
		}

		req.session.WKCInsecureSessionToken = memberObject.WKCMemberHandle;

		return res.redirect(res.locals.OLSKCanonicalFor('WKCRouteNotes'));
	});
};

//_ WKCActionLoginDestroy

exports.WKCActionLoginDestroy = function(req, res, next) {
	req.session = null;

	return res.redirect(res.locals.OLSKCanonicalFor('WKCRouteHome'));
};
