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
			WKCReadModuleSubscribeSuggestions.WKCReadModuleSubscribeSuggestionsTypeCustomTwitterTimeline(),
			OLSKPublicConstants('WKCSubscriptionHandlerCustomTwitterTimeline'),
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

		d3.json(OLSKCanonicalFor('WKCRouteAPISubscriptionsFetch'), {
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
		.then(function(responseJSON) {
			if (responseJSON.error === 'WKCErrorCustomTwitterMissingToken') {
				return moi.commandsFetchAlertErrorCustomTwitterMissingToken();
			}

			if (responseJSON.error) {
				throw new Error(responseJSON.error);
			}

			if (fetchHandler === OLSKPublicConstants('WKCSubscriptionHandlerCustomTwitterTimeline')) {
				return moi.commandsConfirmationCustomTwitterTimeline(inputData, responseJSON.contents);
			}

			var parsedXML = (new DOMParser()).parseFromString(responseJSON.contents, 'application/xml');

			if (OLSKType.OLSKTypeInputDataIsDOMDocumentRSS(parsedXML)) {
				return moi.commandsConfirmationFeedRSS(inputData, parsedXML);
			}

			if (OLSKType.OLSKTypeInputDataIsDOMDocumentAtom(parsedXML)) {
				return moi.commandsConfirmationFeedAtom(inputData, parsedXML);
			}

			var parsedHTML = (new DOMParser()).parseFromString(responseJSON.contents, 'text/html');

			if (OLSKType.OLSKTypeInputDataIsDOMDocumentHTML(parsedHTML)) {
				return moi.commandsConfirmationPage(inputData, parsedHTML);
			}

			return moi.commandsConfirmationFile(inputData, responseJSON.contents);
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

	//_ commandsFetchAlertErrorCustomTwitterMissingToken

	moi.commandsFetchAlertErrorCustomTwitterMissingToken = function (error) {
		window.alert(OLSKLocalized('WKCReadModuleSubscribeErrorCustomTwitterMissingToken'));
	};

	//_ commandsConfirmationFeedRSS

	moi.commandsConfirmationFeedRSS = function (inputData, parsedXML) {
		moi.reactConfirmationFormName(stringContentForFirstElement(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('title')));

		moi.reactConfirmationFormBlurb(stringContentForFirstElement(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('description')));
		
		moi.reactConfirmationFormType(OLSKPublicConstants('WKCSubscriptionHandlerFeedRSS'));

		moi.reactConfirmationPreviewHeadingType(OLSKLocalized('WKCReadModuleSubscribeConfirmationPreviewHeadingTypeFeedRSSText'));

		moi.reactConfirmationPreviewArticles(WKCResponseParser.WKCResponseParserArticlesForFeedRSS(new DOMParser(), null, new XMLSerializer().serializeToString(parsedXML.documentElement)));

		moi.reactConfirmationShared();
	};

	//_ commandsConfirmationFeedAtom

	moi.commandsConfirmationFeedAtom = function (inputData, parsedXML) {
		moi.reactConfirmationFormName(stringContentForFirstElement(parsedXML.getElementsByTagName('title')));

		moi.reactConfirmationFormBlurb(stringContentForFirstElement(parsedXML.getElementsByTagName('subtitle')));
		
		moi.reactConfirmationFormType(OLSKPublicConstants('WKCSubscriptionHandlerFeedAtom'));

		moi.reactConfirmationPreviewHeadingType(OLSKLocalized('WKCReadModuleSubscribeConfirmationPreviewHeadingTypeFeedAtomText'));

		moi.reactConfirmationPreviewArticles(WKCResponseParser.WKCResponseParserArticlesForFeedAtom(new DOMParser(), null, new XMLSerializer().serializeToString(parsedXML.documentElement)));

		moi.reactConfirmationShared();
	};

	//_ commandsConfirmationPage

	moi.commandsConfirmationPage = function (inputData, parsedHTML) {
		moi.reactAlternatives([].slice.call(parsedHTML.getElementsByTagName('link')).filter(function(e) {
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
		moi.reactConfirmationPreviewPage(showdownInstance.makeHtml(turndownInstance.turndown(parsedHTML.body)));

		moi.reactConfirmationFormName(parsedHTML.getElementsByTagName('title')[0].textContent);

		moi.reactConfirmationFormBlurb([].slice.call(parsedHTML.getElementsByTagName('meta')).filter(function(e) {
			if (e.name === 'description') {
				return true;
			}
			
			if (d3.select(e).attr('property') === 'og:description') {
				return true;
			}
			
			return false;
		}).map(function(e) {
			return e.content;
		}).shift());

		moi.reactConfirmationFormType(OLSKPublicConstants('WKCSubscriptionHandlerPage'));

		moi.reactConfirmationPreviewHeadingType(OLSKLocalized('WKCReadModuleSubscribeConfirmationPreviewHeadingTypePageText'));

		moi.reactConfirmationShared();
	};

	//_ commandsConfirmationFile

	moi.commandsConfirmationFile = function (inputData, rawData) {
		moi.reactConfirmationPreviewFile(rawData);

		moi.reactConfirmationFormName(inputData.match(/https?:\/\/(.*)/)[1]);

		moi.reactConfirmationFormType(OLSKPublicConstants('WKCSubscriptionHandlerFile'));

		moi.reactConfirmationPreviewHeadingType(OLSKLocalized('WKCReadModuleSubscribeConfirmationPreviewHeadingTypeFileText'));

		moi.reactConfirmationShared();
	};

	//_ commandsConfirmationCustomTwitterTimeline

	moi.commandsConfirmationCustomTwitterTimeline = function (inputData, responseJSON) {
		const articleObjects = WKCResponseParser.WKCResponseParserArticlesForCustomTwitterTimeline(null, responseJSON);

		moi.reactConfirmationPreviewArticles(articleObjects);

		moi.reactConfirmationFormName(['Twitter', (articleObjects.length ? `@${JSON.parse(responseJSON)[0].user.screen_name}` : null)].filter(function (e) {
			return !!e;
		}).join(': '));

		if (articleObjects.length) {
			moi.reactConfirmationFormBlurb(JSON.parse(responseJSON)[0].user.description);
		}
		
		moi.reactConfirmationFormType(OLSKPublicConstants('WKCSubscriptionHandlerCustomTwitterTimeline'));

		moi.reactConfirmationPreviewHeadingType(OLSKLocalized('WKCReadModuleSubscribeConfirmationPreviewHeadingTypeCustomTwitterTimelineText'));

		moi.reactConfirmationShared();
	};

	//_ commandsConfirmationClear

	moi.commandsConfirmationClear = function () {
		moi.propertiesFetchURL('');

		moi.reactAlternatives([]);
		moi.reactSuggestions([]);
		moi.reactConfirmationPreviewArticles([]);
		moi.reactConfirmationPreviewPage('');
		moi.reactConfirmationPreviewFile('');
		moi.reactConfirmationVisibility(false);
		moi.reactFetchFormVisibility(true);

		d3.selectAll('.WKCReadModuleSubscribeConfirmationPreview').classed('WKCSharedHidden', true);

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

	//_ reactAlternatives

	moi.reactAlternatives = function (feedURLs) {
		var selection = d3.select('#WKCReadModuleSubscribeAlternatives ul')
			.selectAll('.WKCReadModuleSubscribeAlternativesItem').data(feedURLs);
		
		selection.enter()
			.append('li')
				.attr('class', 'WKCReadModuleSubscribeAlternativesItem')
				.append('button')
				.on('click', function(e) {
					moi.commandsFetchURL(e);
				})
				.merge(selection)
					.html(function(e) {
						return e;
					});

		selection.exit().remove();

		d3.select('#WKCReadModuleSubscribeAlternatives').classed('WKCSharedHidden', !feedURLs.length);
	};

	//_ reactConfirmationVisibility

	moi.reactConfirmationVisibility = function (isVisible) {
		d3.select('#WKCReadModuleSubscribeConfirmation').classed('WKCSharedHidden', !isVisible);
	};

	//_ reactConfirmationFormName

	moi.reactConfirmationFormName = function (inputData) {
		d3.select('#WKCReadModuleSubscribeConfirmationFormName').property('value', inputData)
	};

	//_ reactConfirmationFormBlurb

	moi.reactConfirmationFormBlurb = function (inputData) {
		d3.select('#WKCReadModuleSubscribeConfirmationFormBlurb').property('value', inputData)
	};

	//_ reactConfirmationFormType

	moi.reactConfirmationFormType = function (inputData) {
		d3.select('#WKCReadModuleSubscribeConfirmationFormType').property('value', inputData);
	};

	//_ reactConfirmationPreviewHeadingType

	moi.reactConfirmationPreviewHeadingType = function (inputData) {
		d3.select('#WKCReadModuleSubscribeConfirmationPreviewHeadingType').text(inputData);
	};

	//_ reactConfirmationPreviewArticles

	moi.reactConfirmationPreviewArticles = function (articleObjects) {
		var selection = d3.select('#WKCReadModuleSubscribeConfirmationPreviewArticlesList')
			.selectAll('.WKCReadModuleSubscribeConfirmationPreviewArticlesItem').data(articleObjects);
		
		selection.enter()
			.append('li')
				.attr('class', 'WKCReadModuleSubscribeConfirmationPreviewArticlesItem')
				.merge(selection)
					.text(function(e) {
						return [
							moment(e.WKCArticlePublishDate).format('MMMM Do YYYY, h:mm:ss a'),
							e.WKCArticleTitle || e.WKCArticleBody,
						].join(': ');
					});

		selection.exit().remove();

		d3.select('#WKCReadModuleSubscribeConfirmationPreviewArticles').classed('WKCSharedHidden', !articleObjects.length);
	};

	//_ reactConfirmationPreviewPage

	moi.reactConfirmationPreviewPage = function (inputData) {
		d3.select('#WKCReadModuleSubscribeConfirmationPreviewPage').html(inputData);

		d3.select('#WKCReadModuleSubscribeConfirmationPreviewPage').classed('WKCSharedHidden', !inputData);
	};

	//_ reactConfirmationPreviewFile

	moi.reactConfirmationPreviewFile = function (inputData) {
		d3.select('#WKCReadModuleSubscribeConfirmationPreviewFile pre').html(inputData);

		d3.select('#WKCReadModuleSubscribeConfirmationPreviewFile').classed('WKCSharedHidden', !inputData);
	};

	//_ reactConfirmationShared

	moi.reactConfirmationShared = function () {
		moi.reactConfirmationVisibility(true);
		
		moi.reactFetchFormVisibility(false);

		d3.select('#WKCReadModuleSubscribeConfirmationFormName').attr('autofocus', true);
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
