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

	//# INTERFACE

	//_ interfaceFetchFormDidSubmit

	moi.interfaceFetchFormDidSubmit = function () {
		moi.commandsFetchURL(d3.select('#WKCAppSubscriptionsFormInput').property('value'));
	};

	//_ interfaceConfirmationFormDidSubmit

	moi.interfaceConfirmationFormDidSubmit = function () {
		moi._commandsAddSubscription({
			WKCSubscriptionURL: d3.select('#WKCAppSubscriptionsFormInput').node().value,
			WKCSubscriptionName: d3.select('#WKCAppSubscriptionsConfirmationFormName').node().value,
			WKCSubscriptionBlurb: d3.select('#WKCAppSubscriptionsConfirmationFormBlurb').node().value,
		}).then(function(responseJSON) {
			console.log(responseJSON);
		}, function(err) {
			console.log(err);
		});
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

	//_ commandsFetchURL

	moi.commandsFetchURL = function (inputData) {
		moi.reactConfirmationPreviewFeedItems([]);
		moi.reactConfirmationPreviewPageAlternatives([]);

		moi.reactFetchFormVisibility(true);
		moi.reactFetchLoaderVisibility(true);
		moi.reactConfirmationVisibility(false);

		d3.text(inputData).then(function(data) {
			var parsedXML = (new DOMParser()).parseFromString(data, 'application/xml');

			if (!parsedXML.getElementsByTagName('parsererror').length && parsedXML.documentElement.getElementsByTagName('channel').length) {
				return moi.commandsConfirmURLFeed(inputData, parsedXML);
			}

			var parsedHTML = (new DOMParser()).parseFromString(data, 'text/html');

			if (!parsedHTML.getElementsByTagName('head')[0].innerHTML) {
				return moi.commandsConfirmURLFile(inputData, data);
			}

			return moi.commandsConfirmURLPage(inputData, parsedHTML);
		}).catch(moi.commandsAlertFetchError);
	};

	//_ commandsAlertFetchError

	moi.commandsAlertFetchError = function (error) {
		window.alert('<%= OLSKLocalized('WKCSubscriptionsErrorFetch') %>');

		moi.reactFetchLoaderVisibility(false);

		d3.select('#WKCAppSubscriptionsFormInput').node().focus();

		throw error;
	};

	//_ commandsConfirmURLFeed

	moi.commandsConfirmURLFeed = function (inputData, parsedXML) {
		moi.reactConfirmationPreviewFeedItems([].slice.call(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('item')));
		
		moi.reactConfirmationPreviewShared(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('title')[0].textContent.trim(), parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('description')[0].textContent.trim(), '<%= OLSKLocalized('WKCSubscriptionsConfirmationFeed') %>');
	};

	//_ commandsConfirmURLFile

	moi.commandsConfirmURLFile = function (inputData, rawData) {
		moi.reactConfirmationPreviewFile(rawData);

		moi.reactConfirmationPreviewShared(inputData.match(/https?:\/\/(.*)/)[1], null, '<%= OLSKLocalized('WKCSubscriptionsConfirmationFile') %>');
	};

	//_ commandsConfirmURLPage

	moi.commandsConfirmURLPage = function (inputData, parsedHTML) {
		moi.reactConfirmationPreviewPageAlternatives([].slice.call(parsedHTML.getElementsByTagName('link')).filter(function(e) {
			return e.type.trim().toLowerCase() === 'application/rss+xml';
		}).map(function(e) {
			return WKLogic.WKSubscriptionsCompleteURL(d3.select(e).attr('href'), inputData);
		}));

		var turndownInstance = new TurndownService();
		turndownInstance.remove('script');

		moi.reactConfirmationPreviewPage(turndownInstance.turndown(parsedHTML.body));

		moi.reactConfirmationPreviewShared(parsedHTML.getElementsByTagName('title')[0].textContent, [].slice.call(parsedHTML.getElementsByTagName('meta')).filter(function(e) {
			if (e.name === 'description') {
				return true;
			}
			
			if (d3.select(e).attr('property') === 'og:description') {
				return true;
			}
			
			return false;
		}).map(function(e) {
			return e.content;
		}).shift(), '<%= OLSKLocalized('WKCSubscriptionsConfirmationPage') %>');
	};

	//_ _commandsAddSubscription

	moi._commandsAddSubscription = function (subscriptionObject) {
		return d3.json('<%= OLSKCanonicalFor('WKCRouteAPISubscriptionsCreate') %>', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify(subscriptionObject),
		}).then(function(responseJSON) {
			return Object.assign(subscriptionObject, responseJSON);
		});
	};

	//# REACT

	//_ reactFetchFormVisibility

	moi.reactFetchFormVisibility = function (isVisible) {
		d3.select('#WKCAppSubscriptionsForm').classed('WKCAppSubscriptionsHidden', !isVisible);
	};

	//_ reactFetchLoaderVisibility

	moi.reactFetchLoaderVisibility = function (isVisible) {
		d3.select('#WKCSubscriptionsLoader').classed('WKCAppSubscriptionsHidden', !isVisible);
	};

	//_ reactConfirmationVisibility

	moi.reactConfirmationVisibility = function (isVisible) {
		d3.select('#WKCAppSubscriptionsConfirmation').classed('WKCAppSubscriptionsHidden', !isVisible);
	};

	//_ reactConfirmationPreviewShared

	moi.reactConfirmationPreviewShared = function (titleContent, blurbContent, typeContent) {
		moi.reactFetchLoaderVisibility(false);

		d3.select('#WKCAppSubscriptionsConfirmationFormName').node().value = titleContent;

		d3.select('#WKCAppSubscriptionsConfirmationFormBlurb').node().value = blurbContent;

		d3.select('#WKCSubscriptionsConfirmationPreviewType').html(typeContent);

		moi.reactConfirmationVisibility(true);
		
		moi.reactFetchFormVisibility(false);

		d3.select('#WKCAppSubscriptionsConfirmationFormName').attr('autofocus', true);
	};

	//_ reactConfirmationPreviewFeedItems

	moi.reactConfirmationPreviewFeedItems = function (itemElements) {
		var selection = d3.select('#WKCAppSubscriptionsConfirmationPreviewFeed ul')
			.selectAll('.WKCAppSubscriptionsConfirmationPreviewFeedItem').data(itemElements);
		
		selection.enter()
			.append('li')
				.attr('class', 'WKCAppSubscriptionsConfirmationPreviewFeedItem')
				.merge(selection)
					.html(function(e) {
						return e.getElementsByTagName('title')[0].textContent.trim();
					});

		selection.exit().remove();
	};

	//_ reactConfirmationPreviewFile

	moi.reactConfirmationPreviewFile = function (inputData) {
		d3.select('#WKCAppSubscriptionsConfirmationPreviewFile pre').html(inputData);
	};

	//_ reactConfirmationPreviewPage

	moi.reactConfirmationPreviewPage = function (inputData) {
		d3.select('#WKCAppSubscriptionsConfirmationPreviewPageContent').html(inputData);
	};

	//_ reactConfirmationPreviewPageAlternatives

	moi.reactConfirmationPreviewPageAlternatives = function (alternativeURLs) {
		var selection = d3.select('#WKCAppSubscriptionsConfirmationPreviewPageAlternatives ul')
			.selectAll('.WKCAppSubscriptionsConfirmationPreviewPageAlternativesItem').data(alternativeURLs);
		
		selection.enter()
			.append('li')
				.attr('class', 'WKCAppSubscriptionsConfirmationPreviewPageAlternativesItem')
				.append('button')
				.on('click', function(e) {
					d3.select('#WKCAppSubscriptionsFormInput').property('value', e)
					moi.commandsFetchURL(e);
				})
				.merge(selection)
					.html(function(e) {
						return e;
					});

		selection.exit().remove();

		d3.select('#WKCAppSubscriptionsConfirmationPreviewPageAlternatives').classed('WKCAppSubscriptionsHidden', !alternativeURLs.length);
	};

	//# SETUP

	//_ setupEverything

	moi.setupEverything = function () {
		moi.setupAPIToken(function () {});
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

	//# LIFECYCLE

	//_ lifecyclePageWillLoad

	moi.lifecyclePageWillLoad = function () {
		moi.setupEverything();
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
