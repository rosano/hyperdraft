/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

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
	res.render(res.locals.OLSKSharedPageControllerSlug + '/form', {
	});
};
