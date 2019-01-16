/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCSandboxUniqueIDsRoute: {
			OLSKRoutePath: '/sandbox/2019-01-16-twitter-urls',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: function (req, res, next) {
				return exports.WKCSandboxTwitterURLsProcess(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient).then(function (result) {
					return res.send(`<pre>${JSON.stringify(result, 0, '\t')}</pre>`);
				});
			},
			OLSKRouteIsHidden: process.env.NODE_ENV === 'production',
		},
	};
};

//_ WKCSandboxTwitterURLsProcess

exports.WKCSandboxTwitterURLsProcess = async (databaseClient) => {
	return Promise.all((await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').find({
		WKCSubscriptionURL: /extended\&screen_name/i,
	}).project(['WKCSubscriptionFetchContent'].reduce(function(hash, e) {
		hash[e] = 0;

		return hash;
	}, {})).toArray()).slice(-1).map(function (e) {
		return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').findOneAndUpdate({
			WKCSubscriptionID: e.WKCSubscriptionID,
		}, {
			'$set': {
				WKCSubscriptionURL: e.WKCSubscriptionURL.replace('extended\&screen_name', 'extended\&exclude_replies=true\&screen_name'),
			},
		}, {
			returnOriginal: false,
		});
	}));
};
