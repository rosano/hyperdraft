/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const requestPackage = require('request');
const jsdomPackage = require('jsdom');

const typeLibrary = require('OLSKType');
var WKCDiff = require('./_shared/WKCDiff/main.js');

var apiSubscriptionsModel = require('../api/auth-subscriptions/model');
var apiSubscriptionsMetal = require('../api/auth-subscriptions/metal');
var apiArticlesMetal = require('../api/auth-articles/metal');
var apiSnapshotsMetal = require('../api/auth-snapshots/metal');
var resolveLibrary = require('./resolve');
var responseParserLibrary = require('../_shared/WKCParser/main.js');


const kConst = {
	kWKCTaskFetchDOMParserInstance: function() {
		return new (new jsdomPackage.JSDOM('')).window.DOMParser();
	},
};

//_ OLSKControllerTasks

exports.OLSKControllerTasks = function() {
	return [
		exports.WKCTaskFetch(),
	];
};

//_ WKCTaskFetch

exports.WKCTaskFetch = function() {
	var taskObject = {
		OLSKTaskName: 'WKCTaskFetch',
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
					return apiSubscriptionsMetal.WKCSubscriptionsMetalRequestParameters(callbackInput.OLSKLive.OLSKSharedConnectionFor('WKCSharedConnectionMongo').OLSKConnectionClient, subscriptionObject.WKCSubscriptionURL, function (error, responseJSON) {

						return requestPackage(responseJSON, function(err, res, body) {
							var articleObjects = [];

							(function WKCTaskFetchProcess() {
								if (error) {
									err = error;
									return;
								}

								if (err) {
									return;
								}

								if (res.statusCode === 404) {
									return (err = new Error([
										res.statusCode,
										res.statusMessage,
									].join(' ')));
								}

								const typeChangeError = new Error('WKCErrorParsingSubscriptionTypeChanged');

								if (subscriptionObject.WKCSubscriptionHandler === apiSubscriptionsModel.WKCSubscriptionHandlerFeedRSS() && !typeLibrary.OLSKTypeInputDataIsDOMDocumentRSS(kConst.kWKCTaskFetchDOMParserInstance().parseFromString(body, 'application/xml'))) {
									return (err = typeChangeError);
								}

								if (subscriptionObject.WKCSubscriptionHandler === apiSubscriptionsModel.WKCSubscriptionHandlerFeedAtom() && !typeLibrary.OLSKTypeInputDataIsDOMDocumentAtom(kConst.kWKCTaskFetchDOMParserInstance().parseFromString(body, 'application/xml'))) {
									return (err = typeChangeError);
								}

								if (subscriptionObject.WKCSubscriptionHandler === apiSubscriptionsModel.WKCSubscriptionHandlerPage() && !typeLibrary.OLSKTypeInputDataIsDOMDocumentHTML(new jsdomPackage.JSDOM(body).window.document)) {
									return (err = typeChangeError);
								}

								if (subscriptionObject.WKCSubscriptionHandler === apiSubscriptionsModel.WKCSubscriptionHandlerCustomTwitterTimeline() && !responseParserLibrary.WKCParserInputDataIsCustomTwitterTimeline(JSON.parse(body))) {
									return (err = typeChangeError);
								}

								if (subscriptionObject.WKCSubscriptionHandler === apiSubscriptionsModel.WKCSubscriptionHandlerFeedRSS()) {
									return articleObjects.push(...responseParserLibrary.WKCParserArticlesForFeedRSS(kConst.kWKCTaskFetchDOMParserInstance(), subscriptionObject.WKCSubscriptionFetchContent, body));
								}

								if (subscriptionObject.WKCSubscriptionHandler === apiSubscriptionsModel.WKCSubscriptionHandlerFeedAtom()) {
									return articleObjects.push(...responseParserLibrary.WKCParserArticlesForFeedAtom(kConst.kWKCTaskFetchDOMParserInstance(), subscriptionObject.WKCSubscriptionFetchContent, body));
								}

								if (subscriptionObject.WKCSubscriptionHandler === apiSubscriptionsModel.WKCSubscriptionHandlerFile()) {
									return articleObjects.push(...diffLibrary.WKCDiffArticlesForFile(subscriptionObject.WKCSubscriptionFetchContent, body));
								}

								if (subscriptionObject.WKCSubscriptionHandler === apiSubscriptionsModel.WKCSubscriptionHandlerPage()) {
									return articleObjects.push(...diffLibrary.WKCDiffArticlesForPage(subscriptionObject.WKCSubscriptionFetchContent, body).map(function(e) {
										return Object.assign(e, {
											WKCArticleBody: resolveLibrary.WKCResolveRelativeURLs(subscriptionObject.WKCSubscriptionURL, e.WKCArticleBody),
										});
									}));
								}

								if (subscriptionObject.WKCSubscriptionHandler === apiSubscriptionsModel.WKCSubscriptionHandlerCustomTwitterTimeline()) {
									return articleObjects.push(...responseParserLibrary.WKCParserArticlesForCustomTwitterTimeline(subscriptionObject.WKCSubscriptionFetchContent, body));
								}
							})();

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
					}, {
						WKCOptionHandler: subscriptionObject.WKCSubscriptionHandler,
					});
				});
			});
		},
	};

	return taskObject;
};
