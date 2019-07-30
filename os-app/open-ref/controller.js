const storageClient = require('../_shared/WKCStorageClient/storage.js').WKCStorageClientForChangeDelegateMap({
	wkc_notes: null,
});

//_ OLSKControllerSharedConnections

exports.OLSKControllerSharedConnectionsx = function() {
	return {
		WKCSharedConnectionRS: {
			OLSKConnectionInitializer: function(olskCallback) {
				storageClient.remoteStorage.on('error', (error) => {
					console.log('error', error);

					olskCallback(error);
				});

				storageClient.remoteStorage.on('connected', () => {
					console.log('connected', storageClient.remoteStorage.remote.userAddress);

					olskCallback(null, storageClient.remoteStorage);
				});
				
				storageClient.remoteStorage.connect(process.env.WKC_REMOTE_STORAGE_ACCOUNT, process.env.WKC_REMOTE_STORAGE_KEY);
			},
			OLSKConnectionCleanup: function (client) {
				return;
			},
		},
	};
};

//_ OLSKControllerSharedMiddlewares

exports.OLSKControllerSharedMiddlewaresx = function() {
	return {
		WKCSharedMiddlewareEnsureConnection: exports.WKCSharedMiddlewareEnsureConnectionx,
	};
};

//_ WKCSharedMiddlewareEnsureConnection

exports.WKCSharedMiddlewareEnsureConnectionx = function(req, res, next) {
	if (!req.OLSKSharedConnectionFor('WKCSharedConnectionRS').OLSKConnectionAttempted) {
		return next(new Error('WKCErrorConnectionNotAttempted'));
	}

	if (req.OLSKSharedConnectionFor('WKCSharedConnectionRS').OLSKConnectionError) {
		return next(req.OLSKSharedConnectionFor('WKCSharedConnectionRS').OLSKConnectionError);
	}

	return next();
};

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteHome: {
			OLSKRoutePath: '/',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: function(req, res, next) {
				return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'view'), {
					WKCNoteObject: {
						WKCNoteDetectedTitle: res.locals.OLSKLocalized('WKCHomeTitle'),
						WKCNoteDetectedBody: '',
					},
				});
			},
			OLSKRouteLanguages: ['en'],
		},
		WKCRouteRefsRead: {
			OLSKRoutePath: '/:wkc_note_public_id(\\d+)',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: async function(req, res, next) {
				return next();
				const WKCNotesAction = require('../_shared/rs-modules/wkc_notes/action.js');
				const WKCParser = require('../_shared/WKCParser/main.js');

				let item = await WKCNotesAction.WKCNotesActionPublicRead(req.OLSKSharedConnectionFor('WKCSharedConnectionRS').OLSKConnectionClient, req.params.wkc_note_public_id);

				if ((item.message || '').match(/NotFound/)) {
					return next();
				}

				item.WKCNoteDetectedTitle = WKCParser.WKCParserTitleForPlaintext(item.WKCNoteBody);
				item.WKCNoteDetectedBody = WKCParser.WKCParserHTMLForPlaintext(WKCParser.WKCParserReplaceLinks(WKCParser.WKCParserBodyForPlaintext(item.WKCNoteBody), Object.entries(await WKCNotesAction.WKCNotesActionGetPublicLinks(req.OLSKSharedConnectionFor('WKCSharedConnectionRS').OLSKConnectionClient)).map(function (e) {
					return [e[0], `[${ e[0] }](${ res.locals.OLSKCanonicalFor('WKCRouteRefsRead', {
						wkc_note_public_id: e[1],
					}) })`];
				}).reduce(function (coll, e) {
					coll[e[0]] = e[1];

					return coll;
				}, {})));
				
				return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'view'), {
					WKCNoteObject: item,
				});
			},
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareEnsureConnection',
			],
		},
	};
};
