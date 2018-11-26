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
				// 'WKCSharedMiddlewareAPIAuthenticate',
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

