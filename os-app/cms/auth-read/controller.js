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
			OLSKRoutePath: '/cms/read',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCReadAction,
			OLSKRouteLanguages: ['en'],
			OLSKRouteMiddlewares: [
				'WKCSharedMiddlewareAuthenticate',
			],
		},
	};
};

//_ WKCReadAction

exports.WKCReadAction = function(req, res, next) {
	return res.render([
		__dirname,
		'view',
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
