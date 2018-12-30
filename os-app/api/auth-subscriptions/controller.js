/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const requestPackage = require('request');
const urlPackage = require('url');

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
		WKCRouteAPISubscriptionsFetch: {
			OLSKRoutePath: '/api/subscriptions/fetch',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.WKCActionAPISubscriptionsFetch,
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

		if (responseJSON.WKCErrors) {
			res.status(400);
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

		if (responseJSON.WKCErrors) {
			res.status(400);
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
	}, {
		WKCOptionExcludeWKCSubscriptionFetchData: true,
	});
};

//_ WKCActionAPISubscriptionsFetch

exports.WKCActionAPISubscriptionsFetch = function(req, res, next) {
	if (!urlPackage.parse(req.body.WKCInputURL).hostname) {
		return res.status(400).send('WKCErrorInvalidInput');
	}

	return requestPackage.get(req.body.WKCInputURL, function(err, response, body) {
		res.status(200).send(body);
	});
};
