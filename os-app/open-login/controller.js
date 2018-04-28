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
	};
};

exports.index = function (req, res, next) {
	res.render(res.locals.OLSKSharedPageControllerSlug + '/form', {
	});
};

exports.submit = function (req, res, next) {
	return persistenceLibrary.WKCPersistenceMembers(function(items) {
		var memberObject = items.filter(function(e) {
			return req.body.username === e.WKCMemberHandle && req.body.password === e.WKCMemberPlaintextPassword; 
		}).pop();

		if (!memberObject) {
			return res.render(res.locals.OLSKSharedPageControllerSlug + '/form', {
				WKCLoginUsername: req.body.username,
				WKCLoginError: true,
			});
		}

		res.send('test');
	})
};
