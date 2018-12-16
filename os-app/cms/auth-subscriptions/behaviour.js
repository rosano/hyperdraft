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
	var WKSubscriptionsPropertySelectedArticle;

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
			return d3.selectAll('.WKCSubscriptionsMasterListItem').data();
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
			.selectAll('.WKCSubscriptionsMasterListItem').data(noteObjects);
		
		var parentElements = selection.enter()
			.append('div')
				.attr('class', 'WKCSubscriptionsMasterListItem')
				.on('click', function(obj) {
					moi.commandsSelectArticle(obj);
				});
		parentElements.append('h4').attr('class', 'WKCSubscriptionsMasterListItemHeading');
		parentElements.append('p').attr('class', 'WKCSubscriptionsMasterListItemSnippet');
		parentElements.append('span').attr('class', 'WKCSubscriptionsMasterListItemSource');
		parentElements.append('span').attr('class', 'WKCSubscriptionsMasterListItemDate');
		parentElements = parentElements.merge(selection);

		parentElements.select('.WKCSubscriptionsMasterListItemHeading').text(function(obj) {
			return obj.WKCArticleTitle || 'untitled_article';
		});
		parentElements.select('.WKCSubscriptionsMasterListItemSnippet').text(function(obj) {
			return obj.WKCArticleSnippet || 'no_snippet';
		});
		parentElements.select('.WKCSubscriptionsMasterListItemSource').text(function(obj) {
			return obj.WKCArticleSubscriptionID;
		});
		parentElements.select('.WKCSubscriptionsMasterListItemDate').text(function(obj) {
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
