/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const subscriptionsMetalLibrary = require('../../api/auth-subscriptions/metal.js');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {};
	return {
		WKCMigrateMainRoute: {
			OLSKRoutePath: '/migrate/2018-12-31T12:34',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCMigrateMainAction,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAuthenticate',
			],
		},
	};
};

//_ WKCMigrateMainAction

exports.WKCMigrateMainAction = function(req, res, next) {
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
