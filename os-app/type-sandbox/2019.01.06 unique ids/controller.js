/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const kConst = {
	kConstFrequencyHashFor: function(inputData) {
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
	const ids = {};
	
	return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').find({}).project(['WKCSubscriptionFetchContent'].reduce(function(hash, e) {
		hash[e] = 0;

		return hash;
	}, {})).toArray()
		.then(function (items) {
			ids.wkc_subscriptions = items.map(function (e) {
				return e.WKCSubscriptionID2;
			}).sort();
		}).catch(function (err) {
			return res.json(err);
		})
		.then(function () {
			return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_articles').find({}).toArray()
		})
		.then(function (items) {
			ids.wkc_articles = items.map(function (e) {
				return e.WKCArticleID2;
			}).sort();
		}).catch(function (err) {
			return res.json(err);
		})
		.then(function () {
			return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_snapshots').find({}).toArray()
		})
		.then(function (items) {
			ids.wkc_snapshots = items.map(function (e) {
				return e.WKCSnapshotID2;
			}).sort();
		}).catch(function (err) {
			return res.json(err);
		})
		.then(function () {
			const hash = Object.keys(ids).reduce(function (coll, e) {
				coll[e] = {};

				coll[e].frequency = kConst.kConstFrequencyHashFor(ids[e].filter(function (e) {
					return typeof e !== 'undefined';
				}));
				coll[e].duplicates = Object.keys(coll[e].frequency).filter(function (id) {
					return coll[e].frequency[id] !== 1;
				});

				return coll;
			}, {});

			return res.send(`<pre>${JSON.stringify(hash, 0, '\t')}</pre>`);
		});
};
