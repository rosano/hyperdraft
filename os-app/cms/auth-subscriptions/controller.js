/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const requestPackage = require('request');

var apiSubscriptionsModel = require('../../api/auth-subscriptions/model');
var apiSubscriptionsMetal = require('../../api/auth-subscriptions/metal');
var apiArticlesMetal = require('../../api/auth-articles/metal');
var apiSnapshotsMetal = require('../../api/auth-snapshots/metal');
var diffLibrary = require('./diff');
var resolveLibrary = require('./resolve');

//_ OLSKControllerTasks

exports.OLSKControllerTasks = function() {
	return [
		exports.WKCTaskSubscriptionsFetch(),
	];
};

//_ WKCTaskSubscriptionsFetch

exports.WKCTaskSubscriptionsFetch = function() {
	var taskObject = {
		OLSKTaskName: 'WKCTaskSubscriptionsFetch',
		OLSKTaskFireTimeInterval: process.env.NODE_ENV === 'production' ? 60 : 1,
		OLSKTaskFireLimit: process.env.NODE_ENV === 'production' ? Infinity : 1,
		OLSKTaskShouldBePerformed: function() {
			return true;
		},
		OLSKTaskCallback: function(callbackInput) {
			return apiSubscriptionsMetal.WKCMetalSubscriptionsNeedingFetch(callbackInput.OLSKLive.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, function(err, responseJSON) {
				if (err) {
					return console.log(err);
				}

				if (!responseJSON) {
					return;
				}

				return responseJSON.forEach(function(subscriptionObject) {
					return requestPackage.get(subscriptionObject.WKCSubscriptionURL, function(err, res, body) {
						var articleObjects = [];

						if (!err && res.statusCode === 404) {
							err = new Error([
								res.statusCode,
								res.statusMessage,
							].join(' '));
						}

						if (!err && subscriptionObject.WKCSubscriptionType === apiSubscriptionsModel.WKCSubscriptionTypeFeedRSS()) {
							articleObjects = articleObjects.concat(diffLibrary.WKCDiffArticlesForFeedRSS(subscriptionObject.WKCSubscriptionFetchContent, body));
						}

						if (!err && subscriptionObject.WKCSubscriptionType === apiSubscriptionsModel.WKCSubscriptionTypeFile()) {
							articleObjects = articleObjects.concat(diffLibrary.WKCDiffArticlesForFile(subscriptionObject.WKCSubscriptionFetchContent, body));
						}

						if (!err && subscriptionObject.WKCSubscriptionType === apiSubscriptionsModel.WKCSubscriptionTypePage()) {
							articleObjects = articleObjects.concat(diffLibrary.WKCDiffArticlesForPage(subscriptionObject.WKCSubscriptionFetchContent, body).map(function(e) {
								return Object.assign(e, {
									WKCArticleBody: resolveLibrary.WKCResolveRelativeURLs(subscriptionObject.WKCSubscriptionURL, e.WKCArticleBody),
								});
							}));
						}

						if (err && subscriptionObject.WKCSubscriptionErrorMessage !== err.toString()) {
							articleObjects.push({
								WKCArticleTitle: 'WKCErrorAccessingSubscription',
								WKCArticlePublishDate: new Date(),
								WKCArticleBody: err.toString(),
							});
						}

						return Promise.all(articleObjects.map(function(e) {
							return new Promise(function(resolve, reject) {
								apiArticlesMetal.WKCMetalArticlesCreate(callbackInput.OLSKLive.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, Object.assign(e, {
									WKCArticleSubscriptionID: subscriptionObject.WKCSubscriptionID,
								}), function(err, responseJSON) {
									return err ? reject(err) : resolve();
								});
							});
						})).then(function() {
							return apiSubscriptionsMetal.WKCMetalSubscriptionsUpdate(callbackInput.OLSKLive.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, subscriptionObject.WKCSubscriptionID, err ? {
								WKCSubscriptionErrorDate: new Date(),
								WKCSubscriptionErrorMessage: err.toString(),
							} : {
								WKCSubscriptionFetchDate: new Date(),
								WKCSubscriptionFetchContent: body,
								WKCSubscriptionErrorDate: null,
								WKCSubscriptionErrorMessage: null,
							}, function(err, responseJSON) {
								if (err) {
									return console.log(err);
								}

								if (!articleObjects.length) {
									return;
								}

								return apiSnapshotsMetal.WKCSnapshotsMetalCreate(callbackInput.OLSKLive.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, {
										WKCSnapshotSubscriptionID: subscriptionObject.WKCSubscriptionID,
										WKCSnapshotBody: body,
									}, function(err, responseJSON) {
									if (err) {
										return console.log(err);
									}
								});
							});
						}, function(err) {
							console.log(err);
						});
					});
				});
			});
		},
	};

	return taskObject;
};

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

//_ OLSKControllerSharedMiddlewares

exports.OLSKControllerSharedMiddlewares = function() {
	return {
		WKCSubscribeMiddlewareIgnoreJSMap: exports.WKCSubscribeMiddlewareIgnoreJSMap,
	};
};

//_ WKCSubscribeMiddlewareIgnoreJSMap

exports.WKCSubscribeMiddlewareIgnoreJSMap = function(req, res, next) {
	if (!/\.js\.map$/.test(req.originalUrl)) {
		return next();
	}

	res.status(200);
	// res.send('');
};

//_ WKCActionSubscriptionsIndex

exports.WKCActionSubscriptionsIndex = function(req, res, next) {
	return res.render([
		__dirname,
		'index',
	].join('/'), {
		OLSKPagePublicConstants: {
			WKCSubscriptionTypeFeedRSS: apiSubscriptionsModel.WKCSubscriptionTypeFeedRSS(),
			WKCSubscriptionTypeFeedAtom: apiSubscriptionsModel.WKCSubscriptionTypeFeedAtom(),
			WKCSubscriptionTypeFile: apiSubscriptionsModel.WKCSubscriptionTypeFile(),
			WKCSubscriptionTypePage: apiSubscriptionsModel.WKCSubscriptionTypePage(),
		},
	});
};
