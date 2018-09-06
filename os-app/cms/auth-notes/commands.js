/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKControl = global.WKControl || {})));
}(this, (function (exports) { 'use strict';

	//_ WKCommandsAlertTokenUnavailable

	exports.WKCommandsAlertTokenUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKCNotesErrors').WKCAppErrorTokenUnavailable %>');
		throw new Error('WKCAppErrorTokenUnavailable');
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
