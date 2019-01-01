/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKLogic = global.WKLogic || {})));
}(this, (function (exports) { 'use strict';

	//_ WKLogicListSort

	exports.WKLogicListSort = function (a, b) {
		if (b.WKCNoteDateUpdated && a.WKCNoteDateUpdated) {
			return b.WKCNoteDateUpdated > a.WKCNoteDateUpdated;
		}

		return b.WKCNoteDateCreated > a.WKCNoteDateCreated;
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
