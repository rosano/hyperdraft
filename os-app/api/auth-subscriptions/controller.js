/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const requestPackage = require('request');
const urlPackage = require('url');

const modelLibrary = require('./model.js');
const metalLibrary = require('./metal.js');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteAPISubscriptionsCreate: {
			OLSKRoutePath: '/api/subscriptions',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.WKCActionAPISubscriptionsCreate,
			OLSKRouteMiddlewares: [
				'KVCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPISubscriptionsRead: {
			OLSKRoutePath: '/api/subscriptions/:wkc_subscription_id(\\d+)',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionAPISubscriptionsRead,
			OLSKRouteMiddlewares: [
				'KVCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPISubscriptionsUpdate: {
			OLSKRoutePath: '/api/subscriptions/:wkc_subscription_id(\\d+)',
			OLSKRouteMethod: 'put',
			OLSKRouteFunction: exports.WKCActionAPISubscriptionsUpdate,
			OLSKRouteMiddlewares: [
				'KVCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPISubscriptionsDelete: {
			OLSKRoutePath: '/api/subscriptions/:wkc_subscription_id(\\d+)',
			OLSKRouteMethod: 'delete',
			OLSKRouteFunction: exports.WKCActionAPISubscriptionsDelete,
			OLSKRouteMiddlewares: [
				'KVCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPISubscriptionsSearch: {
			OLSKRoutePath: '/api/subscriptions/search',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionAPISubscriptionsSearch,
			OLSKRouteMiddlewares: [
				'KVCSharedMiddlewareAPIAuthenticate',
			],
		},
		WKCRouteAPISubscriptionsFetch: {
			OLSKRoutePath: '/api/subscriptions/fetch',
			OLSKRouteMethod: 'post',
			OLSKRouteFunction: exports.WKCActionAPISubscriptionsFetch,
			OLSKRouteMiddlewares: [
				'KVCSharedMiddlewareAPIAuthenticate',
			],
		},
	};
};

//_ WKCActionAPISubscriptionsCreate

exports.WKCActionAPISubscriptionsCreate = function(req, res, next) {
	return metalLibrary.WKCMetalSubscriptionsCreate(req.OLSKSharedConnectionFor('KVCSharedConnectionMongo').OLSKConnectionClient, req.body, function(err, responseJSON) {
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
	return metalLibrary.WKCMetalSubscriptionsRead(req.OLSKSharedConnectionFor('KVCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_subscription_id, function(err, responseJSON) {
		if (err) {
			throw err;
		}

		return res.json(responseJSON);
	});
};

//_ WKCActionAPISubscriptionsUpdate

exports.WKCActionAPISubscriptionsUpdate = function(req, res, next) {
	return metalLibrary.WKCMetalSubscriptionsUpdate(req.OLSKSharedConnectionFor('KVCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_subscription_id, req.body, function(err, responseJSON) {
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
	return metalLibrary.WKCMetalSubscriptionsDelete(req.OLSKSharedConnectionFor('KVCSharedConnectionMongo').OLSKConnectionClient, req.params.wkc_subscription_id, function(err, responseJSON) {
		if (err) {
			throw err;
		}

		return res.json(responseJSON);
	});
};

//_ WKCActionAPISubscriptionsSearch

exports.WKCActionAPISubscriptionsSearch = function(req, res, next) {
	return metalLibrary.WKCMetalSubscriptionsSearch(req.OLSKSharedConnectionFor('KVCSharedConnectionMongo').OLSKConnectionClient, '', function(err, responseJSON) {
		if (err) {
			throw err;
		}

		return res.json(responseJSON);
	}, {
		WKCOptionExcludeWKCSubscriptionFetchContent: true,
	});
};

//_ WKCActionAPISubscriptionsFetch

exports.WKCActionAPISubscriptionsFetch = function(req, res, next) {
	return metalLibrary.WKCSubscriptionsMetalRequestParameters(req.OLSKSharedConnectionFor('KVCSharedConnectionMongo').OLSKConnectionClient, req.body.WKCSubscriptionsAPIFetchURL, function (err, responseJSON) {
		if (err) {
			return res.status(200).json({
				error: err.message,
			});
		}

		return requestPackage(responseJSON, function(err, response, body) {
			return res.status(200).json({
				error: err ? err.message : undefined,
				contents: body,
			});
		});
	}, {
		WKCOptionHandler: req.body.WKCSubscriptionsAPIFetchHandler,
	});
};
