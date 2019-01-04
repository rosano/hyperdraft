/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

var mainModule = require('./main');

const k = {
	kStubResponseCustomTwitterTimelineValid: function() {
		return "[{\"created_at\":\"Wed Oct 31 15:59:13 +0000 2018\",\"id_str\":\"alfa\",\"text\":\"bravo\",\"entities\":{\"hashtags\":[],\"symbols\":[],\"user_mentions\":[],\"urls\":[]},\"user\":{\"screen_name\":\"charlie\"}},{\"created_at\":\"Mon Oct 08 13:40:12 +0000 2018\",\"id_str\":\"delta\",\"text\":\"echo\",\"entities\":{\"hashtags\":[],\"symbols\":[],\"user_mentions\":[],\"urls\":[]},\"user\":{\"screen_name\":\"foxtrot\"}}]";
	},
};

describe('WKCResponseParserInputDataIsCustomTwitterTimeline', function testWKCResponseParserInputDataIsCustomTwitterTimeline() {

	it('returns false if not array', function() {
		assert.strictEqual(mainModule.WKCResponseParserInputDataIsCustomTwitterTimeline(null), false);
	});

	it('returns true', function() {
		assert.strictEqual(mainModule.WKCResponseParserInputDataIsCustomTwitterTimeline([]), true);
	});

});

describe('WKCResponseParserArticlesForCustomTwitterTimeline', function testWKCResponseParserArticlesForCustomTwitterTimeline() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.WKCResponseParserArticlesForCustomTwitterTimeline('[]', null);
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param1 not format', function() {
		assert.throws(function() {
			mainModule.WKCResponseParserArticlesForCustomTwitterTimeline('{}', '[]');
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param2 not format', function() {
		assert.throws(function() {
			mainModule.WKCResponseParserArticlesForCustomTwitterTimeline('[]', '{}');
		}, /WKCErrorInvalidInput/);
	});

	it('returns none if identical', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(k.kStubResponseCustomTwitterTimelineValid(), k.kStubResponseCustomTwitterTimelineValid()), []);
	});

	it('returns none if new empty', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(k.kStubResponseCustomTwitterTimelineValid(), '[]'), []);
	});

	it('returns all if old empty', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, k.kStubResponseCustomTwitterTimelineValid()).map(function(e) {
			return e.WKCArticleOriginalGUID;
		}), [
			'alfa',
			'delta',
		]);
	});

	it('returns articles with new guid', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(k.kStubResponseCustomTwitterTimelineValid(), k.kStubResponseCustomTwitterTimelineValid().replace(/alfa/g, 'charlie')).map(function(e) {
			return e.WKCArticleOriginalGUID;
		}), [
			'charlie',
		]);
	});

	it('populates WKCArticleTitle undefined', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, k.kStubResponseCustomTwitterTimelineValid()).pop().WKCArticleTitle, undefined);
	});

	it('populates WKCArticleOriginalURL', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, k.kStubResponseCustomTwitterTimelineValid()).pop().WKCArticleOriginalURL, 'https://twitter.com/foxtrot/status/delta');
	});

	it('populates WKCArticleOriginalGUID', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, k.kStubResponseCustomTwitterTimelineValid()).pop().WKCArticleOriginalGUID, 'delta');
	});

	it('populates WKCArticlePublishDate', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, k.kStubResponseCustomTwitterTimelineValid()).pop().WKCArticlePublishDate, new Date('2018-10-08T13:40:12.000Z'));
	});

	it('populates WKCArticleAuthor undefined', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, k.kStubResponseCustomTwitterTimelineValid()).pop().WKCArticleAuthor, undefined);
	});

	it('populates WKCArticleBody', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, k.kStubResponseCustomTwitterTimelineValid()).pop().WKCArticleBody, 'echo');
	});

	it('populates WKCArticleSnippet undefined', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, k.kStubResponseCustomTwitterTimelineValid()).pop().WKCArticleSnippet, undefined);
	});

});
