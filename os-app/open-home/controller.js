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
			OLSKRouteFunction: exports.WKCActionHomeIndex,
			OLSKRouteLanguages: ['en'],
		},
	};
};

//_ WKCActionHomeIndex

exports.WKCActionHomeIndex = function(req, res, next) {
	return res.render([
		res.locals.OLSKSharedPageControllerSlug,
		'index',
	].join('/'), {});
};
