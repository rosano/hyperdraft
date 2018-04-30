/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteHome: {
			OLSKRoutePath: '/',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.index,
			OLSKRouteLanguages: ['en'],
		},
	};
};

exports.index = function(req, res, next) {
	res.render([
		res.locals.OLSKSharedPageControllerSlug,
		'index',
	].join('/'), {});
};
