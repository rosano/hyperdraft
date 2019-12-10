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
	kStubsDOMParserInstance() {
		return new (new jsdomPackage.JSDOM('')).window.DOMParser();
	},
	kStubsRSSValid() {
		return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><item><title>bravo</title><guid>bravo</guid><description>bravo</description></item><item><title>alfa</title><guid>alfa</guid><description>alfa</description></item></channel></rss>';
	},
	kStubsRSSComplete() {
		return '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><item><title>alfa</title><link>https://www.cbc.ca/bravo</link><guid isPermaLink="false">charlie</guid><pubDate>Fri, 7 Dec 2018 10:03:15 EST</pubDate><author>delta</author><description><![CDATA[\
                        <p>echo</p>\
        ]]>\
        </description><content:encoded><![CDATA[\
                        <p>foxtrot</p>\
        ]]>\
        </content:encoded></item></channel></rss>';
	},
	kStubsAtomValid() {
		return '<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><entry><title>bravo</title><id>bravo</id><summary>bravo</summary></entry><entry><title>alfa</title><id>alfa</id><summary>alfa</summary></entry></feed>';
	},
	kStubsAtomComplete() {
		return '<?xml version="1.0" encoding="UTF-8"?><feed xmlns="http://www.w3.org/2005/Atom"><entry><title>alfa</title><link href="https://www.cbc.ca/bravo" /><link rel="edit" href="http://example.org/golf" /><id>charlie</id><updated>2018-12-07T15:03:15Z</updated><summary>echo</summary><content type="xhtml"><div xmlns="http://www.w3.org/1999/xhtml"><p>foxtrot</p></div></content><author><name>delta</name></author></entry></feed>';
	},
	kStubsResponseCustomTwitterTimelineValid() {
		return '[{"created_at":"Wed Oct 31 15:59:13 +0000 2018","id_str":"alfa","full_text":"bravo","entities":{"hashtags":[],"symbols":[],"user_mentions":[],"urls":[]},"user":{"screen_name":"charlie"}},{"created_at":"Mon Oct 08 13:40:12 +0000 2018","id_str":"delta","full_text":"echo","entities":{"hashtags":[],"symbols":[],"user_mentions":[],"urls":[]},"user":{"screen_name":"charlie"}}]';
	},
	kStubsResponseCustomTwitterTimelineComplete() {
		return JSON.stringify(stubsModule.kStubsResponseCustomTwitterTimelineComplete());
	},
	kStubsHTML(inputData) {
		return [
			'<!DOCTYPE html><html><head><title>bravo</title></head><body>',
			inputData || '<h1>alfa</h1><script>var charlie = "delta";</script><style type="text/css">.echo {foxtrot: "golf";}</style>',
			'</body></html>',
		].join('');
	},
	kStubsBody() {
		return 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.';
	},
	kStubsTextMultiline(count) {
		return 'alfa bravo charlie delta echo foxtrot golf hotel india juliet kilo'.split(' ').slice(0, typeof count === 'undefined' ? Infinity : count).join('\n').concat('\n');
	},
};

describe('KVCParserArticlesForFeedRSS', function testKVCParserArticlesForFeedRSS() {

	it('throws error if param1 not DOMParser', function() {
		assert.throws(function() {
			mainModule.KVCParserArticlesForFeedRSS(null, kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid());
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param1 missing parseFromString', function() {
		assert.throws(function() {
			mainModule.KVCParserArticlesForFeedRSS({}, kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid());
		}, /KVCErrorInputNotValid/);
	});

	it('returns none if no rss', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid().replace('rss', 'rssx')), []);
	});

	it('returns none if no channel', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid().replace('channel', 'channelx')), []);
	});

	it('returns none if no items', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid().replace('item', 'itemx')), []);
	});

	it('returns all if old empty', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSValid()).map(function(e) {
			return e.WKCArticleTitle;
		}), [
			'bravo',
			'alfa',
		]);
	});

	it('returns articles with new guid', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid().replace(/alfa/g, 'charlie')).map(function(e) {
			return e.WKCArticleTitle;
		}), [
			'charlie',
		]);
	});

	it('populates WKCArticleTitle', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticleTitle, 'alfa');
	});

	it('populates WKCArticleOriginalURL', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticleOriginalURL, 'https://www.cbc.ca/bravo');
	});

	it('populates WKCArticleOriginalGUID', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticleOriginalGUID, 'charlie');
	});

	it('populates WKCArticleOriginalGUID as string', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete().replace('charlie', '12345')).pop().WKCArticleOriginalGUID, '12345');
	});

	it('populates WKCArticleOriginalGUID if none', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete().replace(/<guid.*guid>/g, '')).pop().WKCArticleOriginalGUID, 'https://www.cbc.ca/bravo');
	});

	it('populates WKCArticlePublishDate', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticlePublishDate, new Date('2018-12-07T15:03:15.000Z'));
	});

	it('populates WKCArticlePublishDate if dc:date', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete().replace('version="2.0"', 'version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"').replace(/pubDate/g, 'dc:date')).pop().WKCArticlePublishDate, new Date('2018-12-07T15:03:15.000Z'));
	});

	it('populates WKCArticlePublishDate if none', function() {
		assert.strictEqual(new Date() - mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSValid()).pop().WKCArticlePublishDate < 50, true);
	});

	it('populates WKCArticleAuthor', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticleAuthor, 'delta');
	});

	it('populates WKCArticleBody', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticleBody, '<p>foxtrot</p>');
	});

	it('populates WKCArticleBody with description if no content:encoded', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete().replace(/<content:encoded>.*<\/content:encoded>/, '')).pop().WKCArticleBody, '<p>echo</p>');
	});

	it('populates WKCArticleSnippet', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedRSS(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsRSSComplete()).pop().WKCArticleSnippet, 'foxtrot');
	});

});

