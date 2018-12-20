/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKSubscriptionsModuleCreate = global.WKSubscriptionsModuleCreate || {})));
}(this, (function (exports) { 'use strict';

	var moi = exports;

	var WKSubscriptionsModuleCreatePropertyAPIToken;

	//# PROPERTIES

	//_ propertiesAPIToken

	moi.propertiesAPIToken = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKSubscriptionsModuleCreatePropertyAPIToken;
		}

		WKSubscriptionsModuleCreatePropertyAPIToken = inputData;
	};

	//# INTERFACE

	//_ interfaceFetchFormDidSubmit

	moi.interfaceFetchFormDidSubmit = function () {
		moi.commandsFetchURL(d3.select('#WKCSubscriptionsModuleCreateFetchFormInput').property('value'));
	};

	//_ interfaceConfirmationFormDidSubmit

	moi.interfaceConfirmationFormDidSubmit = function () {
		moi._commandsAddSubscription({
			WKCSubscriptionURL: d3.select('#WKCSubscriptionsModuleCreateFetchFormInput').node().value,
			WKCSubscriptionType: d3.select('#WKCSubscriptionsModuleCreateConfirmationFormType').node().value,
			WKCSubscriptionName: d3.select('#WKCSubscriptionsModuleCreateConfirmationFormName').node().value,
			WKCSubscriptionBlurb: d3.select('#WKCSubscriptionsModuleCreateConfirmationFormBlurb').node().value,
		});
	};

	//# COMMANDS

	//_ commandsAlertConnectionError

	moi.commandsAlertConnectionError = function (error) {
		window.alert(OLSKLocalized('WKSharedErrorServiceUnavailable'));

		throw error;
	};

	//_ commandsAlertTokenUnavailable

	moi.commandsAlertTokenUnavailable = function () {
		window.alert(OLSKLocalized('WKSharedErrorTokenUnavailable'));

		throw new Error('WKCAppErrorTokenUnavailable');
	};

	//_ commandsFetchURL

	moi.commandsFetchURL = function (inputData) {
		if (!inputData) {
			return;
		}
		
		moi.reactPreviewFeedItems([]);
		moi.reactAlternatives([]);

		moi.reactFetchFormVisibility(true);
		moi.reactFetchLoaderVisibility(true);
		moi.reactConfirmationVisibility(false);

		d3.text(OLSKCanonicalFor('WKCRouteAPISubscriptionsFetch'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCInputURL: inputData,
			})
		}).then(function(data) {
			var parsedXML = (new DOMParser()).parseFromString(data, 'application/xml');

			if (!parsedXML.getElementsByTagName('parsererror').length && parsedXML.documentElement.getElementsByTagName('channel').length) {
				return moi.commandsConfirmURLFeed(inputData, parsedXML);
			}

			var parsedHTML = (new DOMParser()).parseFromString(data, 'text/html');

			if (!parsedHTML.getElementsByTagName('head')[0].innerHTML) {
				return moi.commandsConfirmURLFile(inputData, data);
			}

			return moi.commandsConfirmURLPage(inputData, parsedHTML);
		}).catch(moi.commandsFetchAlertError);
	};

	//_ commandsFetchAlertError

	moi.commandsFetchAlertError = function (error) {
		window.alert(OLSKLocalized('WKCSubscriptionsModuleCreateErrorFetchText'));

		moi.reactFetchLoaderVisibility(false);

		d3.select('#WKCSubscriptionsModuleCreateFetchFormInput').node().focus();

		throw error;
	};

	//_ commandsConfirmURLFeed

	moi.commandsConfirmURLFeed = function (inputData, parsedXML) {
		moi.reactConfirmationType('Feed');

		moi.reactPreviewFeedItems([].slice.call(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('item')));
		
		moi.reactPreviewShared(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('title')[0].textContent.trim(), parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('description')[0].textContent.trim(), OLSKLocalized('WKCSubscriptionsModuleCreatePreviewTypeFeedText'));
	};

	//_ commandsConfirmURLFile

	moi.commandsConfirmURLFile = function (inputData, rawData) {
		moi.reactConfirmationType('File');
		
		moi.reactPreviewFile(rawData);

		moi.reactPreviewShared(inputData.match(/https?:\/\/(.*)/)[1], null, OLSKLocalized('WKCSubscriptionsModuleCreatePreviewTypeFileText'));
	};

	//_ commandsConfirmURLPage

	moi.commandsConfirmURLPage = function (inputData, parsedHTML) {
		moi.reactConfirmationType('Page');
		
		moi.reactAlternatives([].slice.call(parsedHTML.getElementsByTagName('link')).filter(function(e) {
			return e.type.trim().toLowerCase() === 'application/rss+xml';
		}).map(function(e) {
			return WKSubscriptionsLogic.WKSubscriptionsModuleCreateCompleteURL(d3.select(e).attr('href'), inputData);
		}));

		var turndownInstance = new TurndownService();
		turndownInstance.remove('script');
		turndownInstance.remove('img');
		var showdownInstance = new showdown.Converter();
		showdownInstance.setOption('noHeaderId', true);
		moi.reactPreviewPage(showdownInstance.makeHtml(turndownInstance.turndown(parsedHTML.body)));

		moi.reactPreviewShared(parsedHTML.getElementsByTagName('title')[0].textContent, [].slice.call(parsedHTML.getElementsByTagName('meta')).filter(function(e) {
			if (e.name === 'description') {
				return true;
			}
			
			if (d3.select(e).attr('property') === 'og:description') {
				return true;
			}
			
			return false;
		}).map(function(e) {
			return e.content;
		}).shift(), OLSKLocalized('WKCSubscriptionsModuleCreatePreviewTypePageText'));
	};

	//_ _commandsAddSubscription

	moi._commandsAddSubscription = function (subscriptionObject) {
		return d3.json(OLSKCanonicalFor('WKCRouteAPISubscriptionsCreate'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify(subscriptionObject),
		}).then(function(responseJSON) {
			console.log(Object.assign(subscriptionObject, responseJSON));

			moi.reactConfirmationVisibility(false);
			moi.reactFetchFormVisibility(true);
			moi.reactAlternatives([]);
			d3.select('#WKCSubscriptionsModuleCreateFetchFormInput').property('value', '');
			d3.select('#WKCSubscriptionsModuleCreateFetchFormInput').node().focus();
		}, moi._commandsAlertAddSubscriptionError);
	};

	//_ _commandsAlertAddSubscriptionError

	moi._commandsAlertAddSubscriptionError = function (error) {
		window.alert(OLSKLocalized('WKCSubscriptionsModuleCreateErrorAddText'));

		throw error;
	};

	//# REACT

	//_ reactFetchFormVisibility

	moi.reactFetchFormVisibility = function (isVisible) {
		d3.select('#WKCSubscriptionsModuleCreateFetchForm').classed('WKCSubscriptionsHidden', !isVisible);
	};

	//_ reactFetchLoaderVisibility

	moi.reactFetchLoaderVisibility = function (isVisible) {
		d3.select('#WKCSubscriptionsModuleCreateLoader').classed('WKCSubscriptionsHidden', !isVisible);
	};

	//_ reactAlternatives

	moi.reactAlternatives = function (alternativeURLs) {
		var selection = d3.select('#WKCSubscriptionsModuleCreateAlternatives ul')
			.selectAll('.WKCSubscriptionsModuleCreateAlternativesItem').data(alternativeURLs);
		
		selection.enter()
			.append('li')
				.attr('class', 'WKCSubscriptionsModuleCreateAlternativesItem')
				.append('button')
				.on('click', function(e) {
					d3.select('#WKCSubscriptionsModuleCreateFetchFormInput').property('value', e)
					moi.commandsFetchURL(e);
				})
				.merge(selection)
					.html(function(e) {
						return e;
					});

		selection.exit().remove();

		d3.select('#WKCSubscriptionsModuleCreateAlternatives').classed('WKCSubscriptionsHidden', !alternativeURLs.length);
	};

	//_ reactConfirmationVisibility

	moi.reactConfirmationVisibility = function (isVisible) {
		d3.select('#WKCSubscriptionsModuleCreateConfirmation').classed('WKCSubscriptionsHidden', !isVisible);
	};

	//_ reactConfirmationType

	moi.reactConfirmationType = function (inputData) {
		d3.select('#WKCSubscriptionsModuleCreateConfirmationFormType').node().value = inputData;
	};

	//_ reactPreviewShared

	moi.reactPreviewShared = function (titleContent, blurbContent, typeContent) {
		moi.reactFetchLoaderVisibility(false);

		if (titleContent) {
			d3.select('#WKCSubscriptionsModuleCreateConfirmationFormName').node().value = titleContent;
		}

		if (blurbContent) {
			d3.select('#WKCSubscriptionsModuleCreateConfirmationFormBlurb').node().value = blurbContent;
		}
		d3.select('#WKCSubscriptionsModuleCreatePreviewHeadingType').html(typeContent);

		moi.reactConfirmationVisibility(true);
		
		moi.reactFetchFormVisibility(false);

		d3.select('#WKCSubscriptionsModuleCreateConfirmationFormName').attr('autofocus', true);
	};

	//_ reactPreviewFeedItems

	moi.reactPreviewFeedItems = function (itemElements) {
		var selection = d3.select('#WKCSubscriptionsModuleCreatePreviewFeed ul')
			.selectAll('.WKCSubscriptionsModuleCreatePreviewFeedItem').data(itemElements);
		
		selection.enter()
			.append('li')
				.attr('class', 'WKCSubscriptionsModuleCreatePreviewFeedItem')
				.merge(selection)
					.html(function(e) {
						return e.getElementsByTagName('title')[0].textContent.trim();
					});

		selection.exit().remove();
	};

	//_ reactPreviewFile

	moi.reactPreviewFile = function (inputData) {
		d3.select('#WKCSubscriptionsModuleCreatePreviewFile pre').html(inputData);
	};

	//_ reactPreviewPage

	moi.reactPreviewPage = function (inputData) {
		d3.select('#WKCSubscriptionsModuleCreatePreviewPageContent').html(inputData);
	};

	//# SETUP

	//_ setupEverything

	moi.setupEverything = function () {
		moi.setupAPIToken(function () {});
	};

	//_ setupAPIToken

	moi.setupAPIToken = function (completionHandler) {
		d3.json(OLSKCanonicalFor('WKCRouteAPIToken'), {
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
