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
		},
	};
};

//_ WKCActionNotesIndex

exports.WKCActionNotesIndex = function(req, res, next) {
	if (!req.session.WKCInsecureSessionToken) {
		return res.redirect(res.locals.OLSKCanonicalFor('WKCRouteLogin'));
	}

	res.render([
		res.locals.OLSKSharedPageControllerSlug,
		'index',
	].join('/'), {
		WKCNotesInsecureAPIToken: req.session.WKCInsecureSessionToken,
	});
};
