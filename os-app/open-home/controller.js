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
		WKCRouteRefsRead: {
			OLSKRoutePath: '/:wkc_note_id(\\d+)',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionRefsRead,
		},
	};
};

//_ WKCActionHomeIndex

exports.WKCActionHomeIndex = function(req, res, next) {
	return res.render([
		__dirname,
		'index',
	].join('/'), {});
};
