/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const markedPackage = require('marked');

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
		'read',
	].join('/'), {
		WKCNoteObject: {
			WKCNoteDetectedTitle: 'Welcome',
			WKCNoteDetectedBody: '',
		},
		markedPackage: markedPackage,
	});
};

//_ WKCActionRefsRead

const apiNotesMetal = require('../api/auth-notes/metal.js');
const WKCParser = require('../_shared/WKCParser/main.js');

exports.WKCActionRefsRead = async function(req, res, next) {
	let item = await apiNotesMetal.WKCNotesMetalPublicRead(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_note_public_id);

	if (!item) {
		return next(new Error('WKCErrorNotFound'));
	}

	item.WKCNoteDetectedTitle = WKCParser.WKCParserTitleForPlaintext(item.WKCNoteBody);
	item.WKCNoteDetectedBody = WKCParser.WKCParserBodyForPlaintext(item.WKCNoteBody);

	return res.render([
		__dirname,
		'read',
	].join('/'), {
		WKCNoteObject: item,
		markedPackage: markedPackage,
	});
};
