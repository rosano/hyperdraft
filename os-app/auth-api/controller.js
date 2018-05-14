/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const persistenceLibrary = require('../_shared/persistence');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteAPIRoot: {
			OLSKRoutePath: '/api/',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.WKCAPIRoot,
		},
		WKCRouteAPINotesAdd: {
			OLSKRoutePath: '/api/notes',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.index,
		},
	};
};

exports.WKCAPIRoot = function(req, res, next) {
	if (!process.env.WKC_INSECURE_API_ACCESS_TOKEN || process.env.WKC_INSECURE_API_ACCESS_TOKEN.trim() === '') {
		return res.json({
			WKCError: 'API Token Not Set',
		});
	}
	
	if (req.headers.authorization !== ['Bearer', process.env.WKC_INSECURE_API_ACCESS_TOKEN].join(' ')) {
		return res.json({
			WKCError: 'Invalid access token',
		});
	}

	return res.text('Successfully authenticated');
};

exports.index = function(req, res, next) {
	if (!req.body.WKCInsecureAPIToken) {
		return res.json({
			WKCError: 'Invalid API Token',
		});
	}

	return persistenceLibrary.WKCPersistenceNotesAdd(function(item) {
		return res.json({
			WKCNewItem: item,
		});
	});
};
