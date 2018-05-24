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

	//_ WKCNotesAppPerformDataJoinFor

	exports.WKCNotesAppPerformDataJoinFor = function (items) {
		d3.select('#WKCAppNotesList')
			.selectAll('.WKCAppNotesListItem').data(items).enter()
			.append('div')
				.attr('class', 'WKCAppNotesListItem')
				.text(function(d) {
					return d.WKCNoteBody;
				});
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
