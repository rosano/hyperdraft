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
