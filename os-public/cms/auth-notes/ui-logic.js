/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCNotesApp = global.WKCNotesApp || {})));
}(this, (function (exports) { 'use strict';

	//_ WKCNotesAppTest

	exports.WKCNotesAppTest = function () {
		return 'hello';
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
