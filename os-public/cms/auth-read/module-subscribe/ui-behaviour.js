/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCReadModuleSubscribe = global.WKCReadModuleSubscribe || {})));
}(this, (function (exports) { 'use strict';

	var moi = {};

	var WKCReadModuleSubscribePropertyAPIToken;
	var kWKCReadModuleSubscribeHandlerMap = [
		[
			WKCReadModuleSubscribeSuggestions.WKCReadModuleSubscribeSuggestionsTypeCustomTwitter(),
			OLSKPublicConstants.WKCSubscriptionHandlerCustomTwitter,
		],
	].reduce(function (map, e) {
		map[e.shift()] = e.pop();

		return map;
	}, {});

	var stringContentForFirstElement = function (inputData) {
		return inputData[0] ? inputData[0].textContent.trim() : '';
	}

	//# PROPERTIES

	//_ propertiesAPIToken

	moi.propertiesAPIToken = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKCReadModuleSubscribePropertyAPIToken;
		}

		WKCReadModuleSubscribePropertyAPIToken = inputData;
	};

	//_ propertiesFetchURL

	moi.propertiesFetchURL = function (inputData) {
		if (typeof inputData === 'undefined') {
			return d3.select('#WKCReadModuleSubscribeFetchFormURL').property('value');
		}

		d3.select('#WKCReadModuleSubscribeFetchFormURL').property('value', inputData);
	};

	//# INTERFACE

	//_ interfaceFetchFormDidSubmit

	moi.interfaceFetchFormDidSubmit = function () {
		moi.commandsFetchURL(moi.propertiesFetchURL());
	};

	//_ interfaceConfirmationFormDidSubmit

	moi.interfaceConfirmationFormDidSubmit = function () {
		moi._commandsSubscriptionsCreate({
			WKCSubscriptionURL: moi.propertiesFetchURL(),
			WKCSubscriptionHandler: d3.select('#WKCReadModuleSubscribeConfirmationFormType').node().value,
			WKCSubscriptionName: d3.select('#WKCReadModuleSubscribeConfirmationFormName').node().value,
			WKCSubscriptionBlurb: d3.select('#WKCReadModuleSubscribeConfirmationFormBlurb').node().value,
		});
	};

	//_ interfaceConfirmationClearButtonDidClick

	moi.interfaceConfirmationClearButtonDidClick = function () {
		moi.commandsConfirmationClear();
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

	moi.commandsFetchURL = function (inputData, fetchHandler) {
		if (!inputData) {
			return;
		}

		moi.commandsConfirmationClear();

		moi.propertiesFetchURL(inputData);

		moi.reactFetchLoaderVisibility(true);

		d3.text(OLSKCanonicalFor('WKCRouteAPISubscriptionsFetch'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify(Object.assign({
				WKCSubscriptionsAPIFetchURL: inputData,
			}, fetchHandler ? {
				WKCSubscriptionsAPIFetchHandler: fetchHandler,
			} : {})),
		})
		.then(function(data) {
			data = JSON.parse(data);

			if (data.err === 'WKCErrorTwitterMissingToken') {
				return moi.commandsFetchAlertErrorTwitterMissingToken();
			} else if (data.err) {
				throw new Error(data.err);
			}

			var parsedXML = (new DOMParser()).parseFromString(data.body, 'application/xml');

			if (OLSKType.OLSKTypeInputDataIsDOMDocumentRSS(parsedXML)) {
				return moi.commandsConfirmURLFeedRSS(inputData, parsedXML);
			}

			if (OLSKType.OLSKTypeInputDataIsDOMDocumentAtom(parsedXML)) {
				return moi.commandsConfirmURLFeedAtom(inputData, parsedXML);
			}

			var parsedHTML = (new DOMParser()).parseFromString(data.body, 'text/html');

			if (OLSKType.OLSKTypeInputDataIsDOMDocumentHTML(parsedHTML)) {
				return moi.commandsConfirmURLPage(inputData, parsedHTML);
			}

			return moi.commandsConfirmURLFile(inputData, data.body);
		})
		.catch(moi.commandsFetchAlertError)
		.finally(function () {
			moi.reactSuggestions(WKCReadModuleSubscribeSuggestions.WKCReadModuleSubscribeSuggestionsFor(inputData));

			moi.reactFetchLoaderVisibility(false);
		});
	};

	//_ commandsFetchAlertError

	moi.commandsFetchAlertError = function (error) {
		window.alert(OLSKLocalized('WKCReadModuleSubscribeErrorFetchText'));

		moi.reactFetchLoaderVisibility(false);

		d3.select('#WKCReadModuleSubscribeFetchFormURL').node().focus();

		throw error;
	};

	//_ commandsFetchAlertErrorTwitterMissingToken

	moi.commandsFetchAlertErrorTwitterMissingToken = function (error) {
		window.alert(OLSKLocalized('WKCReadModuleSubscribeErrorTwitterMissingToken'));
	};

	//_ commandsConfirmURLFeedRSS

	moi.commandsConfirmURLFeedRSS = function (inputData, parsedXML) {
		moi.reactConfirmationType(OLSKPublicConstants.WKCSubscriptionHandlerFeedRSS);

		moi.reactPreviewFeedItems([].slice.call(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('item')));
		
		moi.reactPreviewShared(stringContentForFirstElement(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('title')), stringContentForFirstElement(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('description')), OLSKLocalized('WKCReadModuleSubscribePreviewTypeFeedRSSText'));
	};

	//_ commandsConfirmURLFeedAtom

	moi.commandsConfirmURLFeedAtom = function (inputData, parsedXML) {
		moi.reactConfirmationType(OLSKPublicConstants.WKCSubscriptionHandlerFeedAtom);

		moi.reactPreviewFeedItems([].slice.call(parsedXML.getElementsByTagName('entry')));
		
		moi.reactPreviewShared(stringContentForFirstElement(parsedXML.getElementsByTagName('title')), stringContentForFirstElement(parsedXML.getElementsByTagName('subtitle')), OLSKLocalized('WKCReadModuleSubscribePreviewTypeFeedAtomText'));
	};

	//_ commandsConfirmURLFile

	moi.commandsConfirmURLFile = function (inputData, rawData) {
		moi.reactConfirmationType(OLSKPublicConstants.WKCSubscriptionHandlerFile);
		
		moi.reactPreviewFile(rawData);

		moi.reactPreviewShared(inputData.match(/https?:\/\/(.*)/)[1], null, OLSKLocalized('WKCReadModuleSubscribePreviewTypeFileText'));
	};

	//_ commandsConfirmURLPage

	moi.commandsConfirmURLPage = function (inputData, parsedHTML) {
		moi.reactConfirmationType(OLSKPublicConstants.WKCSubscriptionHandlerPage);
		
		moi.reactAlternativesFeeds([].slice.call(parsedHTML.getElementsByTagName('link')).filter(function(e) {
			return [
				'application/rss+xml',
				'application/atom+xml',
				].indexOf(e.type.trim().toLowerCase()) !== -1;
		}).map(function(e) {
			return WKCReadLogic.WKCReadModuleSubscribeCompleteURL(d3.select(e).attr('href'), inputData);
		}));

		var turndownInstance = new TurndownService();
		turndownInstance.remove('script');
		turndownInstance.remove('style');
		turndownInstance.remove('img');
		turndownInstance.addRule('trim whitespace in link text', {
			filter: function (node, options) {
				return node.nodeName === 'A' && node.innerHTML !== node.textContent;
			},
			replacement: function (content, node) {
				return [
					'[',
					content.trim(),
					'](',
					node.getAttribute('href'),
					')',
					].join('');
			},
		});
		turndownInstance.addRule('populate blank links', {
			filter: function (node, options) {
				return node.nodeName === 'A' && !node.textContent.trim();
			},
			replacement: function (content, node) {
				return [
					'[',
					node.getAttribute('title') || '\\[\\_\\_\\_\\_\\_\\]',
					'](',
					node.getAttribute('href'),
					')',
					].join('');
			},
		});
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
		}).shift(), OLSKLocalized('WKCReadModuleSubscribePreviewTypePageText'));
	};

	//_ commandsConfirmationClear

	moi.commandsConfirmationClear = function () {
		moi.propertiesFetchURL('');

		moi.reactAlternativesFeeds([]);
		moi.reactSuggestions([]);
		moi.reactPreviewFeedItems([]);
		moi.reactPreviewPage('');
		moi.reactPreviewFile('');
		moi.reactConfirmationVisibility(false);
		moi.reactFetchFormVisibility(true);

		d3.selectAll('.WKCReadModuleSubscribePreview').classed('WKCSharedHidden', true);

		d3.select('#WKCReadModuleSubscribeConfirmationFormName').property('value', '');
		d3.select('#WKCReadModuleSubscribeConfirmationFormBlurb').property('value', '');

		d3.select('#WKCReadModuleSubscribeFetchFormURL').node().focus();
	};

	//_ _commandsSubscriptionsCreate

	moi._commandsSubscriptionsCreate = function (subscriptionObject) {
		return d3.json(OLSKCanonicalFor('WKCRouteAPISubscriptionsCreate'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify(subscriptionObject),
		}).then(function(responseJSON) {
			Object.assign(subscriptionObject, responseJSON);

			moi.commandsConfirmationClear();
			moi.reactFetchFlash(OLSKFormatted(OLSKLocalized('WKCReadModuleSubscribeFlashFormat'), subscriptionObject.WKCSubscriptionURL));
		}, moi._commandsSubscriptionsAlertErrorCreate);
	};

	//_ _commandsSubscriptionsAlertErrorCreate

	moi._commandsSubscriptionsAlertErrorCreate = function (error) {
		window.alert(OLSKLocalized('WKCReadModuleSubscribeErrorCreateText'));

		throw error;
	};

	//# REACT

	//_ reactFetchFormVisibility

	moi.reactFetchFormVisibility = function (isVisible) {
		d3.select('#WKCReadModuleSubscribeFetchForm').classed('WKCSharedHidden', !isVisible);
	};

	//_ reactFetchLoaderVisibility

	moi.reactFetchLoaderVisibility = function (isVisible) {
		d3.select('#WKCReadModuleSubscribeLoader').classed('WKCSharedHidden', !isVisible);
	};

	//_ reactFetchFlash

	moi.reactFetchFlash = function (inputData) {
		d3.select('#WKCReadModuleSubscribeFetchFlash')
			.text(inputData)
			.classed('WKCSharedHidden', false)
			.style('opacity', 0)
			.transition()
				.duration(275)
				.style('opacity', 1)
				.transition()
					.delay(2000)
					.style('opacity', 0)
					.on('end', function () {
						d3.select('#WKCReadModuleSubscribeFetchFlash')
		        	.text(inputData)
		        	.classed('WKCSharedHidden', true);
		      });
	};

	//_ reactAlternativesFeeds

	moi.reactAlternativesFeeds = function (feedURLs) {
		var selection = d3.select('#WKCReadModuleSubscribeAlternativesFeeds ul')
			.selectAll('.WKCReadModuleSubscribeAlternativesFeedsItem').data(feedURLs);
		
		selection.enter()
			.append('li')
				.attr('class', 'WKCReadModuleSubscribeAlternativesFeedsItem')
				.append('button')
				.on('click', function(e) {
					moi.commandsFetchURL(e);
				})
				.merge(selection)
					.html(function(e) {
						return e;
					});

		selection.exit().remove();

		d3.select('#WKCReadModuleSubscribeAlternativesFeeds').classed('WKCSharedHidden', !feedURLs.length);
	};

	//_ reactSuggestions

	moi.reactSuggestions = function (suggestionObjects) {
		var selection = d3.select('#WKCReadModuleSubscribeSuggestionsList')
			.selectAll('.WKCReadModuleSubscribeSuggestionsListItem').data(suggestionObjects);
		
		var parentElement = selection.enter()
			.append('li')
				.attr('class', 'WKCReadModuleSubscribeSuggestionsListItem');

		parentElement.append('button')
			.attr('class', 'WKCReadModuleSubscribeSuggestionsListItemButton');

		parentElement.append('span')
			.append('span')
				.attr('class', 'WKCReadModuleSubscribeSuggestionsListItemName');

		parentElement = parentElement.merge(selection);

		parentElement.select('.WKCReadModuleSubscribeSuggestionsListItemButton')
			.on('click', function(e) {
				moi.commandsFetchURL(e.WKCSuggestionURL, kWKCReadModuleSubscribeHandlerMap[e.WKCSuggestionType]);
			})
			.text(function(e) {
				return e.WKCSuggestionURL;
			});

		parentElement.select('.WKCReadModuleSubscribeSuggestionsListItemName')
			.html(function(e) {
				return [
					'&nbsp;',
					'(',
					OLSKLocalized('WKCReadModuleSubscribeSuggestionsNameText'.concat(e.WKCSuggestionType)),
					')',
				].join('');
			});

		selection.exit().remove();

		d3.select('#WKCReadModuleSubscribeSuggestions').classed('WKCSharedHidden', !suggestionObjects.length);
	};

	//_ reactConfirmationVisibility

	moi.reactConfirmationVisibility = function (isVisible) {
		d3.select('#WKCReadModuleSubscribeConfirmation').classed('WKCSharedHidden', !isVisible);
	};

	//_ reactConfirmationType

	moi.reactConfirmationType = function (inputData) {
		d3.select('#WKCReadModuleSubscribeConfirmationFormType').property('value', inputData);
	};

	//_ reactPreviewShared

	moi.reactPreviewShared = function (titleContent, blurbContent, typeContent) {
		if (titleContent) {
			d3.select('#WKCReadModuleSubscribeConfirmationFormName').property('value', titleContent);
		}

		if (blurbContent) {
			d3.select('#WKCReadModuleSubscribeConfirmationFormBlurb').property('value', blurbContent);
		}
		d3.select('#WKCReadModuleSubscribePreviewHeadingType').html(typeContent);

		moi.reactConfirmationVisibility(true);
		
		moi.reactFetchFormVisibility(false);

		d3.select('#WKCReadModuleSubscribeConfirmationFormName').attr('autofocus', true);
	};

	//_ reactPreviewFeedItems

	moi.reactPreviewFeedItems = function (itemElements) {
		var selection = d3.select('#WKCReadModuleSubscribePreviewFeedList')
			.selectAll('.WKCReadModuleSubscribePreviewFeedItem').data(itemElements);
		
		selection.enter()
			.append('li')
				.attr('class', 'WKCReadModuleSubscribePreviewFeedItem')
				.merge(selection)
					.html(function(e) {
						return stringContentForFirstElement(e.getElementsByTagName('title'));
					});

		selection.exit().remove();

		d3.select('#WKCReadModuleSubscribePreviewFeed').classed('WKCSharedHidden', !itemElements.length);
	};

	//_ reactPreviewFile

	moi.reactPreviewFile = function (inputData) {
		d3.select('#WKCReadModuleSubscribePreviewFile pre').html(inputData);

		d3.select('#WKCReadModuleSubscribePreviewFile').classed('WKCSharedHidden', !inputData);
	};

	//_ reactPreviewPage

	moi.reactPreviewPage = function (inputData) {
		d3.select('#WKCReadModuleSubscribePreviewPage').html(inputData);

		d3.select('#WKCReadModuleSubscribePreviewPage').classed('WKCSharedHidden', !inputData);
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

	Object.assign(exports, moi);

	Object.defineProperty(exports, '__esModule', { value: true });

})));
