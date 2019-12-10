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
		moi.ControlFetchURL(moi.propertiesFetchURL());
	};

	//_ interfaceConfirmationFormDidSubmit

	moi.interfaceConfirmationFormDidSubmit = function () {
		moi._ControlSubscriptionsCreate({
			WKCSubscriptionURL: moi.propertiesFetchURL(),
			WKCSubscriptionHandler: d3.select('#WKCReadModuleSubscribeConfirmationFormType').node().value,
			WKCSubscriptionName: d3.select('#WKCReadModuleSubscribeConfirmationFormName').node().value,
			WKCSubscriptionBlurb: d3.select('#WKCReadModuleSubscribeConfirmationFormBlurb').node().value,
		});
	};

	//_ interfaceConfirmationClearButtonDidClick

	moi.interfaceConfirmationClearButtonDidClick = function () {
		moi.ControlConfirmationClear();
	};

	//# CONTROL

	//_ ControlAlertConnectionError

	moi.ControlAlertConnectionError = function (error) {
		window.alert(OLSKLocalized('WKSharedErrorServiceUnavailable'));

		throw error;
	};

	//_ ControlAlertTokenUnavailable

	moi.ControlAlertTokenUnavailable = function () {
		window.alert(OLSKLocalized('WKSharedErrorTokenUnavailable'));

		throw new Error('WKCAppErrorTokenUnavailable');
	};

	//_ ControlFetchURL

	moi.ControlFetchURL = function (inputData, fetchHandler) {
		if (!inputData) {
			return;
		}

		moi.ControlConfirmationClear();

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
				return moi.ControlFetchAlertErrorCustomTwitterMissingToken();
			}

			if (responseJSON.error) {
				throw new Error(responseJSON.error);
			}

			if (fetchHandler === OLSKPublicConstants('WKCSubscriptionHandlerCustomTwitterTimeline')) {
				return moi.ControlConfirmationCustomTwitterTimeline(inputData, responseJSON.contents);
			}

			var parsedXML = (new DOMParser()).parseFromString(responseJSON.contents, 'application/xml');

			if (OLSKType.OLSKTypeInputDataIsDOMDocumentRSS(parsedXML)) {
				return moi.ControlConfirmationFeedRSS(inputData, parsedXML);
			}

			if (OLSKType.OLSKTypeInputDataIsDOMDocumentAtom(parsedXML)) {
				return moi.ControlConfirmationFeedAtom(inputData, parsedXML);
			}

			var parsedHTML = (new DOMParser()).parseFromString(responseJSON.contents, 'text/html');

			if (OLSKType.OLSKTypeInputDataIsDOMDocumentHTML(parsedHTML)) {
				return moi.ControlConfirmationPage(inputData, parsedHTML);
			}

			return moi.ControlConfirmationFile(inputData, responseJSON.contents);
		})
		.catch(moi.ControlFetchAlertError)
		.finally(function () {
			moi.reactFetchLoaderVisibility(false);
			
			moi.reactSuggestions(WKCReadModuleSubscribeSuggestions.WKCReadModuleSubscribeSuggestionsFor(inputData));
		});
	};

	//_ ControlFetchAlertError

	moi.ControlFetchAlertError = function (error) {
		window.alert(OLSKLocalized('WKCReadModuleSubscribeErrorFetchText'));

		moi.reactFetchLoaderVisibility(false);

		d3.select('#WKCReadModuleSubscribeFetchFormURL').node().focus();

		throw error;
	};

	//_ ControlFetchAlertErrorCustomTwitterMissingToken

	moi.ControlFetchAlertErrorCustomTwitterMissingToken = function (error) {
		window.alert(OLSKLocalized('WKCReadModuleSubscribeErrorCustomTwitterMissingToken'));
	};

	//_ ControlConfirmationFeedRSS

	moi.ControlConfirmationFeedRSS = function (inputData, parsedXML) {
		moi.reactConfirmationFormName(stringContentForFirstElement(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('title')));

		moi.reactConfirmationFormBlurb(stringContentForFirstElement(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('description')));
		
		moi.reactConfirmationFormType(OLSKPublicConstants('WKCSubscriptionHandlerFeedRSS'));

		moi.reactConfirmationPreviewHeadingType(OLSKLocalized('WKCReadModuleSubscribeConfirmationPreviewHeadingTypeFeedRSSText'));

		moi.reactConfirmationPreviewArticles(WKCParser.WKCParserArticlesForFeedRSS(new DOMParser(), null, new XMLSerializer().serializeToString(parsedXML.documentElement)));

		moi.reactConfirmationShared();
	};

	//_ ControlConfirmationFeedAtom

	moi.ControlConfirmationFeedAtom = function (inputData, parsedXML) {
		moi.reactConfirmationFormName(stringContentForFirstElement(parsedXML.getElementsByTagName('title')));

		moi.reactConfirmationFormBlurb(stringContentForFirstElement(parsedXML.getElementsByTagName('subtitle')));
		
		moi.reactConfirmationFormType(OLSKPublicConstants('WKCSubscriptionHandlerFeedAtom'));

		moi.reactConfirmationPreviewHeadingType(OLSKLocalized('WKCReadModuleSubscribeConfirmationPreviewHeadingTypeFeedAtomText'));

		moi.reactConfirmationPreviewArticles(WKCParser.WKCParserArticlesForFeedAtom(new DOMParser(), null, new XMLSerializer().serializeToString(parsedXML.documentElement)));

		moi.reactConfirmationShared();
	};

	//_ ControlConfirmationPage

	moi.ControlConfirmationPage = function (inputData, parsedHTML) {
		moi.reactAlternatives([].slice.call(parsedHTML.getElementsByTagName('link')).filter(function(e) {
			return [
				'application/rss+xml',
				'application/atom+xml',
				].indexOf(e.type.trim().toLowerCase()) !== -1;
		}).map(function(e) {
			return {
				WKCAlternativeURL: WKCReadLogic.WKCReadModuleSubscribeCompleteURL(d3.select(e).attr('href'), inputData),
				WKCAlternativeTitle: d3.select(e).attr('title'),
			};
		}));

		moi.reactConfirmationPreviewPage(WKCParser.WKCParserHTMLForPlaintext(WKCParser.WKCParserPlaintextForHTML(parsedHTML.body.innerHTML)));

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

	//_ ControlConfirmationFile

	moi.ControlConfirmationFile = function (inputData, rawData) {
		moi.reactConfirmationPreviewFile(rawData);

		moi.reactConfirmationFormName(inputData.match(/https?:\/\/(.*)/)[1]);

		moi.reactConfirmationFormType(OLSKPublicConstants('WKCSubscriptionHandlerFile'));

		moi.reactConfirmationPreviewHeadingType(OLSKLocalized('WKCReadModuleSubscribeConfirmationPreviewHeadingTypeFileText'));

		moi.reactConfirmationShared();
	};

	//_ ControlConfirmationCustomTwitterTimeline

	moi.ControlConfirmationCustomTwitterTimeline = function (inputData, responseJSON) {
		const articleObjects = WKCParser.WKCParserArticlesForCustomTwitterTimeline(null, responseJSON);

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

	//_ ControlConfirmationClear

	moi.ControlConfirmationClear = function () {
		moi.propertiesFetchURL('');

		moi.reactAlternatives([]);
		moi.reactSuggestions([]);
		moi.reactConfirmationPreviewArticles([]);
		moi.reactConfirmationPreviewPage('');
		moi.reactConfirmationPreviewFile('');
		moi.reactConfirmationVisibility(false);
		moi.reactFetchFormVisibility(true);

		d3.selectAll('.WKCReadModuleSubscribeConfirmationPreview').classed('KVCSharedHidden', true);

		d3.select('#WKCReadModuleSubscribeConfirmationFormName').property('value', '');
		d3.select('#WKCReadModuleSubscribeConfirmationFormBlurb').property('value', '');

		d3.select('#WKCReadModuleSubscribeFetchFormURL').node().focus();
	};

	//_ _ControlSubscriptionsCreate

	moi._ControlSubscriptionsCreate = function (subscriptionObject) {
		return d3.json(OLSKCanonicalFor('WKCRouteAPISubscriptionsCreate'), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify(subscriptionObject),
		}).then(function(responseJSON) {
			Object.assign(subscriptionObject, responseJSON);

			moi.ControlConfirmationClear();
			moi.reactFetchFlash(OLSKFormatted(OLSKLocalized('WKCReadModuleSubscribeFlashFormat'), subscriptionObject.WKCSubscriptionURL));
		}, moi._ControlSubscriptionsAlertErrorCreate);
	};

	//_ _ControlSubscriptionsAlertErrorCreate

	moi._ControlSubscriptionsAlertErrorCreate = function (error) {
		window.alert(OLSKLocalized('WKCReadModuleSubscribeErrorCreateText'));

		throw error;
	};

	//# REACT

	//_ reactFetchFormVisibility

	moi.reactFetchFormVisibility = function (isVisible) {
		d3.select('#WKCReadModuleSubscribeFetchForm').classed('KVCSharedHidden', !isVisible);
	};

	//_ reactFetchLoaderVisibility

	moi.reactFetchLoaderVisibility = function (isVisible) {
		d3.select('#WKCReadModuleSubscribeLoader').classed('KVCSharedHidden', !isVisible);
	};

	//_ reactFetchFlash

	moi.reactFetchFlash = function (inputData) {
		d3.select('#WKCReadModuleSubscribeFetchFlash')
			.text(inputData)
			.classed('KVCSharedHidden', false)
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
		        	.classed('KVCSharedHidden', true);
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
				moi.ControlFetchURL(e.WKCSuggestionURL, kWKCReadModuleSubscribeHandlerMap[e.WKCSuggestionType]);
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

		d3.select('#WKCReadModuleSubscribeSuggestions').classed('KVCSharedHidden', !suggestionObjects.length);
	};

	//_ reactAlternatives

	moi.reactAlternatives = function (alternativeObjects) {
		var selection = d3.select('#WKCReadModuleSubscribeAlternativesList')
			.selectAll('.WKCReadModuleSubscribeAlternativesItem').data(alternativeObjects);

		var parentElement = selection.enter()
			.append('li')
				.attr('class', 'WKCReadModuleSubscribeAlternativesItem');

		parentElement.append('button')
			.attr('class', 'WKCReadModuleSubscribeSuggestionsListItemButton');

		parentElement.append('span')
			.attr('class', 'WKCReadModuleSubscribeAlternativesItemItemName')
			.html('&nbsp;(<span></span>)');

		parentElement = parentElement.merge(selection);

		parentElement.select('.WKCReadModuleSubscribeSuggestionsListItemButton')
			.html(function(e) {
				return e.WKCAlternativeURL;
			})
			.on('click', function(e) {
				moi.ControlFetchURL(e.WKCAlternativeURL);
			});

		parentElement.select('.WKCReadModuleSubscribeAlternativesItemItemName')
			.classed('KVCSharedHidden', function (e) {
				return !e.WKCAlternativeTitle;
			})
			.select('span')
				.html(function(e) {
					return e.WKCAlternativeTitle;
				});

		selection.exit().remove();

		d3.select('#WKCReadModuleSubscribeAlternatives').classed('KVCSharedHidden', !alternativeObjects.length);
	};

	//_ reactConfirmationVisibility

	moi.reactConfirmationVisibility = function (isVisible) {
		d3.select('#WKCReadModuleSubscribeConfirmation').classed('KVCSharedHidden', !isVisible);
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
		articleObjects = articleObjects.sort(function (a, b) {
			return a.WKCArticlePublishDate < b.WKCArticlePublishDate;
		});

		var selection = d3.select('#WKCReadModuleSubscribeConfirmationPreviewArticlesList')
			.selectAll('.WKCReadModuleSubscribeConfirmationPreviewArticlesItem').data(articleObjects);
		
		selection.enter()
			.append('li')
				.attr('class', 'WKCReadModuleSubscribeConfirmationPreviewArticlesItem')
				.merge(selection)
					.text(function(e) {
						return [
							moment(e.WKCArticlePublishDate).format('MMMM Do YYYY, h:mm:ss a'),
							e.WKCArticleTitle || e.WKCArticleSnippet,
						].join(': ');
					});

		selection.exit().remove();

		d3.select('#WKCReadModuleSubscribeConfirmationPreviewArticles').classed('KVCSharedHidden', !articleObjects.length);

		d3.select('#WKCReadModuleSubscribeConfirmationFrequency').classed('KVCSharedHidden', articleObjects.length < 10);

		d3.select('#WKCReadModuleSubscribeConfirmationEmpty').classed('KVCSharedHidden', articleObjects.length);

		if (articleObjects.length < 10) {
			return;
		}

		if (d3.extent(articleObjects.map(function (e) {
				return e.WKCArticlePublishDate;
			})).reverse().reduce(function (coll, e) {
				return !coll ? moment(e) : moment.duration(coll.diff(moment(e))).as('hours');
			}, null) < 1) {
			return;
		}

		d3.select('#WKCReadModuleSubscribeConfirmationFrequency').text(OLSKFormatted(OLSKLocalized('WKCReadModuleSubscribeConfirmationFrequencyFormat'), Math.round(articleObjects.length / d3.extent(articleObjects.map(function (e) {
				return e.WKCArticlePublishDate;
			})).reverse().reduce(function (coll, e) {
				return !coll ? moment(e) : moment.duration(coll.diff(moment(e))).as('days');
			}, null) * 7 * 10) / 10));
	};

	//_ reactConfirmationPreviewPage

	moi.reactConfirmationPreviewPage = function (inputData) {
		d3.select('#WKCReadModuleSubscribeConfirmationPreviewPage').html(inputData);

		d3.select('#WKCReadModuleSubscribeConfirmationPreviewPage').classed('KVCSharedHidden', !inputData);

		d3.select('#WKCReadModuleSubscribeConfirmationEmpty').classed('KVCSharedHidden', !!inputData.trim());
	};

	//_ reactConfirmationPreviewFile

	moi.reactConfirmationPreviewFile = function (inputData) {
		d3.select('#WKCReadModuleSubscribeConfirmationPreviewFile pre').html(inputData);

		d3.select('#WKCReadModuleSubscribeConfirmationPreviewFile').classed('KVCSharedHidden', !inputData);

		d3.select('#WKCReadModuleSubscribeConfirmationEmpty').classed('KVCSharedHidden', !!inputData.trim());
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
				return moi.ControlAlertTokenUnavailable();
			}

			moi.propertiesAPIToken(responseJSON.WKCAPIToken);

			completionHandler();
		}, moi.ControlAlertConnectionError);
	};

	//# LIFECYCLE

	//_ lifecyclePageWillLoad

	moi.lifecyclePageWillLoad = function () {
		moi.setupEverything();
	};

	Object.assign(exports, moi);

	Object.defineProperty(exports, '__esModule', { value: true });

})));
