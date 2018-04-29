/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function () {
	return {
		WKCRouteNotes: {
			OLSKRoutePath: '/notes',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.index,
			OLSKRouteLanguages: ['en'],
		},
	};
};

exports.index = function (req, res, next) {
	if (!req.session.WKCInsecureSessionToken) {
		return res.redirect(res.locals.OLSKCanonicalFor('WKCRouteLogin'));
	}

	res.render(res.locals.OLSKSharedPageControllerSlug + '/index', {
		WKCNotesInsecureAPIToken: req.session.WKCInsecureSessionToken,
	});
};