describe('KVCParserArticlesForFeedAtom', function testKVCParserArticlesForFeedAtom() {

	it('throws error if param1 not object', function() {
		assert.throws(function() {
			mainModule.KVCParserArticlesForFeedAtom(null, null, kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid());
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param1 missing parseFromString', function() {
		assert.throws(function() {
			mainModule.KVCParserArticlesForFeedAtom({}, kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid());
		}, /KVCErrorInputNotValid/);
	});

	it('returns none if no feed', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), kStubs.kStubsAtomValid(), kStubs.kStubsAtomValid().replace('feed', 'feedx')), []);
	});

	it('returns none if no items', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), kStubs.kStubsAtomValid(), kStubs.kStubsAtomValid().replace('entry', 'entryx')), []);
	});

	it('returns all if old empty', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomValid()).map(function(e) {
			return e.WKCArticleTitle;
		}), [
			'bravo',
			'alfa',
		]);
	});

	it('returns articles with new guid', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), kStubs.kStubsAtomValid(), kStubs.kStubsAtomValid().replace(/alfa/g, 'charlie')).map(function(e) {
			return e.WKCArticleTitle;
		}), [
			'charlie',
		]);
	});

	it('populates WKCArticleTitle', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticleTitle, 'alfa');
	});

	it('populates WKCArticleOriginalURL', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticleOriginalURL, 'https://www.cbc.ca/bravo');
	});

	it('populates WKCArticleOriginalURL if no neutral', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete().replace('<link href="https://www.cbc.ca/bravo" />', '')).pop().WKCArticleOriginalURL, 'http://example.org/golf');
	});

	it('populates WKCArticleOriginalGUID', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticleOriginalGUID, 'charlie');
	});

	it('populates WKCArticleOriginalGUID as string', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete().replace('charlie', '12345')).pop().WKCArticleOriginalGUID, '12345');
	});

	it('populates WKCArticleOriginalGUID if none', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete().replace(/<id.*id>/, '')).pop().WKCArticleOriginalGUID, 'https://www.cbc.ca/bravo');
	});

	it('populates WKCArticlePublishDate', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticlePublishDate, new Date('2018-12-07T15:03:15.000Z'));
	});

	it('populates WKCArticlePublishDate if nane', function() {
		assert.deepEqual(new Date() - mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomValid()).pop().WKCArticlePublishDate < 50, true);
	});

	it('populates WKCArticlePublishDate if published', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete().replace('<updated>2018-12-07T15:03:15Z</updated>', '<published>2016-02-09T19:59:15+00:00</published>')).pop().WKCArticlePublishDate, new Date('2016-02-09T19:59:15.000Z'));
	});

	it('populates WKCArticleAuthor', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticleAuthor, 'delta');
	});

	it('populates WKCArticleBody', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticleBody, '<div xmlns="http://www.w3.org/1999/xhtml"><p>foxtrot</p></div>');
	});

	it('populates WKCArticleBody with description if no content', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete().replace(/<content type="xhtml">.*<\/content>/, '')).pop().WKCArticleBody, 'echo');
	});

	it('populates WKCArticleBody with empty if no element', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomValid().replace(/<summary>.*<\/summary>/g, '')).pop().WKCArticleBody, '');
	});

	it('populates WKCArticleSnippet', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFeedAtom(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsAtomComplete()).pop().WKCArticleSnippet, 'foxtrot');
	});

});

