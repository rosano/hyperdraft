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

	//_ WKCSubscriptionsModuleCreateSuggestFor

	exports.WKCSubscriptionsModuleCreateSuggestFor = function (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('WKCErrorInvalidInput');
		}

		var suggestedURL = inputData.trim();

		if (!suggestedURL) {
			return [];
		}

		var urlObject = new urlparsePackage(suggestedURL);

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

		return (urlObject.hostname === 'localhost' ? [] : ['https']).concat(urlObject.protocol === 'https:' ? [] : ['http']).map(function (e) {
			urlObject.set('protocol', e);

			return urlObject.toString();
		}).filter(function (e) {
			return e !== inputData;
		});
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
