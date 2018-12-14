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

	//# PROPERTIES

	//_ propertiesAPIToken

	moi.propertiesAPIToken = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKSubscriptionsPropertyAPIToken;
		}

		WKSubscriptionsPropertyAPIToken = inputData;
	};

	//_ propertiesArticleObjects

	moi.propertiesArticleObjects = function (inputData) {
		if (typeof inputData === 'undefined') {
			return d3.selectAll('.WKCSubscriptionsListItem').data();
		}

		moi.reactArticleObjects(inputData.sort(WKSubscriptionsLogic.WKSubscriptionsListSort));
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

	//_ commandsAlertArticlesUnavailable

	moi.commandsAlertArticlesUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKCSubscriptionsErrorArticlesUnavailableText') %>');

		throw new Error('WKCSubscriptionsErrorArticlesUnavailable');
	};

	//# REACT

	//_ reactArticleObjects

	moi.reactArticleObjects = function (noteObjects) {
		var selection = d3.select('#WKCSubscriptionsList')
			.selectAll('.WKCSubscriptionsListItem').data(noteObjects);
		
		var parentElements = selection.enter()
			.append('div')
				.attr('class', 'WKCSubscriptionsListItem')
				.on('click', function(obj) {
					moi.commandsSelectNote(obj);
				});
		parentElements.append('span').attr('id', 'WKCSubscriptionsListItemHeading');
		parentElements.append('span').attr('id', 'WKCSubscriptionsListItemDate');
		parentElements.append('span').attr('id', 'WKCSubscriptionsListItemSnippet');
		parentElements.append('span').attr('id', 'WKCSubscriptionsListItemSource');
		parentElements = parentElements.merge(selection);

		parentElements.select('#WKCSubscriptionsListItemHeading').text(function(obj) {
			return obj.WKCArticleTitle || 'untitled_article';
		});
		parentElements.select('#WKCSubscriptionsListItemDate').text(function(obj) {
			return moment(obj.WKCArticlePublishDate).fromNow();
		});
		parentElements.select('#WKCSubscriptionsListItemSnippet').text(function(obj) {
			return obj.WKCArticleSnippet || 'no snippet';
		});
		parentElements.select('#WKCSubscriptionsListItemSource').text(function(obj) {
			return obj.WKCArticleSubscriptionID;
		});

		selection.exit().remove();
	};

	//# SETUP

	//_ setupEverything

	moi.setupEverything = function () {
		moi.setupAPIToken(function () {
			moi.setupArticleObjects(function() {});
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

			d3.select('#WKCSubscriptions').classed('WKCSubscriptionsLoading', false);

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