describe('KVCParserArticlesForPage', function testKVCParserArticlesForPage() {

	it('throws error if param1 not DOMParser', function() {
		assert.throws(function() {
			mainModule.KVCParserArticlesForPage(null, kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid());
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param1 missing parseFromString', function() {
		assert.throws(function() {
			mainModule.KVCParserArticlesForPage({}, kStubs.kStubsRSSValid(), kStubs.kStubsRSSValid());
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param3 not string', function() {
		assert.throws(function() {
			mainModule.KVCParserArticlesForPage(kStubs.kStubsDOMParserInstance(), 'alfa', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns none if identical', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForPage(kStubs.kStubsDOMParserInstance(), kStubs.kStubsHTML(), kStubs.kStubsHTML()), []);
	});

	it('returns none if head changes', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForPage(kStubs.kStubsDOMParserInstance(), kStubs.kStubsHTML(), kStubs.kStubsHTML().replace('bravo', 'bravox')), []);
	});

	it('ignores script', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForPage(kStubs.kStubsDOMParserInstance(), kStubs.kStubsHTML(), kStubs.kStubsHTML().replace('delta', 'deltax')), []);
	});

	it('ignores style', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForPage(kStubs.kStubsDOMParserInstance(), kStubs.kStubsHTML(), kStubs.kStubsHTML().replace('golf', 'golfx')), []);
	});

	it('returns one if not identical', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForPage(kStubs.kStubsDOMParserInstance(), kStubs.kStubsHTML(), kStubs.kStubsHTML().replace('alfa', 'alfax')).length, 1);
	});

	it('populates article date', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForPage(kStubs.kStubsDOMParserInstance(), kStubs.kStubsHTML(), kStubs.kStubsHTML().replace('alfa', 'alfax')).pop().WKCArticlePublishDate - (new Date()) < 100, true);
	});

	it('populates article body', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForPage(kStubs.kStubsDOMParserInstance(), kStubs.kStubsHTML(), kStubs.kStubsHTML().replace('alfa', 'alfax')).pop().WKCArticleBody, '<h1>alfa<ins>x</ins></h1>');
	});

	it('populates blank links with title value', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForPage(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsHTML('<a href="hotel" title="alfa"></a>')).pop().WKCArticleBody, '<p><ins><a href="hotel">alfa</a></ins></p>');
	});

	it('populates blank links with placeholder', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForPage(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsHTML('<a href="hotel"></a>')).pop().WKCArticleBody, '<p><ins><a href="hotel">[_____]</a></ins></p>');
	});

	it('strips whitespace from link content', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForPage(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsHTML('<a href="hotel"><div><p><strong>india</strong><br></p></div></a>')).pop().WKCArticleBody, '<p><ins><a href="hotel"><strong>india</strong></a></ins></p>');
	});

	it('handles multiple link tasks simultaneously', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForPage(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsHTML('<a href="hotel"><div><p>india<br></p></div></a><a href="hotel"></a><a href="hotel"><div><p>india<br></p></div></a><a href="hotel"></a>')).pop().WKCArticleBody, '<p><ins><a href="hotel">india</a><a href="hotel">[_____]</a><a href="hotel">india</a><a href="hotel">[_____]</a></ins></p>');
	});

	it.skip('wraps children with ins', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForPage(kStubs.kStubsDOMParserInstance(), null, kStubs.kStubsHTML('<h1>alfa</h1><p>bravo</p><a href="delta">charlie</a>')).pop().WKCArticleBody, '<h1><ins>alfa</ins></h1><p><ins>bravo</ins></p><a href="delta"><ins>charlie</ins></a>');
	});

});

describe('KVCParserArticlesForFile', function testKVCParserArticlesForFile() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.KVCParserArticlesForFile('alfa', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns none if identical', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFile('alfa', 'alfa'), []);
	});

	it('returns one if not identical', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForFile('alfa', 'alfax').length, 1);
	});

	it('populates article date', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFile('alfa', 'alfax').pop().WKCArticlePublishDate - (new Date()) < 100, true);
	});

	it('populates article body', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFile('alfa', 'alfax').pop().WKCArticleBody, 'alfa<ins>x</ins>');
	});

	it('escapes html tags', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFile('<b>alfa</b>', '<b>alfax</b>').pop().WKCArticleBody, '&lt;b&gt;alfa<ins>x</ins>&lt;/b&gt;');
	});

	it('adds markup for line breaks', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForFile(kStubs.kStubsTextMultiline(3), kStubs.kStubsTextMultiline(3).replace('alfa', 'alfax')).pop().WKCArticleBody, kStubs.kStubsTextMultiline(3).replace('alfa', 'alfa<ins>x</ins>').replace(/\n/g, '<br>'));
	});

});

