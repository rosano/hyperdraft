/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./main');

const kTests = {
	kTestsTextMultiline(count) {
		return 'alfa bravo charlie delta echo foxtrot golf hotel india juliet kilo'.split(' ').slice(0, typeof count === 'undefined' ? Infinity : count).join('\n').concat('\n');
	},
};

describe('KVCDiffHTMLForStrings', function testKVCDiffHTMLForStrings() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.KVCDiffHTMLForStrings('alfa', null);
		}, /KVCErrorInputNotValid/);
	});

	it('adds markup if param1 null', function() {
		assert.strictEqual(mainModule.KVCDiffHTMLForStrings(null, 'alfa'), '{KVCDiffInsert}alfa{/KVCDiffInsert}');
	});

	it('returns identical if no change', function() {
		assert.strictEqual(mainModule.KVCDiffHTMLForStrings('alfa', 'alfa'), 'alfa');
	});

	it('adds markup if character added', function() {
		assert.strictEqual(mainModule.KVCDiffHTMLForStrings('alfa', 'alfax'), 'alfa{KVCDiffInsert}x{/KVCDiffInsert}');
	});

	it('adds markup if character removed', function() {
		assert.strictEqual(mainModule.KVCDiffHTMLForStrings('alfa', 'alf'), 'alf{KVCDiffDelete}a{/KVCDiffDelete}');
	});

	it('adds markup if character changed', function() {
		assert.strictEqual(mainModule.KVCDiffHTMLForStrings('alfa', 'alfo'), 'alf{KVCDiffDelete}a{/KVCDiffDelete}{KVCDiffInsert}o{/KVCDiffInsert}');
	});

	context('truncation', function() {

		it('shows head if in range', function() {
			assert.strictEqual(mainModule.KVCDiffHTMLForStrings(kTests.kTestsTextMultiline(4), kTests.kTestsTextMultiline(4).replace('delta', 'deltax')), kTests.kTestsTextMultiline(4).replace('delta', 'delta{KVCDiffInsert}x{/KVCDiffInsert}'));
		});

		it('shows truncated head if not in range', function() {
			assert.strictEqual(mainModule.KVCDiffHTMLForStrings(kTests.kTestsTextMultiline(5), kTests.kTestsTextMultiline(5).replace('echo', 'echox')), kTests.kTestsTextMultiline(5).replace('alfa', '…').replace('echo', 'echo{KVCDiffInsert}x{/KVCDiffInsert}'));
		});

		it('shows tail if in range', function() {
			assert.strictEqual(mainModule.KVCDiffHTMLForStrings(kTests.kTestsTextMultiline(4), kTests.kTestsTextMultiline(4).replace('alfa', 'alfax')), kTests.kTestsTextMultiline(4).replace('alfa', 'alfa{KVCDiffInsert}x{/KVCDiffInsert}'));
		});

		it('shows truncated tail if not in range', function() {
			assert.strictEqual(mainModule.KVCDiffHTMLForStrings(kTests.kTestsTextMultiline(5), kTests.kTestsTextMultiline(5).replace('alfa', 'alfax')), kTests.kTestsTextMultiline(5).replace('echo', '…').replace('alfa', 'alfa{KVCDiffInsert}x{/KVCDiffInsert}'));
		});

		it('shows body if in range', function() {
			assert.strictEqual(mainModule.KVCDiffHTMLForStrings(kTests.kTestsTextMultiline(8), kTests.kTestsTextMultiline(8).replace('alfa', 'alfax').replace('hotel', 'hotelx')), kTests.kTestsTextMultiline(8).replace('alfa', 'alfa{KVCDiffInsert}x{/KVCDiffInsert}').replace('hotel', 'hotel{KVCDiffInsert}x{/KVCDiffInsert}'));
		});

		it('shows truncated body if not in range', function() {
			assert.strictEqual(mainModule.KVCDiffHTMLForStrings(kTests.kTestsTextMultiline(9), kTests.kTestsTextMultiline(9).replace('alfa', 'alfax').replace('india', 'indiax')), kTests.kTestsTextMultiline(9).replace('echo', '…').replace('alfa', 'alfa{KVCDiffInsert}x{/KVCDiffInsert}').replace('india', 'india{KVCDiffInsert}x{/KVCDiffInsert}'));
		});

	});

});
