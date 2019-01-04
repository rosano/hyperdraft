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

	//_ WKCResponseParserArticlesForTwitterTimeline

	exports.WKCResponseParserArticlesForTwitterTimeline = function(oldBody, newBody) {
		if (typeof newBody !== 'string') {
			throw new Error('WKCErrorInvalidInput');
		}

		const oldJSON = JSON.parse(oldBody || '[]');

		const oldIDs = oldJSON.map(function (e) {
			return e.id_str;
		});

		const newJSON = JSON.parse(newBody);

		if (!newJSON) {
			return [];
		}

		return newJSON.filter(function(e) {
			return oldIDs.indexOf(e.id_str) === -1;
		}).map(function(e) {
			return {
				WKCArticleOriginalGUID: e.id_str,
				WKCArticleOriginalURL: `https://twitter.com/${e.user.screen_name}/status/${e.id_str}`,
				WKCArticlePublishDate: new Date(e.created_at),
				WKCArticleBody: e.text,
			};
		});
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
