/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKSubscriptionsLogic = global.WKSubscriptionsLogic || {})));
}(this, (function (exports) { 'use strict';

	//_ WKCReadModuleSubscribeCompleteURL

	exports.WKCReadModuleSubscribeCompleteURL = function (param1, param2) {
		if (typeof param1 !== 'string') {
			throw new Error('WKCErrorInvalidInput');
		}

		if (!param1) {
			throw new Error('WKCErrorInvalidInput');
		}

		if (!/^(ftp|http|https):\/\/[^ "]+$/.test(param2)) {
			throw new Error('WKCErrorInvalidInput');
		}

		if (/^(ftp|http|https):\/\/[^ "]+$/.test(param1)) {
			return param1
		}

		var hostMatch = param2.match(/https?:\/\/(.[^/]+)/);

		if (param1[0] === '/') {
			return [
				hostMatch[0],
				param1,
			].join('');
		}

		var pathComponents = param2.slice(hostMatch[0].length).split('/').filter(function(e) {
			return !!e;
		}).map(function(e) {
			var optionMatch = e.match(/[\?\#]/);

			if (!optionMatch) {
				return e;
			}

			return e.split(optionMatch[0]).shift();
		});

		if (pathComponents.slice(0).pop().match(/\./)) {
			pathComponents.pop();
		}

		pathComponents.unshift(hostMatch[0]);
		
		pathComponents.push(param1);

		return pathComponents.join('/');
	};

	//_ WKSubscriptionsListSort

	exports.WKSubscriptionsListSort = function (a, b) {
		return b.WKCArticlePublishDate > a.WKCArticlePublishDate;
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