describe('KVCParserInputDataIsCustomTwitterTimeline', function testKVCParserInputDataIsCustomTwitterTimeline() {

	it('returns false if not array', function() {
		assert.strictEqual(mainModule.KVCParserInputDataIsCustomTwitterTimeline(null), false);
	});

	it('returns true', function() {
		assert.strictEqual(mainModule.KVCParserInputDataIsCustomTwitterTimeline([]), true);
	});

});

describe('KVCParserArticlesForCustomTwitterTimeline', function testKVCParserArticlesForCustomTwitterTimeline() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.KVCParserArticlesForCustomTwitterTimeline('[]', null);
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param1 not format', function() {
		assert.throws(function() {
			mainModule.KVCParserArticlesForCustomTwitterTimeline('{}', '[]');
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not format', function() {
		assert.throws(function() {
			mainModule.KVCParserArticlesForCustomTwitterTimeline('[]', '{}');
		}, /KVCErrorInputNotValid/);
	});

	it('returns none if identical', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(kStubs.kStubsResponseCustomTwitterTimelineValid(), kStubs.kStubsResponseCustomTwitterTimelineValid()), []);
	});

	it('returns none if new empty', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(kStubs.kStubsResponseCustomTwitterTimelineValid(), '[]'), []);
	});

	it('returns all if old empty', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).map(function(e) {
			return e.WKCArticleOriginalGUID;
		}), [
			'alfa',
			'delta',
		]);
	});

	it('returns articles with new guid', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(kStubs.kStubsResponseCustomTwitterTimelineValid(), kStubs.kStubsResponseCustomTwitterTimelineValid().replace(/alfa/g, 'charlie')).map(function(e) {
			return e.WKCArticleOriginalGUID;
		}), [
			'charlie',
		]);
	});

	it('populates WKCArticleTitle undefined', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleTitle, undefined);
	});

	it('populates WKCArticleOriginalURL', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleOriginalURL, 'https://twitter.com/charlie/status/delta');
	});

	it('populates WKCArticleOriginalGUID', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleOriginalGUID, 'delta');
	});

	it('populates WKCArticlePublishDate', function() {
		assert.deepEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticlePublishDate, new Date('2018-10-08T13:40:12.000Z'));
	});

	it('populates WKCArticleAuthor undefined', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleAuthor, undefined);
	});

	it('populates WKCArticleBody', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleBody, '<p>echo</p>');
	});

	it('populates WKCArticleSnippet undefined', function() {
		assert.strictEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid()).pop().WKCArticleSnippet, 'echo');
	});

	context('WKCArticleBody', function () {
		
		it('converts line breaks', function() {
			assert.strictEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid().replace('echo', 'echo\\n\\nfoxtrot')).pop().WKCArticleBody, '<p>echo</p>\n<p>foxtrot</p>');
		});
		
		it('converts hashtags', function() {
			assert.strictEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid().replace('echo', '#echo #foxtrot')).pop().WKCArticleBody, '<p><a href="https://twitter.com/hashtag/echo">#echo</a> <a href="https://twitter.com/hashtag/foxtrot">#foxtrot</a></p>');
		});
		
		it('converts usernames', function() {
			assert.strictEqual(mainModule.KVCParserArticlesForCustomTwitterTimeline(null, kStubs.kStubsResponseCustomTwitterTimelineValid().replace('echo', '@echo @foxtrot')).pop().WKCArticleBody, '<p><a href="https://twitter.com/echo">@echo</a> <a href="https://twitter.com/foxtrot">@foxtrot</a></p>');
		});

	});

});

