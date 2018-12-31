/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const apiSubscriptionsModel = require('../../api/auth-subscriptions/model');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCRouteSubscriptions: {
			OLSKRoutePath: '/cms/subscriptions',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCActionSubscriptionsIndex,
			OLSKRouteLanguages: ['en'],
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAuthenticate',
			],
		},
	};
};

//_ WKCActionSubscriptionsIndex

exports.WKCActionSubscriptionsIndex = function(req, res, next) {
	return res.render([
		__dirname,
		'index',
	].join('/'), {
		OLSKPagePublicConstants: {
			WKCSubscriptionHandlerFeedRSS: apiSubscriptionsModel.WKCSubscriptionHandlerFeedRSS(),
			WKCSubscriptionHandlerFeedAtom: apiSubscriptionsModel.WKCSubscriptionHandlerFeedAtom(),
			WKCSubscriptionHandlerFile: apiSubscriptionsModel.WKCSubscriptionHandlerFile(),
			WKCSubscriptionHandlerPage: apiSubscriptionsModel.WKCSubscriptionHandlerPage(),
			WKCSubscriptionHandlerCustomTwitter: apiSubscriptionsModel.WKCSubscriptionHandlerCustomTwitter(),
		},
	});
};
