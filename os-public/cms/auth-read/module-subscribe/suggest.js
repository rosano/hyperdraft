/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCReadModuleSubscribeSuggestions = global.WKCReadModuleSubscribeSuggestions || {})));
}(this, (function (exports) { 'use strict';

	const urlparsePackage = typeof require === 'undefined' ? window.URLParse : require('url-parse');

	//_ WKCReadModuleSubscribeSuggestionsTypeStandard

	exports.WKCReadModuleSubscribeSuggestionsTypeStandard = function () {
		return 'SuggestionsTypeStandard';
	};

	//_ WKCReadModuleSubscribeSuggestionsTypeSecure

	exports.WKCReadModuleSubscribeSuggestionsTypeSecure = function () {
		return 'SuggestionsTypeSecure';
	};

	//_ WKCReadModuleSubscribeSuggestionsTypeCustomTwitterTimeline

	exports.WKCReadModuleSubscribeSuggestionsTypeCustomTwitterTimeline = function () {
		return 'SuggestionsTypeCustomTwitterTimeline';
	};

	//_ WKCReadModuleSubscribeSuggestionsFor

	exports.WKCReadModuleSubscribeSuggestionsFor = function (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('WKCErrorInvalidInput');
		}

		if (!inputData.trim()) {
			return [];
		}

		var suggestionObjects = [];

		suggestionObjects.push(...exports._WKCReadModuleSubscribeSuggestionsForCustomTwitterTimeline(inputData));

		if (suggestionObjects.length) {
			return suggestionObjects;
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
			return suggestionObjects;
		}

		if (urlObject.protocol === 'https:') {
			return suggestionObjects;
		}

		if (!urlObject.protocol) {
			urlObject.set('protocol', 'http:');

			suggestionObjects.push({
				WKCSuggestionURL: urlObject.toString(),
				WKCSuggestionType: exports.WKCReadModuleSubscribeSuggestionsTypeStandard(),
			});
		}

		if (urlObject.protocol === 'http:') {
			urlObject.set('protocol', 'https:');

			suggestionObjects.push({
				WKCSuggestionURL: urlObject.toString(),
				WKCSuggestionType: exports.WKCReadModuleSubscribeSuggestionsTypeSecure(),
			});
		}

		return suggestionObjects.sort(function (a, b) {
			const typesOrder = [
				exports.WKCReadModuleSubscribeSuggestionsTypeStandard(),
				exports.WKCReadModuleSubscribeSuggestionsTypeSecure(),
			];
			return typesOrder.indexOf(a.WKCSuggestionType) > typesOrder.indexOf(b.WKCSuggestionType);
		}).reverse();
	};

	//_ _WKCReadModuleSubscribeSuggestionsForCustomTwitterTimeline

	exports._WKCReadModuleSubscribeSuggestionsForCustomTwitterTimeline = function (inputData) {
		const urlHandle = inputData.match(/https?:\/\/(www\.)?twitter\.com\/(?!(search\b))(\#\!\/)?(intent\/user\?screen_name=)?@?(\w+)/i);

		if (urlHandle && urlHandle.slice(-1).pop()) {
			return [
				{
					WKCSuggestionType: exports.WKCReadModuleSubscribeSuggestionsTypeCustomTwitterTimeline(),
					WKCSuggestionURL: 'https://api.twitter.com/1.1/statuses/user_timeline.json?tweet_mode=extended&screen_name='.concat(urlHandle.slice(-1).pop()),
				},
			];
		}

		const userHandle = inputData.match(/@(\w+)$/i);
		if (userHandle && userHandle.slice(-1).pop()) {
			return [
				{
					WKCSuggestionType: exports.WKCReadModuleSubscribeSuggestionsTypeCustomTwitterTimeline(),
					WKCSuggestionURL: 'https://api.twitter.com/1.1/statuses/user_timeline.json?tweet_mode=extended&screen_name='.concat(userHandle.slice(-1).pop()),
				},
			];
		}

		return [];
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
