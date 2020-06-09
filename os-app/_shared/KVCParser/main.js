const turndownPackage = typeof require === 'undefined' ? window.TurndownService : require('turndown');
const showdownPackage = typeof require === 'undefined' ? window.showdown : require('showdown');
const htmlEntitiesPackage = typeof require === 'undefined' ? {} : require('html-entities');

const KVCDiffPackage = typeof require === 'undefined' ? window.KVCDiff : require('../KVCDiff/main.js');

const turndownInstance = new turndownPackage({
	headingStyle: 'atx',
});
turndownInstance.remove('title');
turndownInstance.remove('script');
turndownInstance.remove('style');
turndownInstance.addRule('trim whitespace in link text', {
	filter (node, options) {
		return node.nodeName === 'A' && node.innerHTML !== node.textContent;
	},
	replacement (content, node) {
		return [
			'[',
			content.trim(),
			'](',
			node.getAttribute('href'),
			')',
		].join('');
	},
});
turndownInstance.addRule('populate blank links', {
	filter (node, options) {
		return node.nodeName === 'A' && !node.textContent.trim();
	},
	replacement (content, node) {
		return [
			'[',
			node.getAttribute('title') || '\\[\\_\\_\\_\\_\\_\\]',
			'](',
			node.getAttribute('href'),
			')',
		].join('');
	},
});

const showdownConverter = new showdownPackage.Converter();
showdownConverter.setOption('simpleLineBreaks', true);
showdownConverter.setOption('simplifiedAutoLink', true);
showdownConverter.setOption('noHeaderId', true);

const contentForFirst = function (inputData) {
	return inputData[0] ? inputData[0].textContent : '';
};

