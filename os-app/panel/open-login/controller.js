/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var sharedController = require('../../_shared/controller');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCLoginRoute: {
			OLSKRoutePath: '/login',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCLoginAction,
			OLSKRouteLanguages: ['en'],
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareEnsureDatabase',
			],
		},
		WKCLoginSubmitRoute: {
			OLSKRoutePath: '/login',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.WKCLoginSubmitAction,
			OLSKRouteLanguages: ['en'],
		},
		WKCLoginDestroyRoute: {
			OLSKRoutePath: '/logout',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCLoginDestroyAction,
			OLSKRouteLanguages: ['en'],
		},
	};
};

//_ OLSKControllerSharedMiddlewares

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		WKCSharedMiddlewareAuthenticate: [
			sharedController.WKCSharedMiddlewareEnsureDatabase,
			exports.WKCLoginMiddlewareAuthenticate,
		],
	};
};

//_ WKCLoginMiddlewareAuthenticate

exports.WKCLoginMiddlewareAuthenticate = function(req, res, next) {
	if (!req.session.WKCInsecureSessionToken || !req.session.WKCInsecureSessionToken.trim()) {
		return res.redirect([
			exports.OLSKControllerRoutes().WKCLoginRoute.OLSKRoutePath,
			req.originalUrl ? encodeURIComponent(req.originalUrl) : undefined,
		].filter(function (e) {
			return !!e;
		}).join('?returnPath='));
	}

	return next();
};

//_ WKCLoginAction

exports.WKCLoginAction = function(req, res, next) {
	return res.render([
		__dirname,
		'view',
	].join('/'), {
		WKCLoginReturnPath: req.query.returnPath || undefined,
	});
};

//_ WKCLoginSubmitAction

exports.WKCLoginSubmitAction = function(req, res, next) {
	if (!process.env.WKC_SHARED_DATABASE_NAME) {
		throw new Error('WKCErrorMissingDatabaseName');
	}

	if (!req.body.WKCLoginUsername || !req.body.WKCLoginUsername.trim()) {
		return res.redirect(res.locals.OLSKCanonicalFor('WKCLoginRoute'));
	}

	if (!req.body.WKCLoginPassword || !req.body.WKCLoginPassword.trim()) {
		return res.redirect(res.locals.OLSKCanonicalFor('WKCLoginRoute'));
	}

	return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_members').find({}).toArray(function(err, items) {
		if (err) {
			throw new Error('WKCErrorDatabaseFindFailed');
		}

		var memberObject = items.filter(function(e) {
			return req.body.WKCLoginUsername === e.WKCMemberHandle && req.body.WKCLoginPassword === e.WKCMemberInsecurePassword;
		}).pop();

		if (!memberObject) {
			return res.render([
				__dirname,
				'index',
			].join('/'), {
				WKCLoginUsername: req.body.WKCLoginUsername,
				WKCLoginError: true,
				WKCLoginReturnPath: req.body.WKCLoginReturnPath,
			});
		}

		req.session.WKCInsecureSessionToken = memberObject.WKCMemberHandle;

		return res.redirect(req.body.WKCLoginReturnPath ? decodeURIComponent(req.body.WKCLoginReturnPath) : res.locals.OLSKCanonicalFor('WKCWriteRoute'));
	});
};

//_ WKCLoginDestroyAction

exports.WKCLoginDestroyAction = function(req, res, next) {
	req.session = null;

	return res.redirect(res.locals.OLSKCanonicalFor('WKCRouteHome'));
};
