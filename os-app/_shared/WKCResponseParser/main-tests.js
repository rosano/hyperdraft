/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const jsdomPackage = require('jsdom');

const mainModule = require('./main.js');
const stubsModule = require('./main-tests-stubs.js');

const kStubs = {
	kStubsDOMParserInstance: function() {
		return new (new jsdomPackage.JSDOM('')).window.DOMParser();
	},
	kStubsRSSValid: function() {
		return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><item><title>bravo</title><guid>bravo</guid><description>bravo</description></item><item><title>alfa</title><guid>alfa</guid><description>alfa</description></item></channel></rss>';
	},
	kStubsRSSComplete: function() {
		return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><item><title>alfa</title><link>https://www.cbc.ca/bravo</link><guid isPermaLink="false">charlie</guid><pubDate>Fri, 7 Dec 2018 10:03:15 EST</pubDate><author>delta</author><description><![CDATA[\
                        <p>echo</p>\
        ]]>\
        </description><content:encoded><![CDATA[\
                        <p>foxtrot</p>\
        ]]>\
        </content:encoded></item></channel></rss>';
	},
	kStubsResponseCustomTwitterTimelineValid: function() {
		return "[{\"created_at\":\"Wed Oct 31 15:59:13 +0000 2018\",\"id_str\":\"alfa\",\"text\":\"bravo\",\"entities\":{\"hashtags\":[],\"symbols\":[],\"user_mentions\":[],\"urls\":[]},\"user\":{\"screen_name\":\"charlie\"}},{\"created_at\":\"Mon Oct 08 13:40:12 +0000 2018\",\"id_str\":\"delta\",\"text\":\"echo\",\"entities\":{\"hashtags\":[],\"symbols\":[],\"user_mentions\":[],\"urls\":[]},\"user\":{\"screen_name\":\"foxtrot\"}}]";
	},
	kStubsResponseCustomTwitterTimelineComplete: function() {
		return stubsModule.kStubsResponseCustomTwitterTimelineComplete;
	},
	kStubsBody: function() {
		return 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';
	},
};

describe('WKCResponseParserArticlesForFeedRSS', function testWKCResponseParserArticlesForFeedRSS() {

	it('returns none if no rss', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid().replace('rss', 'rssx')), []);
	});

	it('returns none if no channel', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid().replace('channel', 'channelx')), []);
	});

	it('returns none if no items', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid().replace('item', 'itemx')), []);
	});

	it('returns all if old empty', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSValid()).map(function(e) {
			return e.WKCArticleTitle;
		}), [
			'bravo',
			'alfa',
		]);
	});

	it('returns articles with new guid', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid().replace(/alfa/g, 'charlie')).map(function(e) {
			return e.WKCArticleTitle;
		}), [
			'charlie',
		]);
	});

	it('populates WKCArticleTitle', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticleTitle, 'alfa');
	});

	it('populates WKCArticleOriginalURL', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticleOriginalURL, 'https://www.cbc.ca/bravo');
	});

	it('populates WKCArticleOriginalGUID', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticleOriginalGUID, 'charlie');
	});

	it('populates WKCArticleOriginalGUID as string', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete().replace('charlie', '12345')).pop().WKCArticleOriginalGUID, '12345');
	});

	it('populates WKCArticlePublishDate', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticlePublishDate, new Date('2018-12-07T15:03:15.000Z'));
	});

	it('populates WKCArticleAuthor', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticleAuthor, 'delta');
	});

	it('populates WKCArticleBody', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticleBody, '<p>foxtrot</p>');
	});

	it('populates WKCArticleBody with description if no content:encoded', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete().replace(/<content:encoded>.*<\/content:encoded>/, '')).pop().WKCArticleBody, '<p>echo</p>');
	});

	it('populates WKCArticleSnippet', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticleSnippet, 'foxtrot');
	});

});

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
		assert.deepEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(kStubs.kStubsResponseCustomTwitterTimelineValid(), kStubs.kStubsResponseCustomTwitterTimelineValid()), []);
	});

	it('returns none if new empty', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(kStubs.kStubsResponseCustomTwitterTimelineValid(), '[]'), []);
	});

	it('returns all if old empty', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).map(function(e) {
			return e.WKCArticleOriginalGUID;
		}), [
			'alfa',
			'delta',
		]);
	});

	it('returns articles with new guid', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(kStubs.kStubsResponseCustomTwitterTimelineValid(), kStubs.kStubsResponseCustomTwitterTimelineValid().replace(/alfa/g, 'charlie')).map(function(e) {
			return e.WKCArticleOriginalGUID;
		}), [
			'charlie',
		]);
	});

	it('populates WKCArticleTitle undefined', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleTitle, undefined);
	});

	it('populates WKCArticleOriginalURL', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleOriginalURL, 'https://twitter.com/foxtrot/status/delta');
	});

	it('populates WKCArticleOriginalGUID', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleOriginalGUID, 'delta');
	});

	it('populates WKCArticlePublishDate', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticlePublishDate, new Date('2018-10-08T13:40:12.000Z'));
	});

	it('populates WKCArticleAuthor undefined', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleAuthor, undefined);
	});

	it('populates WKCArticleBody', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleBody, 'echo');
	});

	it('populates WKCArticleSnippet undefined', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleSnippet, undefined);
	});

});

describe('WKCResponseParserSnippetFromText', function testWKCResponseParserSnippetFromText() {

	it('throws error if not string', function() {
		assert.throws(function() {
			mainModule.WKCResponseParserSnippetFromText(null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns subset if large', function() {
		assert.strictEqual(mainModule.WKCResponseParserSnippetFromText(kStubs.kStubsBody()), kStubs.kStubsBody().slice(0, 100).split(' ').slice(0, -1).join(' ') + '…');
	});

	it('returns all if small', function() {
		assert.strictEqual(mainModule.WKCResponseParserSnippetFromText('alfa bravo'), 'alfa bravo');
	});

});
