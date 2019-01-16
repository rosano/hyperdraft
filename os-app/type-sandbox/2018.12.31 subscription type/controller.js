/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {};
	return {
		WKCSandboxSubscriptionTypeRoute: {
			OLSKRoutePath: '/sandbox/2018-12-31-subscription-type',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCSandboxSubscriptionTypeAction,
			OLSKRouteIsHidden: process.env.NODE_ENV === 'production',
		},
	};
};

//_ WKCSandboxSubscriptionTypeAction

exports.WKCSandboxSubscriptionTypeAction = function(req, res, next) {
	return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').find({
		WKCSubscriptionHandler: null,
	}).project(['WKCSubscriptionFetchContent'].reduce(function(hash, e) {
		hash[e] = 0;

		return hash;
	}, {})).toArray(function(err, items) {
		if (err) {
			return res.json(err);
		}

		return Promise.all(items.slice(-1).map(function (e) {
			return new Promise(function (resolve, reject) {
				return req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').findOneAndUpdate({
					WKCSubscriptionID: e.WKCSubscriptionID,
				}, {
					'$set': {
						WKCSubscriptionHandler: e.WKCSubscriptionType,
					},
					'$unset': {
						WKCSubscriptionType: null,
					},
				}, {
					returnOriginal: false,
				}, function(err, result) {
					if (err) {
						return reject(err);
					}

					var subscriptionObject = result.value;

					delete subscriptionObject.WKCSubscriptionFetchContent;

					return resolve(subscriptionObject);
				});
			});
		})).catch(function (errors) {
			console.log(errors);
		}).then(function (responses) {
			return res.json(responses);
		});
	});
};
