/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const apiSubscriptionsModel = require('../../api/auth-subscriptions/model');

//_ OLSKControllerRoutes

exports.OLSKControllerRoutes = function() {
	return {
		WKCReadRoute: {
			OLSKRoutePath: '/panel/read',
			OLSKRouteMethod: 'get',
			OLSKRouteFunction: exports.WKCReadAction,
			OLSKRouteLanguages: ['en'],
			OLSKRouteMiddlewares: [
				'KVCSharedMiddlewareAuthenticate',
			],
		},
	};
};

//_ WKCReadAction

exports.WKCReadAction = function(req, res, next) {
	return res.render(req.OLSKLive.OLSKLivePathJoin(__dirname, 'view'), {
		OLSKPagePublicConstants: {
			WKCSubscriptionHandlerFeedRSS: apiSubscriptionsModel.WKCSubscriptionHandlerFeedRSS(),
			WKCSubscriptionHandlerFeedAtom: apiSubscriptionsModel.WKCSubscriptionHandlerFeedAtom(),
			WKCSubscriptionHandlerFile: apiSubscriptionsModel.WKCSubscriptionHandlerFile(),
			WKCSubscriptionHandlerPage: apiSubscriptionsModel.WKCSubscriptionHandlerPage(),
			WKCSubscriptionHandlerCustomTwitterTimeline: apiSubscriptionsModel.WKCSubscriptionHandlerCustomTwitterTimeline(),
		},
	});
};
