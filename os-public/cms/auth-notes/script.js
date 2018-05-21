/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCNotes = global.WKCNotes || {})));
}(this, (function (exports) { 'use strict';

	//_ WKCNotesAdd

	exports.WKCNotesAdd = function () {
		console.log('hello', new Date());
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
