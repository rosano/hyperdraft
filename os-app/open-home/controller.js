/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var apiNotesController = require('../api/auth-notes/controller');

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
			OLSKRoutePath: '/:wkc_note_public_id(\\d+)',
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

//_ WKCActionRefsRead

exports.WKCActionRefsRead = function(req, res, next) {
	apiNotesController.WKCActionAPINotesPublicRead(req, {
		json: function(inputData) {
			return res.render([
				__dirname,
				'read',
			].join('/'), {
				WKCNoteObject: inputData,
			});
		},
	}, next);
};
