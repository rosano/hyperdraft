/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./main');

const kTests = {
	kTestsTextMultiline: function(count) {
		return 'alfa bravo charlie delta echo foxtrot golf hotel indigo juliet kilo'.split(' ').slice(0, typeof count === 'undefined' ? Infinity : count).join('\n').concat('\n');
	},
};

describe('WKCDiffHTMLForStrings', function testWKCDiffHTMLForStrings() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.WKCDiffHTMLForStrings('alfa', null);
		}, /WKCErrorInvalidInput/);
	});

	it('adds markup if param1 null', function() {
		assert.strictEqual(mainModule.WKCDiffHTMLForStrings(null, 'alfa'), '{WKCDiffInsert}alfa{/WKCDiffInsert}');
	});

	it('returns identical if no change', function() {
		assert.strictEqual(mainModule.WKCDiffHTMLForStrings('alfa', 'alfa'), 'alfa');
	});

	it('adds markup if character added', function() {
		assert.strictEqual(mainModule.WKCDiffHTMLForStrings('alfa', 'alfax'), 'alfa{WKCDiffInsert}x{/WKCDiffInsert}');
	});

	it('adds markup if character removed', function() {
		assert.strictEqual(mainModule.WKCDiffHTMLForStrings('alfa', 'alf'), 'alf{WKCDiffDelete}a{/WKCDiffDelete}');
	});

	it('adds markup if character changed', function() {
		assert.strictEqual(mainModule.WKCDiffHTMLForStrings('alfa', 'alfo'), 'alf{WKCDiffDelete}a{/WKCDiffDelete}{WKCDiffInsert}o{/WKCDiffInsert}');
	});

	context('truncation', function() {

		it('shows head if in range', function() {
			assert.strictEqual(mainModule.WKCDiffHTMLForStrings(kTests.kTestsTextMultiline(4), kTests.kTestsTextMultiline(4).replace('delta', 'deltax')), kTests.kTestsTextMultiline(4).replace('delta', 'delta{WKCDiffInsert}x{/WKCDiffInsert}'));
		});

		it('shows truncated head if not in range', function() {
			assert.strictEqual(mainModule.WKCDiffHTMLForStrings(kTests.kTestsTextMultiline(5), kTests.kTestsTextMultiline(5).replace('echo', 'echox')), kTests.kTestsTextMultiline(5).replace('alfa', '…').replace('echo', 'echo{WKCDiffInsert}x{/WKCDiffInsert}'));
		});

		it('shows tail if in range', function() {
			assert.strictEqual(mainModule.WKCDiffHTMLForStrings(kTests.kTestsTextMultiline(4), kTests.kTestsTextMultiline(4).replace('alfa', 'alfax')), kTests.kTestsTextMultiline(4).replace('alfa', 'alfa{WKCDiffInsert}x{/WKCDiffInsert}'));
		});

		it('shows truncated tail if not in range', function() {
			assert.strictEqual(mainModule.WKCDiffHTMLForStrings(kTests.kTestsTextMultiline(5), kTests.kTestsTextMultiline(5).replace('alfa', 'alfax')), kTests.kTestsTextMultiline(5).replace('echo', '…').replace('alfa', 'alfa{WKCDiffInsert}x{/WKCDiffInsert}'));
		});

		it('shows body if in range', function() {
			assert.strictEqual(mainModule.WKCDiffHTMLForStrings(kTests.kTestsTextMultiline(8), kTests.kTestsTextMultiline(8).replace('alfa', 'alfax').replace('hotel', 'hotelx')), kTests.kTestsTextMultiline(8).replace('alfa', 'alfa{WKCDiffInsert}x{/WKCDiffInsert}').replace('hotel', 'hotel{WKCDiffInsert}x{/WKCDiffInsert}'));
		});

		it('shows truncated body if not in range', function() {
			assert.strictEqual(mainModule.WKCDiffHTMLForStrings(kTests.kTestsTextMultiline(9), kTests.kTestsTextMultiline(9).replace('alfa', 'alfax').replace('indigo', 'indigox')), kTests.kTestsTextMultiline(9).replace('echo', '…').replace('alfa', 'alfa{WKCDiffInsert}x{/WKCDiffInsert}').replace('indigo', 'indigo{WKCDiffInsert}x{/WKCDiffInsert}'));
		});

	});

});
