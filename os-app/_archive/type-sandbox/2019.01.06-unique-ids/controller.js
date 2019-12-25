/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const kConst = {
	kConstFrequencyHashFor(inputData) {
		return inputData.reduce(function(coll, e) {
			if (coll[e] === undefined) {
				coll[e] = 0;
			}

			coll[e] += 1;

			return coll;
		}, {});
	},
};

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCSandboxUniqueIDsRoute: {
			OLSKRoutePath: '/sandbox/2019-01-06-unique-ids',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCSandboxUniqueIDsAction,
			OLSKRouteIsHidden: process.env.NODE_ENV === 'production',
		},
	};
};

//_ WKCSandboxUniqueIDsAction

exports.WKCSandboxUniqueIDsAction = function(req, res, next) {
	return WKCSandboxUniqueIDsProcess(req.OLSKSharedConnectionFor('KVCSharedConnectionMongo').OLSKConnectionClient).then(function (result) {
		return res.send(`<pre>${JSON.stringify(result, 0, '\t')}</pre>`);
	});
};

//_ WKCSandboxUniqueIDsProcess

WKCSandboxUniqueIDsProcess = async function(databaseClient) {
	return [
		{
			key: 'wkc_subscriptions',
			value: (await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').find({}).project(['WKCSubscriptionFetchContent'].reduce(function(hash, e) {
				hash[e] = 0;

				return hash;
			}, {})).toArray()).map(function (e) {
				return e.WKCSubscriptionID2;
			}),
		},
		{
			key: 'wkc_articles',
			value: (await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_articles').find({}).toArray()).map(function (e) {
				return e.WKCArticleID2;
			}),
		},
		{
			key: 'wkc_snapshots',
			value: (await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_snapshots').find({}).project(['WKCSnapshotBody'].reduce(function(hash, e) {
				hash[e] = 0;

				return hash;
			}, {})).toArray()).map(function (e) {
				return e.WKCSnapshotID2;
			}),
		},
		].reduce(function (coll, e) {
			coll[e.key] = {
				ids: e.value.sort().filter(function (e) {
					if (parseInt(e) <= parseInt('1547681579356')) {
						return;
					}

					if (typeof e === 'undefined') {
						return;
					}

					return true;
				}),
			};

			coll[e.key].frequency = kConst.kConstFrequencyHashFor(coll[e.key].ids);
			coll[e.key].duplicates = Object.keys(coll[e.key].frequency).filter(function (id) {
				return coll[e.key].frequency[id] !== 1;
			}).reduce(function (coll2, id) {
				coll2[id] = coll[e.key].frequency[id];

				return coll2;
			}, {});

			delete coll[e.key].ids;
			delete coll[e.key].frequency;

			return coll;
		}, {});
};
