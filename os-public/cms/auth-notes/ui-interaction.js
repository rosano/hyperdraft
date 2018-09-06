/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKCNotesAppInteraction = global.WKCNotesAppInteraction || {})));
}(this, (function (exports) { 'use strict';

	//_ WKCNotesAppCommandsSelectItem

	exports.WKCNotesAppCommandsSelectItem = function (item, sharedData) {
		sharedData.WKCAppNotesSharedSelectedItem = item;
		d3.select('#WKCNotesAppEditorTextarea').node().value = item.WKCNoteBody;
		d3.select('#WKCNotesAppEditorTextarea').node().focus();

		d3.selectAll('.WKCAppNotesListItem').classed('WKCAppNotesListItemSelected', function(d) {
			return d === item;
		});
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
