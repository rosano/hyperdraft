const kWKCRefCacheKey = 'open-ref';

const { WKCRefStorageClient } = require('./client.js');
const storageClient = WKCRefStorageClient();

exports.RCSRefFetchPublicNotesArray = async function () {
	return Object.values(await storageClient.wikiavec.WKCRefStorageList()).filter(function (e) {
		return e.WKCNotePublishStatusIsPublished;
	});
};

exports.RCSRefUpdateCachedPublicNotes = function (writeFunction, inputData) {
	let outputData = inputData.reduce(function (coll, item) {
		if (typeof coll[item.WKCNotePublicID] === 'undefined') {
			coll[item.WKCNotePublicID] = item;
		}

		return coll;
	}, {});

	writeFunction(kWKCRefCacheKey, outputData);

	return outputData;
};

exports.OLSKControllerSharedConnections = function() {
	return {
		WKCSharedConnectionRS: {
			OLSKConnectionInitializer: function(olskCallback) {
				let didConnect = false;

				storageClient.remoteStorage.on('error', (error) => {
					console.log('error', error);

					if (didConnect) {
						return;
					};

					olskCallback(error);
				});

				storageClient.remoteStorage.on('connected', () => {
					console.log('connected', storageClient.remoteStorage.remote.userAddress);

					olskCallback(null, storageClient.remoteStorage);

					didConnect = true;
				});
				
				storageClient.remoteStorage.connect(process.env.WKC_REMOTE_STORAGE_ACCOUNT, process.env.WKC_REMOTE_STORAGE_KEY);
			},
			OLSKConnectionCleanup: function (client) {
				return;
			},
		},
	};
};

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
			OLSKTaskFireTimeInterval: 60,
			OLSKTaskShouldBePerformed: function () {
				return true;
			},
			OLSKTaskCallback: async function (callbackInput) {
				exports.RCSRefUpdateCachedPublicNotes(callbackInput.OLSKLive.OLSKCacheWriteWithCacheKeyAndCacheObject, await exports.RCSRefFetchPublicNotesArray());
			},
		},
	];
};

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
				let publicNotes = req.OLSKCacheReadForCacheKey(kWKCRefCacheKey) || exports.RCSRefUpdateCachedPublicNotes(req.OLSKCacheWriteWithCacheKeyAndCacheObject, await exports.RCSRefFetchPublicNotesArray());

				let item = publicNotes[req.params.wkc_note_public_id];

				if (!item) {
					return next();
				}

				const WKCParser = require('../_shared/WKCParser/main.js');

				const publicLinks = Object.values(publicNotes).map(function (e) {
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
		WKCRefsReadPlaintext: {
			OLSKRoutePath: '/:wkc_note_public_id(\\d+)/plaintext',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: async function(req, res, next) {
				let publicNotes = req.OLSKCacheReadForCacheKey(kWKCRefCacheKey) || exports.RCSRefUpdateCachedPublicNotes(req.OLSKCacheWriteWithCacheKeyAndCacheObject, await exports.RCSRefFetchPublicNotesArray());

				let item = publicNotes[req.params.wkc_note_public_id];

				if (!item) {
					return next();
				}
				
				return res.send(item.WKCNoteBody);
			},
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareEnsureConnection',
			],
		},
	};
};
