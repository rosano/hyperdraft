/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCSubscriptionsModuleCreateSuggest = global.WKCSubscriptionsModuleCreateSuggest || {})));
}(this, (function (exports) { 'use strict';

	const urlparsePackage = typeof require === 'undefined' ? window.URLParse : require('url-parse');

	//_ WKCSubscriptionsModuleCreateSuggestionsTypeComplete

	exports.WKCSubscriptionsModuleCreateSuggestionsTypeComplete = function () {
		return 'kWKCSubscriptionsModuleCreateSuggestionsTypeComplete';
	};

	//_ WKCSubscriptionsModuleCreateSuggestionsTypeSecure

	exports.WKCSubscriptionsModuleCreateSuggestionsTypeSecure = function () {
		return 'kWKCSubscriptionsModuleCreateSuggestionsTypeSecure';
	};

	//_ WKCSubscriptionsModuleCreateSuggestFor

	exports.WKCSubscriptionsModuleCreateSuggestFor = function (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('WKCErrorInvalidInput');
		}

		if (!inputData.trim()) {
			return [];
		}

		var urlObject = urlparsePackage(inputData, {}); // To parse an input independently of the browser's current URL (e.g. for functionality parity with the library in a Node environment), pass an empty location object as the second parameter

		if (!urlObject.hostname && !urlObject.pathname.match(/\W/)) {
			urlObject.set('hostname', urlObject.pathname);
			urlObject.set('pathname', '');
		}

		if (!urlObject.hostname && !urlObject.pathname.match(/[^\w\.]/)) {
			urlObject.set('hostname', urlObject.pathname);
			urlObject.set('pathname', '');
		}

		var pathComponents = urlObject.pathname.split('/');
		if (!urlObject.hostname && !pathComponents[0].match(/[^\w\.]/)) {
			urlObject.set('hostname', pathComponents.shift());
			urlObject.set('pathname', pathComponents.join('/'));
		}

		if (!urlObject.hostname.match(/\./)) {
			return [];
		}

		if (urlObject.protocol === 'https:') {
			return [];
		}

		var suggestionObjects = [];

		if (!urlObject.protocol) {
			urlObject.set('protocol', 'http:');

			suggestionObjects.push({
				WKCSuggestionURL: urlObject.toString(),
				WKCSuggestionType: exports.WKCSubscriptionsModuleCreateSuggestionsTypeComplete(),
			});
		}

		if (urlObject.protocol === 'http:') {
			urlObject.set('protocol', 'https:');

			suggestionObjects.push({
				WKCSuggestionURL: urlObject.toString(),
				WKCSuggestionType: exports.WKCSubscriptionsModuleCreateSuggestionsTypeSecure(),
			});
		}

		return suggestionObjects.sort(function (a, b) {
			const typesOrder = [
				exports.WKCSubscriptionsModuleCreateSuggestionsTypeComplete(),
				exports.WKCSubscriptionsModuleCreateSuggestionsTypeSecure(),
			];
			return typesOrder.indexOf(a.WKCSuggestionType) > typesOrder.indexOf(b.WKCSuggestionType);
		}).reverse();
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
