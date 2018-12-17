/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKSubscriptions = global.WKSubscriptions || {})));
}(this, (function (exports) { 'use strict';

	var moi = exports;

	var WKSubscriptionsPropertyAPIToken;
	var WKSubscriptionsPropertySubscriptionObjects;
	var WKSubscriptionsPropertySubscriptionObjectsByID;
	var WKSubscriptionsPropertySelectedArticle;

	//# PROPERTIES

	//_ propertiesAPIToken

	moi.propertiesAPIToken = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKSubscriptionsPropertyAPIToken;
		}

		WKSubscriptionsPropertyAPIToken = inputData;
	};

	//_ propertiesSubscriptionObjects

	moi.propertiesSubscriptionObjects = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKSubscriptionsPropertySubscriptionObjects;
		}

		moi._propertiesSubscriptionObjectsByID((WKSubscriptionsPropertySubscriptionObjects = inputData).reduce(function(map, e) {
			map[e.WKCSubscriptionID] = e;
			return map;
		}, {}));
	};

	//_ _propertiesSubscriptionObjectsByID

	moi._propertiesSubscriptionObjectsByID = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKSubscriptionsPropertySubscriptionObjectsByID;
		}

		WKSubscriptionsPropertySubscriptionObjectsByID = inputData;
	};

	//_ propertiesArticleObjects

	moi.propertiesArticleObjects = function (inputData) {
		if (typeof inputData === 'undefined') {
			return d3.selectAll('.WKCSubscriptionsMasterContentListItem').data();
		}

		moi.reactArticleObjects(inputData.sort(WKSubscriptionsLogic.WKSubscriptionsListSort));
	};

	//_ propertiesSelectedArticle

	moi.propertiesSelectedArticle = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKSubscriptionsPropertySelectedArticle;
		}

		WKSubscriptionsPropertySelectedArticle = inputData === null ? undefined : inputData;

		moi.reactSelectedArticle();
	};

	//# COMMANDS

	//_ commandsAlertConnectionError

	moi.commandsAlertConnectionError = function (error) {
		window.alert('<%= OLSKLocalized('WKSharedErrorServiceUnavailable') %>');

		throw error;
	};

	//_ commandsAlertTokenUnavailable

	moi.commandsAlertTokenUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKSharedErrorTokenUnavailable') %>');

		throw new Error('WKCAppErrorTokenUnavailable');
	};

	//_ commandsAlertSubscriptionsUnavailable

	moi.commandsAlertSubscriptionsUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKCSubscriptionsErrorSubscriptionsUnavailableText') %>');

		throw new Error('WKCSubscriptionsErrorSubscriptionsUnavailable');
	};

	//_ commandsAlertArticlesUnavailable

	moi.commandsAlertArticlesUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKCSubscriptionsErrorArticlesUnavailableText') %>');

		throw new Error('WKCSubscriptionsErrorArticlesUnavailable');
	};

	//_ commandsSelectArticle

	moi.commandsSelectArticle = function (item) {
		moi.propertiesSelectedArticle(item);
	};

	//# REACT

	//_ reactArticleObjects

	moi.reactArticleObjects = function (noteObjects) {
		var selection = d3.select('#WKCSubscriptionsMasterContent')
			.selectAll('.WKCSubscriptionsMasterContentListItem').data(noteObjects);
		
		var parentElements = selection.enter()
			.append('div')
				.attr('class', 'WKCSubscriptionsMasterContentListItem')
				.on('click', function(obj) {
					moi.commandsSelectArticle(obj);
				});
		parentElements.append('h4').attr('class', 'WKCSubscriptionsMasterContentListItemHeading');
		parentElements.append('p').attr('class', 'WKCSubscriptionsMasterContentListItemSnippet');
		parentElements.append('span').attr('class', 'WKCSubscriptionsMasterContentListItemSource');
		parentElements.append('span').attr('class', 'WKCSubscriptionsMasterContentListItemDate');
		parentElements = parentElements.merge(selection);

		parentElements.select('.WKCSubscriptionsMasterContentListItemHeading').text(function(obj) {
			return obj.WKCArticleTitle || 'untitled_article';
		});
		parentElements.select('.WKCSubscriptionsMasterContentListItemSnippet').text(function(obj) {
			return obj.WKCArticleSnippet || 'no_snippet';
		});
		parentElements.select('.WKCSubscriptionsMasterContentListItemSource').text(function(obj) {
			return moi._propertiesSubscriptionObjectsByID()[obj.WKCArticleSubscriptionID].WKCSubscriptionName;
		});
		parentElements.select('.WKCSubscriptionsMasterContentListItemDate').text(function(obj) {
			return moment(obj.WKCArticlePublishDate).fromNow();
		});

		selection.exit().remove();
	};

	//_ reactSelectedArticle

	moi.reactSelectedArticle = function () {
		d3.select('#WKCSubscriptionsDetailHeading').text(moi.propertiesSelectedArticle().WKCArticleTitle || 'untitled_article');
		d3.select('#WKCSubscriptionsDetailAuthor').text(moi.propertiesSelectedArticle().WKCArticleAuthor || 'no_author');
		d3.select('#WKCSubscriptionsDetailDate').text(moment(moi.propertiesSelectedArticle().WKCArticlePublishDate).format('MMMM Do YYYY, h:mm:ss a'));
		d3.select('#WKCSubscriptionsDetailLink').attr('href', moi.propertiesSelectedArticle().WKCArticleOriginalURL);
		d3.select('#WKCSubscriptionsDetailBody').html(moi.propertiesSelectedArticle().WKCArticleBody);

		d3.selectAll('#WKCSubscriptionsDetailBody a').attr('target', '_blank');

		d3.selectAll('#WKCSubscriptionsDetailBody *').attr('width', null);

		d3.select('#WKCSubscriptionsDetail').classed('WKCSubscriptionsDetailInactive', false);
	};

	//# SETUP

	//_ setupEverything

	moi.setupEverything = function () {
		moi.setupAPIToken(function () {
			moi.setupSubscriptionObjects(function() {
				moi.setupArticleObjects(function() {
					d3.select('#WKCSubscriptions').classed('WKCSubscriptionsLoading', false);
				});
			});
		});
	};

	//_ setupAPIToken

	moi.setupAPIToken = function (completionHandler) {
		d3.json('<%= OLSKCanonicalFor('WKCRouteAPIToken') %>', {
			method: 'GET',
		}).then(function(responseJSON) {
			if (!responseJSON.WKCAPIToken) {
				return moi.commandsAlertTokenUnavailable();
			}

			moi.propertiesAPIToken(responseJSON.WKCAPIToken);

			completionHandler();
		}, moi.commandsAlertConnectionError);
	};

	//_ setupSubscriptionObjects

	moi.setupSubscriptionObjects = function (completionHandler) {
		d3.json('<%= OLSKCanonicalFor('WKCRouteAPISubscriptionsSearch') %>', {
			method: 'GET',
			headers: {
				'x-client-key': moi.propertiesAPIToken(),
			},
		}).then(function(responseJSON) {
			if (!Array.isArray(responseJSON)) {
				return moi.commandsAlertSubscriptionsUnavailable();
			}

			moi.propertiesSubscriptionObjects(responseJSON.map(function(e) {
				return Object.assign(e, {
					WKCSubscriptionDateCreated: new Date(e.WKCSubscriptionDateCreated),
					WKCSubscriptionDateUpdated: new Date(e.WKCSubscriptionDateUpdated),
					WKCSubscriptionFetchDate: new Date(e.WKCSubscriptionFetchDate),
				});
			}));

			completionHandler();
		}, moi.commandsAlertConnectionError);
	};

	//_ setupArticleObjects

	moi.setupArticleObjects = function (completionHandler) {
		d3.json('<%= OLSKCanonicalFor('WKCRouteAPIArticlesSearch') %>', {
			method: 'GET',
			headers: {
				'x-client-key': moi.propertiesAPIToken(),
			},
		}).then(function(responseJSON) {
			if (!Array.isArray(responseJSON)) {
				return moi.commandsAlertArticlesUnavailable();
			}

			moi.propertiesArticleObjects(responseJSON.map(function(e) {
				return Object.assign(e, {
					WKCArticlePublishDate: new Date(e.WKCArticlePublishDate),
				});
			}));

			completionHandler();
		}, moi.commandsAlertConnectionError);
	};

	//# LIFECYCLE

	//_ lifecyclePageWillLoad

	moi.lifecyclePageWillLoad = function () {
		moi.setupEverything();
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
