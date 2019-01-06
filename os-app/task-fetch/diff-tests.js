/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var diffLibrary = require('./diff');

const kTests = {
	kTestsHTML: function(inputData) {
		return [
			'<!DOCTYPE html><html><head><title>bravo</title></head><body>',
			inputData || '<h1>alfa</h1><script>var charlie = "delta";</script><style type="text/css">.echo {foxtrot: "golf";}</style>',
			'</body></html>',
		].join('');
	},
	kTestsBody: function() {
		return 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';
	},
	kTestsTextMultiline: function(count) {
		return 'alfa bravo charlie delta echo foxtrot golf hotel indigo juliet kilo'.split(' ').slice(0, typeof count === 'undefined' ? Infinity : count).join('\n').concat('\n');
	},
};

describe('_WKCDiffArticleBodyForStrings', function test_WKCDiffArticleBodyForStrings() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			diffLibrary._WKCDiffArticleBodyForStrings('alfa', null);
		}, /WKCErrorInvalidInput/);
	});

	it('adds markup if param1 null', function() {
		assert.strictEqual(diffLibrary._WKCDiffArticleBodyForStrings(null, 'alfa'), '<WKCDiffInsert>alfa</WKCDiffInsert>');
	});

	it('returns identical if no change', function() {
		assert.strictEqual(diffLibrary._WKCDiffArticleBodyForStrings('alfa', 'alfa'), 'alfa');
	});

	it('adds markup if character added', function() {
		assert.strictEqual(diffLibrary._WKCDiffArticleBodyForStrings('alfa', 'alfax'), 'alfa<WKCDiffInsert>x</WKCDiffInsert>');
	});

	it('adds markup if character removed', function() {
		assert.strictEqual(diffLibrary._WKCDiffArticleBodyForStrings('alfa', 'alf'), 'alf<WKCDiffDelete>a</WKCDiffDelete>');
	});

	it('adds markup if character changed', function() {
		assert.strictEqual(diffLibrary._WKCDiffArticleBodyForStrings('alfa', 'alfo'), 'alf<WKCDiffDelete>a</WKCDiffDelete><WKCDiffInsert>o</WKCDiffInsert>');
	});

	context('truncation', function() {

		it('shows head if in range', function() {
			assert.strictEqual(diffLibrary._WKCDiffArticleBodyForStrings(kTests.kTestsTextMultiline(4), kTests.kTestsTextMultiline(4).replace('delta', 'deltax')), kTests.kTestsTextMultiline(4).replace('delta', 'delta<WKCDiffInsert>x</WKCDiffInsert>'));
		});

		it('shows truncated head if not in range', function() {
			assert.strictEqual(diffLibrary._WKCDiffArticleBodyForStrings(kTests.kTestsTextMultiline(5), kTests.kTestsTextMultiline(5).replace('echo', 'echox')), kTests.kTestsTextMultiline(5).replace('alfa', '…').replace('echo', 'echo<WKCDiffInsert>x</WKCDiffInsert>'));
		});

		it('shows tail if in range', function() {
			assert.strictEqual(diffLibrary._WKCDiffArticleBodyForStrings(kTests.kTestsTextMultiline(4), kTests.kTestsTextMultiline(4).replace('alfa', 'alfax')), kTests.kTestsTextMultiline(4).replace('alfa', 'alfa<WKCDiffInsert>x</WKCDiffInsert>'));
		});

		it('shows truncated tail if not in range', function() {
			assert.strictEqual(diffLibrary._WKCDiffArticleBodyForStrings(kTests.kTestsTextMultiline(5), kTests.kTestsTextMultiline(5).replace('alfa', 'alfax')), kTests.kTestsTextMultiline(5).replace('echo', '…').replace('alfa', 'alfa<WKCDiffInsert>x</WKCDiffInsert>'));
		});

		it('shows body if in range', function() {
			assert.strictEqual(diffLibrary._WKCDiffArticleBodyForStrings(kTests.kTestsTextMultiline(8), kTests.kTestsTextMultiline(8).replace('alfa', 'alfax').replace('hotel', 'hotelx')), kTests.kTestsTextMultiline(8).replace('alfa', 'alfa<WKCDiffInsert>x</WKCDiffInsert>').replace('hotel', 'hotel<WKCDiffInsert>x</WKCDiffInsert>'));
		});

		it('shows truncated body if not in range', function() {
			assert.strictEqual(diffLibrary._WKCDiffArticleBodyForStrings(kTests.kTestsTextMultiline(9), kTests.kTestsTextMultiline(9).replace('alfa', 'alfax').replace('indigo', 'indigox')), kTests.kTestsTextMultiline(9).replace('echo', '…').replace('alfa', 'alfa<WKCDiffInsert>x</WKCDiffInsert>').replace('indigo', 'indigo<WKCDiffInsert>x</WKCDiffInsert>'));
		});

	});

});

