/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var diffLibrary = require('./diff');

const kTests = {
	kTestsRSSInvalid: function() {
		return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channell></channel></rss>';
	},
	kTestsRSSValid: function() {
		return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><item><title>bravo</title><guid>bravo</guid><description></description></item><item><title>alfa</title><guid>alfa</guid><description></description></item></channel></rss>';
	},
	kTestsRSSComplete: function() {
		return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><item><title>alfa</title><link>https://www.cbc.ca/bravo</link><guid isPermaLink="false">charlie</guid><pubDate>Fri, 7 Dec 2018 10:03:15 EST</pubDate><author>delta</author><description><![CDATA[\
                        <p>echo</p>\
        ]]>\
        </description><content:encoded><![CDATA[\
                        <p>foxtrot</p>\
        ]]>\
        </content:encoded></item></channel></rss>';
	},
	kTestsHTML: function() {
		return '<!DOCTYPE html><html><head><title>bravo</title></head><body><h1>alfa</h1></body></html>';
	},
	kTestsBody: function() {
		return "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
	},
};

describe('WKCDiffArticlesForFeed', function testWKCDiffArticlesForFeed() {

	it('returns none if new invalid', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFeed(kTests.kTestsRSSValid(), kTests.kTestsRSSInvalid()), []);
	});

	it('returns all if old empty', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSValid()).map(function(e) {
			return e.WKCArticleTitle;
		}), [
			'bravo',
			'alfa',
		]);
	});

	it('returns articles with new guid', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFeed(kTests.kTestsRSSValid(), kTests.kTestsRSSValid().replace(/alfa/g, 'charlie')).map(function(e) {
			return e.WKCArticleTitle;
		}), [
			'charlie',
		]);
	});

	it('populates WKCArticleTitle', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete()).pop().WKCArticleTitle, 'alfa');
	});

	it('populates WKCArticleOriginalURL', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete()).pop().WKCArticleOriginalURL, 'https://www.cbc.ca/bravo');
	});

	it('populates WKCArticleOriginalGUID', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete()).pop().WKCArticleOriginalGUID, 'charlie');
	});

	it('populates WKCArticleOriginalGUID as string', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete().replace('charlie', '12345')).pop().WKCArticleOriginalGUID, '12345');
	});

	it('populates WKCArticlePublishDate', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete()).pop().WKCArticlePublishDate, new Date('2018-12-07T15:03:15.000Z'));
	});

	it('populates WKCArticleAuthor', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete()).pop().WKCArticleAuthor, 'delta');
	});

	it('populates WKCArticleBody', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete()).pop().WKCArticleBody, '<p>foxtrot</p>');
	});

	it('populates WKCArticleBody with description if no content:encoded', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete().replace(/<content:encoded>.*<\/content:encoded>/, '')).pop().WKCArticleBody, '<p>echo</p>');
	});

	it('populates WKCArticleSnippet', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFeed(null, kTests.kTestsRSSComplete()).pop().WKCArticleSnippet, 'foxtrot');
	});

});

describe('_WKCDiffArticleBodyForFile', function test_WKCDiffArticleBodyForFile() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			diffLibrary._WKCDiffArticleBodyForFile('alfa', null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns all if param1 null', function() {
		assert.deepEqual(diffLibrary._WKCDiffArticleBodyForFile(null, 'alfa'), '<ins>alfa</ins>');
	});

	it('returns identical if no change', function() {
		assert.deepEqual(diffLibrary._WKCDiffArticleBodyForFile('alfa', 'alfa'), 'alfa');
	});

	it('adds markup if character added', function() {
		assert.deepEqual(diffLibrary._WKCDiffArticleBodyForFile('alfa', 'alfab'), 'alfa<ins>b</ins>');
	});

	it('adds markup if character removed', function() {
		assert.deepEqual(diffLibrary._WKCDiffArticleBodyForFile('alfa', 'alf'), 'alf<del>a</del>');
	});

	it('adds markup if character changed', function() {
		assert.deepEqual(diffLibrary._WKCDiffArticleBodyForFile('alfa', 'alfo'), 'alf<del>a</del><ins>o</ins>');
	});

	it('escapes html tags', function() {
		assert.deepEqual(diffLibrary._WKCDiffArticleBodyForFile('<b>alfa</b>', '<b>alfax</b>'), '&lt;b&gt;alfa<ins>x</ins>&lt;/b&gt;');
	});

});

describe('WKCDiffArticlesForFile', function testWKCDiffArticlesForFile() {

	it('returns none if identical', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFile('alfa', 'alfa'), []);
	});

	it('returns one if not identical', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForFile('alfa', 'alfo').map(function(e) {
			return e.WKCArticleBody;
		}), [
			'alf<del>a</del><ins>o</ins>'
		]);
	});

	it('populates article date', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFile('alfa', 'alfo').pop().WKCArticlePublishDate - (new Date()) < 100, true);
	});

	it('populates article body', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForFile('alfa', 'alfo').pop().WKCArticleBody, 'alf<del>a</del><ins>o</ins>');
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

	it('ignores head changes', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML().replace('bravo', 'charlie')), []);
	});

	it('returns one if not identical', function() {
		assert.deepEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML().replace('alfa', 'alfo')).map(function(e) {
			return e.WKCArticleBody;
		}), [
			'<h1>alf<del>a</del><ins>o</ins></h1>'
		]);
	});

	it('populates article date', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML().replace('alfa', 'alfo')).pop().WKCArticlePublishDate - (new Date()) < 100, true);
	});

	it('populates article body', function() {
		assert.strictEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML().replace('alfa', 'alfo')).pop().WKCArticleBody, '<h1>alf<del>a</del><ins>o</ins></h1>');
	});

	context('WKCArticleBody', function() {

		it('adds markup if param1 null', function() {
			assert.strictEqual(diffLibrary.WKCDiffArticlesForPage(null, kTests.kTestsHTML()).pop().WKCArticleBody, '<ins><h1>alfa</h1></ins>');
		});

		it('adds markup if character added', function() {
			assert.strictEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML().replace('alfa', 'alfab')).pop().WKCArticleBody, '<h1>alfa<ins>b</ins></h1>');
		});

		it('adds markup if character removed', function() {
			assert.strictEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML().replace('alfa', 'alf')).pop().WKCArticleBody, '<h1>alf<del>a</del></h1>');
		});

		it('adds markup if character changed', function() {
			assert.strictEqual(diffLibrary.WKCDiffArticlesForPage(kTests.kTestsHTML(), kTests.kTestsHTML().replace('alfa', 'alfo')).pop().WKCArticleBody, '<h1>alf<del>a</del><ins>o</ins></h1>');
		});

	});

});

describe('WKCSnippetFromText', function testWKCSnippetFromText() {

	it('throws error if not string', function() {
		assert.throws(function() {
			diffLibrary.WKCSnippetFromText(null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns subset if large', function() {
		assert.strictEqual(diffLibrary.WKCSnippetFromText(kTests.kTestsBody()), kTests.kTestsBody().slice(0, 100).split(' ').slice(0, -1).join(' ') + '…');
	});

	it('returns all if small', function() {
		assert.strictEqual(diffLibrary.WKCSnippetFromText('alfa bravo'), 'alfa bravo');
	});

});