describe('KVCParserHTMLForPlaintext', function testKVCParserHTMLForPlaintext() {

	it('throws error if not string', function() {
		assert.throws(function() {
			mainModule.KVCParserHTMLForPlaintext(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string as p', function() {
		assert.strictEqual(mainModule.KVCParserHTMLForPlaintext('alfa'), '<p>alfa</p>');
	});

	it('converts simple headers without anchors', function() {
		assert.strictEqual(mainModule.KVCParserHTMLForPlaintext('# alfa'), '<h1>alfa</h1>');
	});

	it('converts single newline as br', function() {
		assert.strictEqual(mainModule.KVCParserHTMLForPlaintext('alfa\nbravo'), '<p>alfa<br />\nbravo</p>');
	});

	it('converts double newline as p', function() {
		assert.strictEqual(mainModule.KVCParserHTMLForPlaintext('alfa\n\nbravo'), '<p>alfa</p>\n<p>bravo</p>');
	});

	it('converts www domains to links', function() {
		assert.strictEqual(mainModule.KVCParserHTMLForPlaintext('www.alfa.com'), '<p><a href="http://www.alfa.com">www.alfa.com</a></p>');
	});

});

describe('KVCParserTitleForPlaintext', function testKVCParserTitleForPlaintext() {

	it('returns empty if empty', function() {
		assert.deepEqual(mainModule.KVCParserTitleForPlaintext(), '');
		assert.deepEqual(mainModule.KVCParserTitleForPlaintext(null), '');
		assert.deepEqual(mainModule.KVCParserTitleForPlaintext(''), '');
	});

	it('returns first line if single', function() {
		assert.deepEqual(mainModule.KVCParserTitleForPlaintext('alpha'), 'alpha');
	});

	it('returns first line if multiple', function() {
		assert.deepEqual(mainModule.KVCParserTitleForPlaintext('alpha\n'), 'alpha');
		assert.deepEqual(mainModule.KVCParserTitleForPlaintext('alpha\nbravo'), 'alpha');
	});

	it('returns empty if blank', function() {
		assert.deepEqual(mainModule.KVCParserTitleForPlaintext('\nalpha'), '');
		assert.deepEqual(mainModule.KVCParserTitleForPlaintext('\n\nalpha'), '');
	});

});

describe('KVCParserBodyForPlaintext', function testKVCParserBodyForPlaintext() {

	it('returns empty if empty', function() {
		assert.deepEqual(mainModule.KVCParserBodyForPlaintext(), '');
		assert.deepEqual(mainModule.KVCParserBodyForPlaintext(null), '');
		assert.deepEqual(mainModule.KVCParserBodyForPlaintext(''), '');
	});

	it('returns empty if single', function() {
		assert.deepEqual(mainModule.KVCParserBodyForPlaintext('alpha'), '');
	});

	it('returns first line if multiple', function() {
		assert.deepEqual(mainModule.KVCParserBodyForPlaintext('\n'), '');
		assert.deepEqual(mainModule.KVCParserBodyForPlaintext('alpha\n'), '');
		assert.deepEqual(mainModule.KVCParserBodyForPlaintext('alpha\nbravo'), 'bravo');
	});

	it('returns first line if blank', function() {
		assert.deepEqual(mainModule.KVCParserBodyForPlaintext('alpha\n\nbravo'), 'bravo');
	});

});

describe('KVCParserSnippetForPlaintext', function testKVCParserSnippetForPlaintext() {

	it('throws error if not string', function() {
		assert.throws(function() {
			mainModule.KVCParserSnippetForPlaintext(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns subset if large', function() {
		assert.strictEqual(mainModule.KVCParserSnippetForPlaintext(kStubs.kStubsBody()), kStubs.kStubsBody().slice(0, 100).split(' ').slice(0, -1).join(' ') + '…');
	});

	it('returns all if small', function() {
		assert.strictEqual(mainModule.KVCParserSnippetForPlaintext('alfa bravo'), 'alfa bravo');
	});

});

describe('KVCParserReplaceLinks', function testKVCParserReplaceLinks() {

	it('throws error if param1 not string', function() {
		assert.throws(function() {
			mainModule.KVCParserReplaceLinks(null, {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not object', function() {
		assert.throws(function() {
			mainModule.KVCParserReplaceLinks('', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns input', function() {
		assert.strictEqual(mainModule.KVCParserReplaceLinks('alfa', {}), 'alfa');
	});

	it('ignores if no replacement', function() {
		assert.strictEqual(mainModule.KVCParserReplaceLinks('[[alfa]]', {
			bravo: 'charlie',
		}), '[[alfa]]');
	});

	it('ignores if not double-bracket', function() {
		assert.strictEqual(mainModule.KVCParserReplaceLinks('[alfa]', {
			alfa: 'bravo',
		}), '[alfa]');
	});

	it('replaces single', function() {
		assert.strictEqual(mainModule.KVCParserReplaceLinks('[[alfa]]', {
			alfa: 'bravo',
		}), 'bravo');
	});

	it('replaces multiple', function() {
		assert.strictEqual(mainModule.KVCParserReplaceLinks('[[alfa]] [[charlie]]', {
			alfa: 'bravo',
			charlie: 'delta',
		}), 'bravo delta');
	});

	it('replaces global', function() {
		assert.strictEqual(mainModule.KVCParserReplaceLinks('[[alfa]] [[alfa]]', {
			alfa: 'bravo',
		}), 'bravo bravo');
	});

});
