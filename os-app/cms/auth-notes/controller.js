/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteNotes: {
			OLSKRoutePath: '/notes',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionNotesIndex,
			OLSKRouteLanguages: ['en'],
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAuthenticate',
			],
		},
	};
};

//_ WKCActionNotesIndex

exports.WKCActionNotesIndex = function(req, res, next) {
	return res.render([
		__dirname,
		'index',
	].join('/'), {
		WKCNotesInsecureAPIToken: process.env.WKC_INSECURE_API_ACCESS_TOKEN,
	});
};