describe('WKCDiffArticlesForFile', function testWKCDiffArticlesForFile() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			diffLibrary.WKCDiffArticlesForFile('alfa', null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns none if identical', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFile('alfa', 'alfa'), []);
	});

	it('returns one if not identical', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFile('alfa', 'alfax').length, 1);
	});

	it('populates article date', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFile('alfa', 'alfax').pop().WKCArticlePublishDate - (new Date()) < 100, true);
	});

	it('populates article body', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFile('alfa', 'alfax').pop().WKCArticleBody, 'alfa<ins>x</ins>');
	});

	it('escapes html tags', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFile('<b>alfa</b>', '<b>alfax</b>').pop().WKCArticleBody, '&lt;b&gt;alfa<ins>x</ins>&lt;/b&gt;');
	});

	it('adds markup for line breaks', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFile(kTests.kTestsTextMultiline(3), kTests.kTestsTextMultiline(3).replace('alfa', 'alfax')).pop().WKCArticleBody, kTests.kTestsTextMultiline(3).replace('alfa', 'alfa<ins>x</ins>').replace(/\n/g, '<br>'));
	});

});

describe('WKCDiffArticlesForPage', function testWKCDiffArticlesForPage() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			diffLibrary.WKCDiffArticlesForPage('alfa', null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns none if identical', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML()), []);
	});

	it('returns none if head changes', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML().replace('bravo', 'bravox')), []);
	});

	it('ignores script', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML().replace('delta', 'deltax')), []);
	});

	it('ignores style', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML().replace('golf', 'golfx')), []);
	});

	it('returns one if not identical', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML().replace('alfa', 'alfax')).length, 1);
	});

	it('populates article date', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML().replace('alfa', 'alfax')).pop().WKCArticlePublishDate - (new Date()) < 100, true);
	});

	it('populates article body', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML().replace('alfa', 'alfax')).pop().WKCArticleBody, '<h1>alfa<ins>x</ins></h1>');
	});

	it('populates blank links with title value', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForPage(null, kTests.kTestsHTML('<a href="hotel" title="alfa"></a>')).pop().WKCArticleBody, '<p><ins><a href="hotel">alfa</a></ins></p>');
	});

	it('populates blank links with placeholder', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForPage(null, kTests.kTestsHTML('<a href="hotel"></a>')).pop().WKCArticleBody, '<p><ins><a href="hotel">[_____]</a></ins></p>');
	});

	it('strips whitespace from link content', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForPage(null, kTests.kTestsHTML('<a href="hotel"><div><p><strong>indigo</strong><br></p></div></a>')).pop().WKCArticleBody, '<p><ins><a href="hotel"><strong>indigo</strong></a></ins></p>');
	});

	it('handles multiple link tasks simultaneously', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForPage(null, kTests.kTestsHTML('<a href="hotel"><div><p>indigo<br></p></div></a><a href="hotel"></a><a href="hotel"><div><p>indigo<br></p></div></a><a href="hotel"></a>')).pop().WKCArticleBody, '<p><ins><a href="hotel">indigo</a><a href="hotel">[_____]</a><a href="hotel">indigo</a><a href="hotel">[_____]</a></ins></p>');
	});

	it.skip('wraps children with ins', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForPage(null, kTests.kTestsHTML('<h1>alfa</h1><p>bravo</p><a href="delta">charlie</a>')).pop().WKCArticleBody, '<h1><ins>alfa</ins></h1><p><ins>bravo</ins></p><a href="delta"><ins>charlie</ins></a>');
	});

});
