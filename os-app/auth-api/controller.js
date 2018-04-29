/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const persistenceLibrary = require('../_shared/persistence');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function () {
	return {
		WKCRouteAPINotesAdd: {
			OLSKRoutePath: '/api/notes',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.index,
		},
	};
};

exports.index = function (req, res, next) {
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
