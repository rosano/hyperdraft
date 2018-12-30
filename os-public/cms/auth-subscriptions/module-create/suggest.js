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

	const urlparsePackage = require('url-parse');

	//_ WKCSubscriptionsModuleCreateSuggestFor

	exports.WKCSubscriptionsModuleCreateSuggestFor = function (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('WKCErrorInvalidInput');
		}

		var suggestedURL = inputData.trim();

		if (!suggestedURL) {
			return [];
		}

		if (!suggestedURL.match(/\./)) {
			suggestedURL = suggestedURL.concat('.com');
		}

		if (!suggestedURL.match('://')) {
			suggestedURL = 'http://'.concat(suggestedURL);
		}

		var urlObject = new urlparsePackage(suggestedURL);

		if (!urlObject.hostname) {
			urlObject.set('hostname', suggestedURL.concat('.com'));
		}

		return ['https'].concat(urlObject.protocol === 'https:' ? [] : ['http']).map(function (e) {
			urlObject.set('protocol', e);

			return urlObject.toString();
		}).filter(function (e) {
			return e !== inputData;
		});
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