const mod = {

	KVCParserArticlesForFeedRSS (DOMParserInstance, oldString, newString) {
		if (typeof DOMParserInstance !== 'object' || DOMParserInstance === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof DOMParserInstance.parseFromString !== 'function') {
			throw new Error('KVCErrorInputNotValid');
		}

		const parsedXML = DOMParserInstance.parseFromString(oldString, 'application/xml');

		var oldIDs = (!oldString ? [] : [].slice.call(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('item'))).map(function (e) {
			return contentForFirst(e.getElementsByTagName('guid'));
		});

		const channelElement = DOMParserInstance.parseFromString(newString, 'application/xml').getElementsByTagName('channel')[0];

		if (!channelElement) {
			return [];
		}

		return [].slice.call(channelElement.getElementsByTagName('item')).filter(function(e) {
			return !oldIDs.includes(contentForFirst(e.getElementsByTagName('guid')));
		}).map(function(e) {
			const itemContent = (contentForFirst(e.getElementsByTagName('content:encoded')) || contentForFirst(e.getElementsByTagName('description'))).trim();

			return {
				WKCArticleTitle: contentForFirst(e.getElementsByTagName('title')),
				WKCArticleOriginalURL: contentForFirst(e.getElementsByTagName('link')),
				WKCArticleOriginalGUID: contentForFirst(e.getElementsByTagName('guid')) || contentForFirst(e.getElementsByTagName('link')),
				WKCArticlePublishDate: new Date(contentForFirst(e.getElementsByTagName('pubDate')) || contentForFirst(e.getElementsByTagName('dc:date')) || Date.now()),
				WKCArticleAuthor: contentForFirst(e.getElementsByTagName('author')),
				WKCArticleBody: itemContent,
				WKCArticleSnippet: exports.KVCParserSnippetForPlaintext(DOMParserInstance.parseFromString(`<div>${itemContent}</div>`, 'text/html').body.textContent),
			};
		});
	},

	KVCParserArticlesForFeedAtom (DOMParserInstance, oldString, newString) {
		if (typeof DOMParserInstance !== 'object' || DOMParserInstance === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof DOMParserInstance.parseFromString !== 'function') {
			throw new Error('KVCErrorInputNotValid');
		}

		var parsedXML = DOMParserInstance.parseFromString(oldString, 'application/xml');

		var oldIDs = (!oldString ? [] : [].slice.call(parsedXML.getElementsByTagName('entry'))).map(function (e) {
			return contentForFirst(e.getElementsByTagName('id'));
		});

		return [].slice.call(DOMParserInstance.parseFromString(newString, 'application/xml').getElementsByTagName('entry')).filter(function(e) {
			return !oldIDs.includes(contentForFirst(e.getElementsByTagName('id')));
		}).map(function(e) {
			var itemContent = (function () {
				var contentString = e.getElementsByTagName('content')[0] || e.getElementsByTagName('summary')[0];

				try {
					contentString = contentString ? contentString.innerHTML : '';
				} catch(e) {
					console.log([e, 'using textContent']);
					contentString = contentString ? contentString.textContent : '';
				}

				return contentString.trim();
			})();

			var itemLink = [].slice.call(e.getElementsByTagName('link')).sort(function (a, b) {
				return !!a.getAttribute('rel') - !!b.getAttribute('rel');
			}).map(function (e) {
				return e.getAttribute('href');
			}).shift();

			return {
				WKCArticleTitle: contentForFirst(e.getElementsByTagName('title')),
				WKCArticleOriginalURL: itemLink,
				WKCArticleOriginalGUID: contentForFirst(e.getElementsByTagName('id')) || itemLink,
				WKCArticlePublishDate: new Date(contentForFirst(e.getElementsByTagName('published')) || contentForFirst(e.getElementsByTagName('updated')) || Date.now()),
				WKCArticleAuthor: contentForFirst(e.getElementsByTagName('author')),
				WKCArticleBody: itemContent,
				WKCArticleSnippet: exports.KVCParserSnippetForPlaintext(DOMParserInstance.parseFromString(`<div>${itemContent}</div>`, 'text/html').body.textContent),
			};
		});
	},

	KVCParserArticlesForPage (DOMParserInstance, oldString, newString) {
		if (typeof DOMParserInstance !== 'object' || DOMParserInstance === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof DOMParserInstance.parseFromString !== 'function') {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof newString !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		oldString = exports.KVCParserPlaintextForHTML(oldString || '');
		newString = exports.KVCParserPlaintextForHTML(newString);

		if (oldString === newString) {
			return [];
		}

		return [{
			WKCArticleBody: KVCDiffPackage._KVCDiffConvertDiffTagsToHTML(exports.KVCParserHTMLForPlaintext(KVCDiffPackage.KVCDiffHTMLForStrings(oldString, newString))),
			WKCArticlePublishDate: new Date(),
		}];
	},

	KVCParserArticlesForFile (oldString, newString) {
		if (typeof newString !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		if (oldString === newString) {
			return [];
		}

		return [{
			WKCArticleBody: KVCDiffPackage._KVCDiffConvertDiffTagsToHTML(new (htmlEntitiesPackage.AllHtmlEntities)().encode(KVCDiffPackage.KVCDiffHTMLForStrings(oldString, newString)).replace(/\n/g, '<br>')),
			WKCArticlePublishDate: new Date(),
		}];
	},

	KVCParserInputDataIsCustomTwitterTimeline (inputData) {
		return Array.isArray(inputData);
	},

	KVCParserArticlesForCustomTwitterTimeline (oldBody, newBody) {
		if (typeof newBody !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		const oldJSON = JSON.parse(oldBody || '[]');

		if (!Array.isArray(oldJSON)) {
			throw new Error('KVCErrorInputNotValid');
		}

		const newJSON = JSON.parse(newBody);

		if (!Array.isArray(newJSON)) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (!newJSON) {
			return [];
		}

		return newJSON.filter(function(e) {
			return !oldJSON.map(function (e) {
				return e.id_str;
			}).includes(e.id_str);
		}).map(function(e) {
			return {
				WKCArticleOriginalGUID: e.id_str,
				WKCArticleOriginalURL: `https://twitter.com/${e.user.screen_name}/status/${e.id_str}`,
				WKCArticlePublishDate: new Date(e.created_at),
				WKCArticleBody: exports.KVCParserHTMLForPlaintext(exports._KVCParserTweetBodyForTweetObject(e)),
				WKCArticleSnippet: exports.KVCParserSnippetForPlaintext(e.full_text),
			};
		});
	},

	_KVCParserTweetBodyForTweetObject (inputData) {
		var tweetBody = inputData.full_text;

		(tweetBody.match(/#([^\W ]+)/g) || []).forEach(function (e) {
			tweetBody = tweetBody.replace(new RegExp(e, 'g'), `[${e}](https://twitter.com/hashtag/${e.replace('#', '')})`);
		});

		(tweetBody.match(/@([^\W ]+)/g) || []).forEach(function (e) {
			tweetBody = tweetBody.replace(new RegExp(e, 'g'), `[${e}](https://twitter.com/${e.replace('@', '')})`);
		});

		return tweetBody;
	},

	KVCParserHTMLForPlaintext (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return showdownConverter.makeHtml(inputData);
	},

	KVCParserPlaintextForHTML (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return turndownInstance.turndown(inputData);
	},

	KVCParserTitleForPlaintext (inputData) {
		if (typeof inputData !== 'string') {
			return '';
		}

		return inputData.split('\n').shift();
	},

	KVCParserBodyForPlaintext (inputData) {
		if (typeof inputData !== 'string') {
			return '';
		}

		return inputData.split('\n').slice(1).join('\n').trim();
	},

	KVCParserSnippetForPlaintext (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return inputData.length <= 100 ? inputData : inputData.slice(0, 100).split(' ').slice(0, -1).join(' ').concat('…');
	},

	KVCParserReplaceLinks (param1, param2) {
		if (typeof param1 !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof param2 !== 'object' || param2 === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		return Object.entries(param2).reduce(function (coll, e) {
			return coll.replace(new RegExp(`\\[\\[${ e[0] }\\]\\]`, 'g'), e[1]);
		}, param1);
	},

};

Object.assign(exports, mod);
