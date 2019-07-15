/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCWriteLogic = global.WKCWriteLogic || {})));
}(this, (function (exports) { 'use strict';

	//_ WKCWriteLogicListSort

	exports.WKCWriteLogicListSort = function (a, b) {
		if (b.WKCNoteModificationDate && a.WKCNoteModificationDate) {
			return b.WKCNoteModificationDate - a.WKCNoteModificationDate;
		}

		return b.WKCNoteCreationDate - a.WKCNoteCreationDate;
	};

	//_ WKCWriteLineObjectsFor

	exports.WKCWriteLineObjectsFor = function (inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('WKCErrorInputInvalid');
		}

		return Object.values(inputData.reduce(function (coll, e) {
			let key = (Object.keys(coll).pop() || -1);

			if (!coll[key] || (coll[key].type !== e.type)) {
				key += 1;
				coll[key] = {
					start: e.start,
					type: e.type,
				};
			}

			coll[key].end = e.end;
			coll[key].string = (coll[key].string || '').concat(e.string);

			return coll;
		}, {}));
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
