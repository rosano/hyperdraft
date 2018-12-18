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

	var moi = {};

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

	//# INTERFACE

	//_ interfaceSubscriptionsCreateButtonDidClick

	moi.interfaceSubscriptionsCreateButtonDidClick = function () {
		moi.commandsSubscriptionsCreate();
	};

	//_ interfaceSubscriptionsCreateCloseButtonDidClick

	moi.interfaceSubscriptionsCreateCloseButtonDidClick = function () {
		moi.commandsSubscriptionsCreateClose();
	};

	//_ interfaceDiscardButtonDidClick

	moi.interfaceDiscardButtonDidClick = function () {
		if (!moi.propertiesSelectedArticle()) {
			return;
		}

		moi.commandsArticlesDiscard(moi.propertiesSelectedArticle());
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

	//_ commandsSubscriptionsCreate

	moi.commandsSubscriptionsCreate = function () {
		moi.reactSubscriptionsCreateVisibility(true);
	};

	//_ commandsSubscriptionsCreateClose

	moi.commandsSubscriptionsCreateClose = function () {
		moi.reactSubscriptionsCreateVisibility(false);
	};

	//_ commandsSelectArticle

	moi.commandsSelectArticle = function (item) {
		moi.propertiesSelectedArticle(item);

		if (item.WKCArticleIsRead) {
			return;
		}

		moi.commandsArticlesMarkAsRead(item);
	};

	//_ commandsArticlesMarkAsRead

	moi.commandsArticlesMarkAsRead = function (item) {
		d3.json((<%- OLSKCanonicalSubstitutionFunctionFor('WKCRouteAPIArticlesUpdate') %>)({
			wkc_article_id: item.WKCArticleID
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCArticleIsRead: true,
			}),
		}).then(function(responseJSON) {
			Object.assign(item, responseJSON);

			d3.selectAll('.WKCSubscriptionsMasterContentListItem').filter(function(obj) {
				return obj === item;
			}).classed('WKCSubscriptionsMasterContentListItemUnread', false);
		}, moi.commandsArticlesAlertErrorMarkAsRead);
	};

	//_ commandsArticlesAlertErrorMarkAsRead

	moi.commandsArticlesAlertErrorMarkAsRead = function () {
		window.alert('<%= OLSKLocalized('WKCSubscriptionsErrorArticlesMarkAsReadText') %>');

		throw new Error('WKCSubscriptionsErrorArticlesMarkAsRead');
	};

	//_ commandsArticlesDiscard

	moi.commandsArticlesDiscard = function (item) {
		d3.json((<%- OLSKCanonicalSubstitutionFunctionFor('WKCRouteAPIArticlesUpdate') %>)({
			wkc_article_id: item.WKCArticleID
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCArticleIsDiscarded: true,
			}),
		}).then(function(responseJSON) {
			Object.assign(item, responseJSON);

			moi.propertiesSelectedArticle(null);
			moi.propertiesArticleObjects(moi.propertiesArticleObjects().filter(function (e) {
				return e !== item;
			}));
		}, moi.commandsArticlesAlertErrorMarkAsDiscarded);
	};

	//_ commandsArticlesAlertErrorMarkAsDiscarded

	moi.commandsArticlesAlertErrorMarkAsDiscarded = function (error) {
		window.alert('<%= OLSKLocalized('WKCSubscriptionsErrorArticlesMarkAsDiscardedText') %>');

		throw error;
	};

	//# REACT

	//_ reactArticleObjects

	moi.reactArticleObjects = function (noteObjects) {
		var selection = d3.select('#WKCSubscriptionsMasterContent')
			.selectAll('.WKCSubscriptionsMasterContentListItem').data(noteObjects);
		
		var parentElement = selection.enter()
			.append('div')
				.attr('class', 'WKCSubscriptionsMasterContentListItem')
				.classed('WKCSubscriptionsTappable', true);
		parentElement.append('p').attr('class', 'WKCSubscriptionsMasterContentListItemHeading');
		parentElement.append('p').attr('class', 'WKCSubscriptionsMasterContentListItemSnippet');
		parentElement.append('p').attr('class', 'WKCSubscriptionsMasterContentListItemSource');
		parentElement.append('span').attr('class', 'WKCSubscriptionsMasterContentListItemDate');
		parentElement = parentElement.merge(selection);

		parentElement
			.classed('WKCSubscriptionsMasterContentListItemUnread', function(obj) {
				return !obj.WKCArticleIsRead;
			})
			.on('click', function(obj) {
				moi.commandsSelectArticle(obj);
			});

		parentElement.select('.WKCSubscriptionsMasterContentListItemHeading').text(function(obj) {
			return obj.WKCArticleTitle || 'untitled_article';
		});
		parentElement.select('.WKCSubscriptionsMasterContentListItemSnippet').text(function(obj) {
			return obj.WKCArticleSnippet || 'no_snippet';
		});
		parentElement.select('.WKCSubscriptionsMasterContentListItemSource').text(function(obj) {
			return moi._propertiesSubscriptionObjectsByID()[obj.WKCArticleSubscriptionID].WKCSubscriptionName;
		});
		parentElement.select('.WKCSubscriptionsMasterContentListItemDate').text(function(obj) {
			return moment(obj.WKCArticlePublishDate).calendar(null, {
				sameDay: 'hh:mm',
				lastDay: '[Yesterday]',
				lastWeek: 'dddd',
				sameElse: 'YYYY-MM-DD'
			});
		});

		selection.exit().remove();
	};

	//_ reactSubscriptionsCreateVisibility

	moi.reactSubscriptionsCreateVisibility = function (isVisible) {
		d3.select('#WKCSubscriptionsCreate').classed('WKCSubscriptionsCreateActive', isVisible);
		d3.select('#WKCSubscriptionsCreate').classed('WKCSubscriptionsCreateInactive', !isVisible);
	};

	//_ reactSelectedArticle

	moi.reactSelectedArticle = function () {
		d3.selectAll('.WKCSubscriptionsMasterContentListItem').classed('WKCSubscriptionsMasterContentListItemSelected', function(obj) {
			return obj === moi.propertiesSelectedArticle();
		});

		if (!moi.propertiesSelectedArticle()) {
			return d3.select('#WKCSubscriptionsDetail').classed('WKCSubscriptionsDetailInactive', true);
		}

		d3.select('#WKCSubscriptionsDetailContentHeading').text(moi.propertiesSelectedArticle().WKCArticleTitle || 'untitled_article');
		d3.select('#WKCSubscriptionsDetailContentAuthor').text(moi.propertiesSelectedArticle().WKCArticleAuthor || 'no_author');
		d3.select('#WKCSubscriptionsDetailContentDate').text(moment(moi.propertiesSelectedArticle().WKCArticlePublishDate).format('MMMM Do YYYY, h:mm:ss a'));
		d3.select('#WKCSubscriptionsDetailContentSource').text(moi._propertiesSubscriptionObjectsByID()[moi.propertiesSelectedArticle().WKCArticleSubscriptionID].WKCSubscriptionName);
		d3.select('#WKCSubscriptionsDetailContentLink').attr('href', moi.propertiesSelectedArticle().WKCArticleOriginalURL || moi._propertiesSubscriptionObjectsByID()[moi.propertiesSelectedArticle().WKCArticleSubscriptionID].WKCSubscriptionURL);
		d3.select('#WKCSubscriptionsDetailContentBody')
			.html(moi.propertiesSelectedArticle().WKCArticleBody)
			.classed('WKCSubscriptionsDetailContentBodyFile', moi._propertiesSubscriptionObjectsByID()[moi.propertiesSelectedArticle().WKCArticleSubscriptionID].WKCSubscriptionType === 'File');

		d3.selectAll('#WKCSubscriptionsDetailContentBody a').attr('target', '_blank');

		d3.selectAll('#WKCSubscriptionsDetailContentBody *').attr('width', null);

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

	Object.assign(exports, moi);

	Object.defineProperty(exports, '__esModule', { value: true });

})));
