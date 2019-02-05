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
			OLSKRoutePath: '/:wkc_note_public_id(\\d+)',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionRefsRead,
		},
	};
};

//_ WKCActionHomeIndex

exports.WKCActionHomeIndex = function(req, res, next) {
	return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'view'), {
		WKCNoteObject: {
			WKCNoteDetectedTitle: res.locals.OLSKLocalized('WKCHomeTitle'),
			WKCNoteDetectedBody: '',
		},
	});
};

//_ WKCActionRefsRead

const notesActionLibrary = require('../api/auth-notes/action.js');
const WKCParser = require('../_shared/WKCParser/main.js');

exports.WKCActionRefsRead = async function(req, res, next) {
	let item = await notesActionLibrary.WKCNotesActionPublicRead(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_note_public_id);

	if ((item.message || '').match(/NotFound/)) {
		return next();
	}

	item.WKCNoteDetectedTitle = WKCParser.WKCParserTitleForPlaintext(item.WKCNoteBody);
	item.WKCNoteDetectedBody = WKCParser.WKCParserHTMLForPlaintext(WKCParser.WKCParserReplaceLinks(WKCParser.WKCParserBodyForPlaintext(item.WKCNoteBody), Object.entries(await notesActionLibrary.WKCNotesActionGetPublicLinks(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient)).map(function (e) {
		return [e[0], `[${ e[0] }](${ res.locals.OLSKCanonicalFor('WKCRouteRefsRead', {
			wkc_note_public_id: e[1],
		}) })`]
	}).reduce(function (coll, e) {
		coll[e[0]] = e[1];

		return coll;
	}, {})));
	
	return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'view'), {
		WKCNoteObject: item,
	});
};
