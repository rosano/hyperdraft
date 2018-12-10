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

});
