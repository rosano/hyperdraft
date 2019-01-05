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
	kStubsAtomValid: function() {
		return '<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><entry><title>bravo</title><id>bravo</id><summary>bravo</summary></entry><entry><title>alfa</title><id>alfa</id><summary>alfa</summary></entry></feed>';
	},
	kStubsAtomComplete: function() {
		return '<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><entry><title>alfa</title><link href="https://www.cbc.ca/bravo" /><link rel="edit" href="http://example.org/golf" /><id>charlie</id><updated>2018-12-07T15:03:15Z</updated><summary>echo</summary><content type="xhtml"><div xmlns="http://www.w3.org/1999/xhtml"><p>foxtrot</p></div></content><author><name>delta</name></author></entry></feed>';
	},
	kStubsResponseCustomTwitterTimelineValid: function() {
		return "[{\"created_at\":\"Wed Oct 31 15:59:13 +0000 2018\",\"id_str\":\"alfa\",\"full_text\":\"bravo\",\"entities\":{\"hashtags\":[],\"symbols\":[],\"user_mentions\":[],\"urls\":[]},\"user\":{\"screen_name\":\"charlie\"}},{\"created_at\":\"Mon Oct 08 13:40:12 +0000 2018\",\"id_str\":\"delta\",\"full_text\":\"echo\",\"entities\":{\"hashtags\":[],\"symbols\":[],\"user_mentions\":[],\"urls\":[]},\"user\":{\"screen_name\":\"charlie\"}}]";
	},
	kStubsResponseCustomTwitterTimelineComplete: function() {
		return JSON.stringify(stubsModule.kStubsResponseCustomTwitterTimelineComplete());
	},
	kStubsBody: function() {
		return 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';
	},
};

describe('WKCResponseParserArticlesForFeedRSS', function testWKCResponseParserArticlesForFeedRSS() {

	it('throws error if param1 not object', function() {
		assert.throws(function() {
			mainModule.WKCResponseParserArticlesForFeedRSS(null, kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid());
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param1 missing parseFromString', function() {
		assert.throws(function() {
			mainModule.WKCResponseParserArticlesForFeedRSS({}, kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid());
		}, /WKCErrorInvalidInput/);
	});

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

describe('WKCResponseParserArticlesForFeedAtom', function testWKCResponseParserArticlesForFeedAtom() {

	it('throws error if param1 not object', function() {
		assert.throws(function() {
			mainModule.WKCResponseParserArticlesForFeedAtom(null, null, kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid());
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param1 missing parseFromString', function() {
		assert.throws(function() {
			mainModule.WKCResponseParserArticlesForFeedAtom({}, kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid());
		}, /WKCErrorInvalidInput/);
	});

	it('returns none if no feed', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), kStubs.kStubsAtomValid(), kStubs.kStubsAtomValid().replace('feed', 'feedx')), []);
	});

	it('returns none if no items', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), kStubs.kStubsAtomValid(), kStubs.kStubsAtomValid().replace('entry', 'entryx')), []);
	});

	it('returns all if old empty', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomValid()).map(function(e) {
			return e.WKCArticleTitle;
		}), [
			'bravo',
			'alfa',
		]);
	});

	it('returns articles with new guid', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), kStubs.kStubsAtomValid(), kStubs.kStubsAtomValid().replace(/alfa/g, 'charlie')).map(function(e) {
			return e.WKCArticleTitle;
		}), [
			'charlie',
		]);
	});

	it('populates WKCArticleTitle', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticleTitle, 'alfa');
	});

	it('populates WKCArticleOriginalURL', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticleOriginalURL, 'https://www.cbc.ca/bravo');
	});

	it('populates WKCArticleOriginalURL if no neutral', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete().replace('<link href="https://www.cbc.ca/bravo" />', '')).pop().WKCArticleOriginalURL, 'http://example.org/golf');
	});

	it('populates WKCArticleOriginalGUID', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticleOriginalGUID, 'charlie');
	});

	it('populates WKCArticleOriginalGUID as string', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete().replace('charlie', '12345')).pop().WKCArticleOriginalGUID, '12345');
	});

	it('populates WKCArticlePublishDate', function() {
		assert.deepEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticlePublishDate, new Date('2018-12-07T15:03:15.000Z'));
	});

	it('populates WKCArticleAuthor', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticleAuthor, 'delta');
	});

	it('populates WKCArticleBody', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticleBody, '<div xmlns="http://www.w3.org/1999/xhtml"><p>foxtrot</p></div>');
	});

	it('populates WKCArticleBody with description if no content', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete().replace(/<content type="xhtml">.*<\/content>/, '')).pop().WKCArticleBody, 'echo');
	});

	it('populates WKCArticleSnippet', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticleSnippet, 'foxtrot');
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
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleOriginalURL, 'https://twitter.com/charlie/status/delta');
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
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleBody, '<p>echo</p>');
	});

	it('populates WKCArticleSnippet undefined', function() {
		assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleSnippet, 'echo');
	});

	context('WKCArticleBody', function () {
		
		it('converts line breaks', function() {
			assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid().replace('echo', 'echo\\n\\nfoxtrot')).pop().WKCArticleBody, '<p>echo</p>\n<p>foxtrot</p>');
		});
		
		it('converts hashtags', function() {
			assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid().replace('echo', '#echo #foxtrot')).pop().WKCArticleBody, '<p><a href="https://twitter.com/hashtag/echo">#echo</a> <a href="https://twitter.com/hashtag/foxtrot">#foxtrot</a></p>');
		});
		
		it('converts usernames', function() {
			assert.strictEqual(mainModule.WKCResponseParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid().replace('echo', '@echo @foxtrot')).pop().WKCArticleBody, '<p><a href="https://twitter.com/echo">@echo</a> <a href="https://twitter.com/foxtrot">@foxtrot</a></p>');
		});

	});

});

describe('WKCResponseParserHTMLForPlaintext', function testWKCResponseParserHTMLForPlaintext() {

	it('throws error if not string', function() {
		assert.throws(function() {
			mainModule.WKCResponseParserHTMLForPlaintext(null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns string as p', function() {
		assert.strictEqual(mainModule.WKCResponseParserHTMLForPlaintext('alfa'), '<p>alfa</p>');
	});

	it('converts simple headers without anchors', function() {
		assert.strictEqual(mainModule.WKCResponseParserHTMLForPlaintext('# alfa'), '<h1>alfa</h1>');
	});

	it('converts single newline as br', function() {
		assert.strictEqual(mainModule.WKCResponseParserHTMLForPlaintext('alfa\nbravo'), '<p>alfa<br />\nbravo</p>');
	});

	it('converts double newline as p', function() {
		assert.strictEqual(mainModule.WKCResponseParserHTMLForPlaintext('alfa\n\nbravo'), '<p>alfa</p>\n<p>bravo</p>');
	});

	it('converts www domains to links', function() {
		assert.strictEqual(mainModule.WKCResponseParserHTMLForPlaintext('www.alfa.com'), '<p><a href="http://www.alfa.com">www.alfa.com</a></p>');
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
