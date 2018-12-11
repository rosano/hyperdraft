/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const requestPackage = require('request');

var apiSubscriptionsMetal = require('../../api/auth-subscriptions/metal');
var apiArticlesMetal = require('../../api/auth-articles/metal');
var diffLibrary = require('./diff');

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
		OLSKTaskFireTimeInterval: 1,
		OLSKTaskFireLimit: 1,
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
					requestPackage.get(subscriptionObject.WKCSubscriptionURL, function(err, res, body) {
						var completionHandler = function() {
							apiSubscriptionsMetal.WKCMetalSubscriptionsUpdate(callbackInput.OLSKLive.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, subscriptionObject.WKCSubscriptionID, Object.assign(subscriptionObject, {
									WKCSubscriptionFetchContent: body,
									WKCSubscriptionFetchDate: new Date(),
								}), function(err, responseJSON) {
								if (err) {
									return console.log(err);
								}
							});
						};

						if (subscriptionObject.WKCSubscriptionType === 'Feed') {
							return Promise.all(diffLibrary.WKCDiffArticlesForFeed(subscriptionObject.WKCSubscriptionFetchContent, body).map(function(e) {
								return new Promise(function(resolve, reject) {
									apiArticlesMetal.WKCMetalArticlesCreate(callbackInput.OLSKLive.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, Object.assign(e, {
										WKCArticleSubscriptionID: subscriptionObject.WKCSubscriptionID,
									}), function(err, responseJSON) {
										return err ? reject(err) : resolve();
									});
								});
							})).then(completionHandler, function(err) {
								console.log(err);
							});
						}
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

//_ WKCActionSubscriptionsIndex

exports.WKCActionSubscriptionsIndex = function(req, res, next) {
	return res.render([
		__dirname,
		'index',
	].join('/'), {});
};
