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
		var selection = d3.select('#WKCAppNotesList')
			.selectAll('.WKCAppNotesListItem').data(items);
		
		selection.enter()
			.append('div')
				.attr('class', 'WKCAppNotesListItem')
				.merge(selection)
					.html(function(d) {
						return [
							'<pre>',
							(d.WKCNoteBody || '').split('\n').slice(0, 3).join('\n'),
							'</pre>',
						].join('');
					});
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
