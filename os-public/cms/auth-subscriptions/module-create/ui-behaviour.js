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

	var moi = {};

	var WKSubscriptionsModuleCreatePropertyAPIToken;

	var stringContentForFirstElement = function (inputData) {
		return inputData[0] ? inputData[0].textContent.trim() : '';
	}

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
		moi._commandsSubscriptionsCreate({
			WKCSubscriptionURL: d3.select('#WKCSubscriptionsModuleCreateFetchFormInput').node().value,
			WKCSubscriptionType: d3.select('#WKCSubscriptionsModuleCreateConfirmationFormType').node().value,
			WKCSubscriptionName: d3.select('#WKCSubscriptionsModuleCreateConfirmationFormName').node().value,
			WKCSubscriptionBlurb: d3.select('#WKCSubscriptionsModuleCreateConfirmationFormBlurb').node().value,
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

	moi.commandsFetchURL = function (inputData) {
		if (!inputData) {
			return;
		}
		
		moi.commandsConfirmationClear();

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
		})
		.then(function(data) {
			var parsedXML = (new DOMParser()).parseFromString(data, 'application/xml');

			if (OLSKType.OLSKTypeInputDataIsDOMDocumentRSS(parsedXML)) {
				return moi.commandsConfirmURLFeedRSS(inputData, parsedXML);
			}

			if (OLSKType.OLSKTypeInputDataIsDOMDocumentAtom(parsedXML)) {
				return moi.commandsConfirmURLFeedAtom(inputData, parsedXML);
			}

			var parsedHTML = (new DOMParser()).parseFromString(data, 'text/html');

			if (OLSKType.OLSKTypeInputDataIsDOMDocumentHTML(parsedHTML)) {
				return moi.commandsConfirmURLPage(inputData, parsedHTML);
			}

			return moi.commandsConfirmURLFile(inputData, data);
		})
		.catch(moi.commandsFetchAlertError)
		.finally(function () {
			moi.reactAlternativesSources(WKCSubscriptionsModuleCreateSuggestions.WKCSubscriptionsModuleCreateSuggestionsFor(inputData));
		});
	};

	//_ commandsFetchAlertError

	moi.commandsFetchAlertError = function (error) {
		window.alert(OLSKLocalized('WKCSubscriptionsModuleCreateErrorFetchText'));

		moi.reactFetchLoaderVisibility(false);

		d3.select('#WKCSubscriptionsModuleCreateFetchFormInput').node().focus();

		throw error;
	};

	//_ commandsConfirmURLFeedRSS

	moi.commandsConfirmURLFeedRSS = function (inputData, parsedXML) {
		moi.reactConfirmationType(OLSKPublicConstants.WKCSubscriptionTypeFeedRSS);

		moi.reactPreviewFeedItems([].slice.call(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('item')));
		
		moi.reactPreviewShared(stringContentForFirstElement(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('title')), stringContentForFirstElement(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('description')), OLSKLocalized('WKCSubscriptionsModuleCreatePreviewTypeFeedRSSText'));
	};

	//_ commandsConfirmURLFeedAtom

	moi.commandsConfirmURLFeedAtom = function (inputData, parsedXML) {
		moi.reactConfirmationType(OLSKPublicConstants.WKCSubscriptionTypeFeedAtom);

		moi.reactPreviewFeedItems([].slice.call(parsedXML.getElementsByTagName('entry')));
		
		moi.reactPreviewShared(stringContentForFirstElement(parsedXML.getElementsByTagName('title')), stringContentForFirstElement(parsedXML.getElementsByTagName('subtitle')), OLSKLocalized('WKCSubscriptionsModuleCreatePreviewTypeFeedAtomText'));
	};

	//_ commandsConfirmURLFile

	moi.commandsConfirmURLFile = function (inputData, rawData) {
		moi.reactConfirmationType(OLSKPublicConstants.WKCSubscriptionTypeFile);
		
		moi.reactPreviewFile(rawData);

		moi.reactPreviewShared(inputData.match(/https?:\/\/(.*)/)[1], null, OLSKLocalized('WKCSubscriptionsModuleCreatePreviewTypeFileText'));
	};

	//_ commandsConfirmURLPage

	moi.commandsConfirmURLPage = function (inputData, parsedHTML) {
		moi.reactConfirmationType(OLSKPublicConstants.WKCSubscriptionTypePage);
		
		moi.reactAlternativesFeeds([].slice.call(parsedHTML.getElementsByTagName('link')).filter(function(e) {
			return [
				'application/rss+xml',
				'application/atom+xml',
				].indexOf(e.type.trim().toLowerCase()) !== -1;
		}).map(function(e) {
			return WKSubscriptionsLogic.WKSubscriptionsModuleCreateCompleteURL(d3.select(e).attr('href'), inputData);
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
		}).shift(), OLSKLocalized('WKCSubscriptionsModuleCreatePreviewTypePageText'));
	};

	//_ commandsConfirmationClear

	moi.commandsConfirmationClear = function () {
		moi.reactConfirmationVisibility(false);
		moi.reactFetchFormVisibility(true);
		moi.reactPreviewFeedItems([]);
		moi.reactAlternativesFeeds([]);
		moi.reactAlternativesSources([]);

		d3.selectAll('.WKCSubscriptionsModuleCreatePreview').classed('WKCSubscriptionsHidden', true);

		d3.select('#WKCSubscriptionsModuleCreateConfirmationFormName').property('value', '');
		d3.select('#WKCSubscriptionsModuleCreateConfirmationFormBlurb').property('value', '');

		d3.select('#WKCSubscriptionsModuleCreateFetchFormInput').property('value', '');
		d3.select('#WKCSubscriptionsModuleCreateFetchFormInput').node().focus();
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
			moi.reactFetchFlash(OLSKFormatted(OLSKLocalized('WKCSubscriptionsModuleCreateFlashFormat'), subscriptionObject.WKCSubscriptionURL));
		}, moi._commandsSubscriptionsAlertErrorCreate);
	};

	//_ _commandsSubscriptionsAlertErrorCreate

	moi._commandsSubscriptionsAlertErrorCreate = function (error) {
		window.alert(OLSKLocalized('WKCSubscriptionsModuleCreateErrorCreateText'));

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

	//_ reactFetchFlash

	moi.reactFetchFlash = function (inputData) {
		d3.select('#WKCSubscriptionsModuleCreateFetchFlash')
			.text(inputData)
			.classed('WKCSubscriptionsHidden', false)
			.style('opacity', 0)
			.transition()
				.duration(275)
				.style('opacity', 1)
				.transition()
					.delay(2000)
					.style('opacity', 0)
					.on('end', function () {
						d3.select('#WKCSubscriptionsModuleCreateFetchFlash')
		        	.text(inputData)
		        	.classed('WKCSubscriptionsHidden', true);
		      });
	};

	//_ reactAlternativesFeeds

	moi.reactAlternativesFeeds = function (alternativeURLs) {
		var selection = d3.select('#WKCSubscriptionsModuleCreateAlternativesFeeds ul')
			.selectAll('.WKCSubscriptionsModuleCreateAlternativesFeedsItem').data(alternativeURLs);
		
		selection.enter()
			.append('li')
				.attr('class', 'WKCSubscriptionsModuleCreateAlternativesFeedsItem')
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

		d3.select('#WKCSubscriptionsModuleCreateAlternativesFeeds').classed('WKCSubscriptionsHidden', !alternativeURLs.length);
	};

	//_ reactAlternativesSources

	moi.reactAlternativesSources = function (alternativeURLs) {
		var selection = d3.select('#WKCSubscriptionsModuleCreateAlternativesSourcesList')
			.selectAll('.WKCSubscriptionsModuleCreateAlternativesSourcesListItem').data(alternativeURLs);
		
		var parentElement = selection.enter()
			.append('li')
				.attr('class', 'WKCSubscriptionsModuleCreateAlternativesSourcesListItem');

		parentElement.append('button')
			.attr('class', 'WKCSubscriptionsModuleCreateAlternativesSourcesListItemButton');

		parentElement.append('span')
			.append('span')
				.attr('class', 'WKCSubscriptionsModuleCreateAlternativesSourcesListItemName');

		parentElement = parentElement.merge(selection);

		parentElement.select('.WKCSubscriptionsModuleCreateAlternativesSourcesListItemButton')
			.on('click', function(e) {
				d3.select('#WKCSubscriptionsModuleCreateFetchFormInput').property('value', e.WKCSuggestionURL)
				
				moi.commandsFetchURL(e.WKCSuggestionURL);
			})
			.text(function(e) {
				return e.WKCSuggestionURL;
			});

		parentElement.select('.WKCSubscriptionsModuleCreateAlternativesSourcesListItemName')
			.html(function(e) {
				return [
					'&nbsp;',
					'(',
					OLSKLocalized('WKCSubscriptionsModuleCreateAlternativesSourcesNameText'.concat(e.WKCSuggestionType)),
					')',
				].join('');
			});

		selection.exit().remove();

		d3.select('#WKCSubscriptionsModuleCreateAlternativesSources').classed('WKCSubscriptionsHidden', !alternativeURLs.length);
	};

	//_ reactConfirmationVisibility

	moi.reactConfirmationVisibility = function (isVisible) {
		d3.select('#WKCSubscriptionsModuleCreateConfirmation').classed('WKCSubscriptionsHidden', !isVisible);
	};

	//_ reactConfirmationType

	moi.reactConfirmationType = function (inputData) {
		d3.select('#WKCSubscriptionsModuleCreateConfirmationFormType').property('value', inputData);
	};

	//_ reactPreviewShared

	moi.reactPreviewShared = function (titleContent, blurbContent, typeContent) {
		moi.reactFetchLoaderVisibility(false);

		if (titleContent) {
			d3.select('#WKCSubscriptionsModuleCreateConfirmationFormName').property('value', titleContent);
		}

		if (blurbContent) {
			d3.select('#WKCSubscriptionsModuleCreateConfirmationFormBlurb').property('value', blurbContent);
		}
		d3.select('#WKCSubscriptionsModuleCreatePreviewHeadingType').html(typeContent);

		moi.reactConfirmationVisibility(true);
		
		moi.reactFetchFormVisibility(false);

		d3.select('#WKCSubscriptionsModuleCreateConfirmationFormName').attr('autofocus', true);
	};

	//_ reactPreviewFeedItems

	moi.reactPreviewFeedItems = function (itemElements) {
		var selection = d3.select('#WKCSubscriptionsModuleCreatePreviewFeedList')
			.selectAll('.WKCSubscriptionsModuleCreatePreviewFeedItem').data(itemElements);
		
		selection.enter()
			.append('li')
				.attr('class', 'WKCSubscriptionsModuleCreatePreviewFeedItem')
				.merge(selection)
					.html(function(e) {
						return stringContentForFirstElement(e.getElementsByTagName('title'));
					});

		selection.exit().remove();

		d3.select('#WKCSubscriptionsModuleCreatePreviewFeed').classed('WKCSubscriptionsHidden', false);
	};

	//_ reactPreviewFile

	moi.reactPreviewFile = function (inputData) {
		d3.select('#WKCSubscriptionsModuleCreatePreviewFile pre').html(inputData);

		d3.select('#WKCSubscriptionsModuleCreatePreviewFile').classed('WKCSubscriptionsHidden', false);
	};

	//_ reactPreviewPage

	moi.reactPreviewPage = function (inputData) {
		d3.select('#WKCSubscriptionsModuleCreatePreviewPage').html(inputData);

		d3.select('#WKCSubscriptionsModuleCreatePreviewPage').classed('WKCSubscriptionsHidden', false);
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
