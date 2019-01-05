/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCResponseParser = global.WKCResponseParser || {})));
}(this, (function (exports) { 'use strict';

	const stringContentForFirstElement = function (inputData) {
		return inputData[0] ? inputData[0].textContent : '';
	};

	//_ WKCResponseParserArticlesForFeedRSS

	exports.WKCResponseParserArticlesForFeedRSS = function(DOMParserInstance, oldString, newString) {
		if (typeof DOMParserInstance !== 'object' || DOMParserInstance === null) {
			throw new Error('WKCErrorInvalidInput');
		}

		if (typeof DOMParserInstance.parseFromString !== 'function') {
			throw new Error('WKCErrorInvalidInput');
		}

		const parsedXML = DOMParserInstance.parseFromString(oldString, 'application/xml');

		var oldIDs = (!oldString ? [] : [].slice.call(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('item'))).map(function (e) {
			return stringContentForFirstElement(e.getElementsByTagName('guid'));
		});

		const channelElement = DOMParserInstance.parseFromString(newString, 'application/xml').getElementsByTagName('channel')[0];

		if (!channelElement) {
			return [];
		}

		const newItems = [].slice.call(channelElement.getElementsByTagName('item'));

		return newItems.filter(function(e) {
			return oldIDs.indexOf(stringContentForFirstElement(e.getElementsByTagName('guid'))) === -1;
		}).map(function(e) {
			const itemContent = (stringContentForFirstElement(e.getElementsByTagName('content:encoded')) || stringContentForFirstElement(e.getElementsByTagName('description')) || '').trim();

			return {
				WKCArticleTitle: stringContentForFirstElement(e.getElementsByTagName('title')),
				WKCArticleOriginalURL: stringContentForFirstElement(e.getElementsByTagName('link')),
				WKCArticleOriginalGUID: stringContentForFirstElement(e.getElementsByTagName('guid')),
				WKCArticlePublishDate: new Date(stringContentForFirstElement(e.getElementsByTagName('pubDate'))),
				WKCArticleAuthor: stringContentForFirstElement(e.getElementsByTagName('author')),
				WKCArticleBody: itemContent,
				WKCArticleSnippet: exports.WKCResponseParserSnippetFromText(DOMParserInstance.parseFromString(`<div>${itemContent}</div>`, 'text/html').body.textContent),
			};
		});
	};

	//_ WKCResponseParserArticlesForFeedAtom

	exports.WKCResponseParserArticlesForFeedAtom = function(DOMParserInstance, oldString, newString) {
		if (typeof DOMParserInstance !== 'object' || DOMParserInstance === null) {
			throw new Error('WKCErrorInvalidInput');
		}

		if (typeof DOMParserInstance.parseFromString !== 'function') {
			throw new Error('WKCErrorInvalidInput');
		}

		var parsedXML = DOMParserInstance.parseFromString(oldString, 'application/xml');

		var oldIDs = (!oldString ? [] : [].slice.call(parsedXML.getElementsByTagName('entry'))).map(function (e) {
			return stringContentForFirstElement(e.getElementsByTagName('id'));
		});

		var newItems = [].slice.call(DOMParserInstance.parseFromString(newString, 'application/xml').getElementsByTagName('entry'));

		return newItems.filter(function(e) {
			return oldIDs.indexOf(stringContentForFirstElement(e.getElementsByTagName('id'))) === -1;
		}).map(function(e) {
			var itemContent = (e.getElementsByTagName('content')[0] || e.getElementsByTagName('summary')[0]).innerHTML;

			return {
				WKCArticleTitle: stringContentForFirstElement(e.getElementsByTagName('title')),
				WKCArticleOriginalURL: [].slice.call(e.getElementsByTagName('link')).sort(function (a, b) {
					return !!a.getAttribute('rel') - !!b.getAttribute('rel');
				}).map(function (e) {
					return e.getAttribute('href');
				}).shift(),
				WKCArticleOriginalGUID: stringContentForFirstElement(e.getElementsByTagName('id')),
				WKCArticlePublishDate: new Date(stringContentForFirstElement(e.getElementsByTagName('updated'))),
				WKCArticleAuthor: stringContentForFirstElement(e.getElementsByTagName('author')),
				WKCArticleBody: itemContent,
				WKCArticleSnippet: exports.WKCResponseParserSnippetFromText(DOMParserInstance.parseFromString(`<div>${itemContent}</div>`, 'text/html').body.textContent),
			};
		});
	};

	//_ WKCResponseParserInputDataIsCustomTwitterTimeline

	exports.WKCResponseParserInputDataIsCustomTwitterTimeline = function(inputData) {
		return Array.isArray(inputData);
	};

	//_ WKCResponseParserArticlesForCustomTwitterTimeline

	exports.WKCResponseParserArticlesForCustomTwitterTimeline = function(oldBody, newBody) {
		if (typeof newBody !== 'string') {
			throw new Error('WKCErrorInvalidInput');
		}

		const oldJSON = JSON.parse(oldBody || '[]');

		if (!Array.isArray(oldJSON)) {
			throw new Error('WKCErrorInvalidInput');
		}

		const newJSON = JSON.parse(newBody);

		if (!Array.isArray(newJSON)) {
			throw new Error('WKCErrorInvalidInput');
		}

		if (!newJSON) {
			return [];
		}

		return newJSON.filter(function(e) {
			return oldJSON.map(function (e) {
				return e.id_str;
			}).indexOf(e.id_str) === -1;
		}).map(function(e) {
			return {
				WKCArticleOriginalGUID: e.id_str,
				WKCArticleOriginalURL: `https://twitter.com/${e.user.screen_name}/status/${e.id_str}`,
				WKCArticlePublishDate: new Date(e.created_at),
				WKCArticleBody: e.full_text,
				WKCArticleSnippet: exports.WKCResponseParserSnippetFromText(e.full_text),
			};
		});
	};

	//_ WKCResponseParserSnippetFromText

	exports.WKCResponseParserSnippetFromText = function(inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('WKCErrorInvalidInput');
		}

		return inputData.length <= 100 ? inputData : inputData.slice(0, 100).split(' ').slice(0, -1).join(' ').concat('…');
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
