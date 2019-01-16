/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCSandboxGapSubscriptionsRoute: {
			OLSKRoutePath: '/sandbox/2019-01-16-gap-subscriptions',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: function (req, res, next) {
				return WKCSandboxGapSubscriptionsProcess(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient).then(function (result) {
					return res.send(`<pre>${JSON.stringify(result, 0, '\t')}</pre>`);
				});
			},
			OLSKRouteIsHidden: process.env.NODE_ENV === 'production',
		},
	};
};

//_ WKCSandboxGapSubscriptionsProcess

WKCSandboxGapSubscriptionsProcess = async function (databaseClient) {
	return Promise.all((await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').find({
		WKCSubscriptionIsPaused: true,
	}).project(['WKCSubscriptionFetchContent'].reduce(function(hash, e) {
		hash[e] = 0;

		return hash;
	}, {})).toArray()).slice(-1).map(function (e) {
		return Promise.resolve(e);

		return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').findOneAndUpdate({
			WKCSubscriptionID: e.WKCSubscriptionID,
		}, {
			'$set': {
				WKCSubscriptionIsPaused: true,
			},
		}, {
			returnOriginal: false,
		});
	}));
};
