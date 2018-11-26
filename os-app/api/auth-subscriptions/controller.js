/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var modelLibrary = require('./model');
var metalLibrary = require('./metal');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteAPISubscriptionsCreate: {
			OLSKRoutePath: '/api/subscriptions',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.WKCActionAPISubscriptionsCreate,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPISubscriptionsRead: {
			OLSKRoutePath: '/api/subscriptions/:wkc_subscription_id(\\d+)',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionAPISubscriptionsRead,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPISubscriptionsUpdate: {
			OLSKRoutePath: '/api/subscriptions/:wkc_subscription_id(\\d+)',
			OLSKRouteMethod: 'put',
			OLSKRouteFunction: exports.WKCActionAPISubscriptionsUpdate,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
	};
};

//_ WKCActionAPISubscriptionsCreate

exports.WKCActionAPISubscriptionsCreate = function(req, res, next) {
	return metalLibrary.WKCMetalSubscriptionsCreate(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.body, function(err, responseJSON) {
		if (err) {
			throw err;
		}
		
		return res.json(responseJSON);
	});
};

//_ WKCActionAPISubscriptionsRead

exports.WKCActionAPISubscriptionsRead = function(req, res, next) {
	return metalLibrary.WKCMetalSubscriptionsRead(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_subscription_id, function(err, responseJSON) {
		if (err) {
			throw err;
		}
		
		return res.json(responseJSON);
	});
};

