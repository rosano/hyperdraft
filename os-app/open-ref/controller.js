const { WKCRefStorageClient } = require('./client.js');
const storageClient = WKCRefStorageClient();

const kWKCRefCacheKey = 'open-ref';

//_ OLSKControllerSharedConnections

exports.OLSKControllerSharedConnections = function() {
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

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		WKCSharedMiddlewareEnsureConnection: exports.WKCSharedMiddlewareEnsureConnection,
	};
};

//_ WKCSharedMiddlewareEnsureConnection

exports.WKCSharedMiddlewareEnsureConnection = function(req, res, next) {
	if (!req.OLSKSharedConnectionFor('WKCSharedConnectionRS').OLSKConnectionAttempted) {
		return next(new Error('WKCErrorConnectionNotAttempted'));
	}

	if (req.OLSKSharedConnectionFor('WKCSharedConnectionRS').OLSKConnectionError) {
		return next(req.OLSKSharedConnectionFor('WKCSharedConnectionRS').OLSKConnectionError);
	}

	return next();
};

//_ OLSKControllerTasks

exports.OLSKControllerTasks = function () {
	return [
		{
			OLSKTaskName: 'WKCRefCacheTask',
			OLSKTaskFireTimeInterval: 60 * 60,
			OLSKTaskShouldBePerformed: function () {
				return true;
			},
			OLSKTaskCallback: async function (callbackInput) {
				callbackInput.OLSKLive.OLSKCacheWriteWithCacheKeyAndCacheObject(kWKCRefCacheKey, await exports.RCSRefFetchPublicNotes());
			},
		},
	];
};

exports.RCSRefFetchPublicNotes = async function () {
	return Object.values(await storageClient.wkc_notes.listObjects()).filter(function (e) {
		return e.WKCNotePublishStatusIsPublished;
	});
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
				let publicNotes = req.OLSKCacheReadForCacheKey(kWKCRefCacheKey);

				if (!publicNotes) {
					publicNotes = await exports.RCSRefFetchPublicNotes()

					req.OLSKCacheWriteWithCacheKeyAndCacheObject(kWKCRefCacheKey, publicNotes);
				};

				let item = publicNotes.filter(function (e) {
					return e.WKCNotePublicID === req.params.wkc_note_public_id;
				}).shift();

				if (!item) {
					return next();
				}

				const WKCParser = require('../_shared/WKCParser/main.js');

				const publicLinks = publicNotes.map(function (e) {
					return [WKCParser.WKCParserTitleForPlaintext(e.WKCNoteBody), e.WKCNotePublicID];
				}).reduce(function (coll, [key, val]) {
					if (typeof coll[key] === 'undefined') {
						coll[key] = val;
					}

					return coll;
				}, {});
				
				item.WKCNoteDetectedTitle = WKCParser.WKCParserTitleForPlaintext(item.WKCNoteBody);
				item.WKCNoteDetectedBody = WKCParser.WKCParserHTMLForPlaintext(WKCParser.WKCParserReplaceLinks(WKCParser.WKCParserBodyForPlaintext(item.WKCNoteBody), Object.entries(publicLinks).map(function (e) {
					return [e[0], `[${ e[0] }](${ res.locals.OLSKCanonicalFor('WKCRouteRefsRead', {
						wkc_note_public_id: e[1],
					}) })`];
				}).reduce(function (coll, e) {
					coll[e[0]] = e[1];

					return coll;
				}, {})));
				
				return res.render(require('path').join(__dirname, 'view'), {
					WKCNoteObject: item,
				});
			},
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareEnsureConnection',
			],
		},
	};
};
