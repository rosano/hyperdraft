const kWKCRefCacheKey = 'open-ref';

const { WKCRefStorageClient } = require('./client.js');
const storageClient = WKCRefStorageClient();

exports.RCSRefFetchPublicNotesArray = async function () {
	return Object.values(await storageClient.wikiavec.WKCRefStorageList()).filter(function (e) {
		return e.KVCNotePublishStatusIsPublished;
	});
};

exports.RCSRefUpdateCachedPublicNotes = function (writeFunction, inputData) {
	let outputData = inputData.reduce(function (coll, item) {
		if (typeof coll[item.KVCNotePublicID] === 'undefined') {
			coll[item.KVCNotePublicID] = item;
		}

		return coll;
	}, {});

	writeFunction(kWKCRefCacheKey, outputData);

	return outputData;
};

exports.OLSKControllerSharedConnections = function() {
	return {
		KVCSharedConnectionRS: {
			OLSKConnectionInitializer(olskCallback) {
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
			OLSKConnectionCleanup (client) {
				return;
			},
		},
	};
};

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		KVCSharedMiddlewareEnsureConnection: exports.KVCSharedMiddlewareEnsureConnection,
	};
};

//_ KVCSharedMiddlewareEnsureConnection

exports.KVCSharedMiddlewareEnsureConnection = function(req, res, next) {
	if (!req.OLSKSharedConnectionFor('KVCSharedConnectionRS').OLSKConnectionAttempted) {
		return next(new Error('KVCErrorConnectionNotAttempted'));
	}

	if (req.OLSKSharedConnectionFor('KVCSharedConnectionRS').OLSKConnectionError) {
		return next(req.OLSKSharedConnectionFor('KVCSharedConnectionRS').OLSKConnectionError);
	}

	return next();
};

//_ OLSKControllerTasks

exports.OLSKControllerTasks = function () {
	return [
		{
			OLSKTaskName: 'WKCRefCacheTask',
			OLSKTaskFireTimeInterval: 60,
			OLSKTaskShouldBePerformed () {
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
			OLSKRouteFunction (req, res, next) {
				return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'view'), {
					KVCNoteObject: {
						KVCNoteDetectedTitle: res.locals.OLSKLocalized('WKCHomeTitle'),
						KVCNoteDetectedBody: '',
					},
				});
			},
			OLSKRouteLanguages: ['en'],
		},
		WKCRouteRefsRead: {
			OLSKRoutePath: '/:kvc_note_public_id(\\d+)',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: async function(req, res, next) {
				let publicNotes = req.OLSKCacheReadForCacheKey(kWKCRefCacheKey) || exports.RCSRefUpdateCachedPublicNotes(req.OLSKCacheWriteWithCacheKeyAndCacheObject, await exports.RCSRefFetchPublicNotesArray());

				let item = publicNotes[req.params.kvc_note_public_id];

				if (!item) {
					return next();
				}

				const KVCParser = require('../_shared/KVCParser/main.js');

				const publicLinks = Object.values(publicNotes).map(function (e) {
					return [KVCParser.KVCParserTitleForPlaintext(e.KVCNoteBody), e.KVCNotePublicID];
				}).reduce(function (coll, [key, val]) {
					if (typeof coll[key] === 'undefined') {
						coll[key] = val;
					}

					return coll;
				}, {});
				
				item.KVCNoteDetectedTitle = KVCParser.KVCParserTitleForPlaintext(item.KVCNoteBody);
				item.KVCNoteDetectedBody = KVCParser.KVCParserHTMLForPlaintext(KVCParser.KVCParserReplaceLinks(KVCParser.KVCParserBodyForPlaintext(item.KVCNoteBody), Object.entries(publicLinks).map(function (e) {
					return [e[0], `[${ e[0] }](${ res.locals.OLSKCanonicalFor('WKCRouteRefsRead', {
						kvc_note_public_id: e[1],
					}) })`];
				}).reduce(function (coll, e) {
					coll[e[0]] = e[1];

					return coll;
				}, {})));
				
				return res.render(require('path').join(__dirname, 'view'), {
					KVCNoteObject: item,
				});
			},
			OLSKRouteMiddlewares: [
				'KVCSharedMiddlewareEnsureConnection',
			],
		},
		WKCRefsReadPlaintext: {
			OLSKRoutePath: '/:kvc_note_public_id(\\d+)/plaintext',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: async function(req, res, next) {
				let publicNotes = req.OLSKCacheReadForCacheKey(kWKCRefCacheKey) || exports.RCSRefUpdateCachedPublicNotes(req.OLSKCacheWriteWithCacheKeyAndCacheObject, await exports.RCSRefFetchPublicNotesArray());

				let item = publicNotes[req.params.kvc_note_public_id];

				if (!item) {
					return next();
				}
				
				return res.send(item.KVCNoteBody);
			},
			OLSKRouteMiddlewares: [
				'KVCSharedMiddlewareEnsureConnection',
			],
		},
	};
};
