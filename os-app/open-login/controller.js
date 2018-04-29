/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const persistenceLibrary = require('../_shared/persistence')

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function () {
	return {
		WKCRouteLogin: {
			OLSKRoutePath: '/login',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.index,
			OLSKRouteLanguages: ['en'],
		},
		WKCRouteLoginSubmit: {
			OLSKRoutePath: '/login',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.submit,
			OLSKRouteLanguages: ['en'],
		},
		WKCRouteLoginDestroy: {
			OLSKRoutePath: '/logout',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.destroy,
			OLSKRouteLanguages: ['en'],
		},
	};
};

exports.index = function (req, res, next) {
	res.render(res.locals.OLSKSharedPageControllerSlug + '/index', {
	});
};

exports.submit = function (req, res, next) {
	return persistenceLibrary.WKCPersistenceMembers(function(items) {
		var memberObject = items.filter(function(e) {
			return req.body.WKCLoginUsername === e.WKCMemberHandle && req.body.WKCLoginPassword === e.WKCMemberPlaintextPassword; 
		}).pop();

		if (!memberObject) {
			return res.render(res.locals.OLSKSharedPageControllerSlug + '/index', {
				WKCLoginUsername: req.body.WKCLoginUsername,
				WKCLoginError: true,
			});
		}

		req.session.WKCInsecureSessionToken = memberObject.WKCMemberHandle;

		return res.redirect(res.locals.OLSKCanonicalFor('WKCRouteNotes'));
	})
};

exports.destroy = function (req, res, next) {
	req.session = null;

	return res.redirect(res.locals.OLSKCanonicalFor('WKCRouteHome'));
};
