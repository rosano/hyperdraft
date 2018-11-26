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
		},
		WKCRouteAPISubscriptionsDelete: {
			OLSKRoutePath: '/api/subscriptions/:wkc_subscription_id(\\d+)',
			OLSKRouteMethod: 'delete',
			OLSKRouteFunction: exports.WKCActionAPISubscriptionsDelete,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPISubscriptionsSearch: {
			OLSKRoutePath: '/api/subscriptions/search',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionAPISubscriptionsSearch,
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAPIAuthenticate',
			],
		},
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

//_ WKCActionAPISubscriptionsUpdate

exports.WKCActionAPISubscriptionsUpdate = function(req, res, next) {
	return metalLibrary.WKCMetalSubscriptionsUpdate(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_subscription_id, req.body, function(err, responseJSON) {
		if (err) {
			throw err;
		}

		return res.json(responseJSON);
	});
};

//_ WKCActionAPISubscriptionsDelete

exports.WKCActionAPISubscriptionsDelete = function(req, res, next) {
	return metalLibrary.WKCMetalSubscriptionsDelete(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_subscription_id, function(err, responseJSON) {
		if (err) {
			throw err;
		}

		return res.json(responseJSON);
	});
};

//_ WKCActionAPISubscriptionsSearch

exports.WKCActionAPISubscriptionsSearch = function(req, res, next) {
	return metalLibrary.WKCMetalSubscriptionsSearch(req.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, '', function(err, responseJSON) {
		if (err) {
			throw err;
		}

		return res.json(responseJSON);
	});
};
