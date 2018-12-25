/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var jsDOMPackage = require('jsdom');
const { JSDOM } = jsDOMPackage;
const diffPackage = require('diff');
var htmlEntitiesPackage = require('html-entities');
htmlEntitiesInstance = new (htmlEntitiesPackage.AllHtmlEntities)();
var turndownPackage = require('turndown');
var turndownInstance = new turndownPackage({
	headingStyle: 'atx',
});
turndownInstance.remove('script');
turndownInstance.remove('style');
turndownInstance.addRule('trim whitespace in link text', {
	filter: function (node, options) {
		return node.nodeName === 'A' && node.innerHTML !== node.textContent;
	},
	replacement: function (content, node) {
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
	filter: function (node, options) {
		return node.nodeName === 'A' && !node.textContent.trim();
	},
	replacement: function (content, node) {
		return [
			'[',
			node.getAttribute('title') || '\\[\\_\\_\\_\\_\\_\\]',
			'](',
			node.getAttribute('href'),
			')',
			].join('');
	},
});
var showdownPackage = require('showdown');
showdownPackage = new showdownPackage.Converter();
showdownPackage.setOption('noHeaderId', true);

const stringContentForFirstElement = function (inputData) {
	return inputData[0] ? inputData[0].textContent : '';
}

//_ WKCDiffArticlesForFeedRSS

exports.WKCDiffArticlesForFeedRSS = function(oldString, newString) {
	var parsedXML = (new (new JSDOM('')).window.DOMParser()).parseFromString(oldString, 'application/xml');

	var oldIDs = (!oldString ? [] : [].slice.call(parsedXML.getElementsByTagName('channel')[0].getElementsByTagName('item'))).map(function (e) {
		return stringContentForFirstElement(e.getElementsByTagName('guid'));
	});

	const channelElement = (new (new JSDOM('')).window.DOMParser()).parseFromString(newString, 'application/xml').getElementsByTagName('channel')[0];

	if (!channelElement) {
		return [];
	}

	var newItems = [].slice.call(channelElement.getElementsByTagName('item'));

	return newItems.filter(function(e) {
		return oldIDs.indexOf(stringContentForFirstElement(e.getElementsByTagName('guid'))) === -1;
	}).map(function(e) {
		var itemContent = (stringContentForFirstElement(e.getElementsByTagName('content:encoded')) || stringContentForFirstElement(e.getElementsByTagName('description')) || '').trim();

		return {
			WKCArticleTitle: stringContentForFirstElement(e.getElementsByTagName('title')),
			WKCArticleOriginalURL: stringContentForFirstElement(e.getElementsByTagName('link')),
			WKCArticleOriginalGUID: stringContentForFirstElement(e.getElementsByTagName('guid')),
			WKCArticlePublishDate: new Date(stringContentForFirstElement(e.getElementsByTagName('pubDate'))),
			WKCArticleAuthor: stringContentForFirstElement(e.getElementsByTagName('author')),
			WKCArticleBody: itemContent,
			WKCArticleSnippet: exports.WKCSnippetFromText(JSDOM.fragment(itemContent).textContent),
		};
	});
};

//_ WKCDiffArticlesForFeedAtom

exports.WKCDiffArticlesForFeedAtom = function(oldString, newString) {
	var parsedXML = (new (new JSDOM('')).window.DOMParser()).parseFromString(oldString, 'application/xml');

	var oldIDs = (!oldString ? [] : [].slice.call(parsedXML.getElementsByTagName('entry'))).map(function (e) {
		return stringContentForFirstElement(e.getElementsByTagName('id'));
	});

	var newItems = [].slice.call((new (new JSDOM('')).window.DOMParser()).parseFromString(newString, 'application/xml').getElementsByTagName('entry'));

	return newItems.filter(function(e) {
		return oldIDs.indexOf(stringContentForFirstElement(e.getElementsByTagName('id'))) === -1;
	}).map(function(e) {
		var itemContent = (e.getElementsByTagName('content')[0] || e.getElementsByTagName('summary')[0]).innerHTML;

		return {
			WKCArticleTitle: stringContentForFirstElement(e.getElementsByTagName('title')),
			WKCArticleOriginalURL: [].slice.call(e.getElementsByTagName('link')).filter(function (e) {
				return !e.getAttribute('rel');
			}).map(function (e) {
				return e.getAttribute('href');
			}).pop(),
			WKCArticleOriginalGUID: stringContentForFirstElement(e.getElementsByTagName('id')),
			WKCArticlePublishDate: new Date(stringContentForFirstElement(e.getElementsByTagName('updated'))),
			WKCArticleAuthor: stringContentForFirstElement(e.getElementsByTagName('author')),
			WKCArticleBody: itemContent,
			WKCArticleSnippet: exports.WKCSnippetFromText(JSDOM.fragment(itemContent).textContent),
		};
	});
};

//_ _WKCDiffArticleBodyForStrings

exports._WKCDiffArticleBodyForStrings = function(oldString, newString) {
	if (typeof newString !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	var lineDiffs = diffPackage.diffLines(oldString || '', newString);

	var truncateCallback = function(e, index, collection, ignoreFlag) {
		const defaultValue = ignoreFlag ? '' : e.value;

		if (e.added || e.removed) {
			return defaultValue;
		}

		if (e.value.split('\n').length <= 4) {
			return defaultValue;
		}

		if (!index) {
			return ['…'].concat(e.value.split('\n').slice(-4)).join('\n');
		}

		if (index === (collection.length - 1)) {
			return e.value.split('\n').slice(0, 3).concat(['…']).join('\n').concat('\n');
		}

		if (e.value.split('\n').length <= 7) {
			return defaultValue;
		}

		return e.value.split('\n').slice(0, 3).concat(['…']).concat(e.value.split('\n').slice(-4)).join('\n');
	};

	return diffPackage.diffChars(lineDiffs.map(function(e, index, collection) {
		return truncateCallback(e, index, collection, e.added);
	}).join(''), lineDiffs.map(function(e, index, collection) {
		return truncateCallback(e, index, collection, e.removed);
	}).join('')).map(function(e) {
		if (e.added === true) {
			return [
				'<ins>',
				e.value,
				'</ins>',
			].join('');
		}

		if (e.removed === true) {
			return [
				'<del>',
				e.value,
				'</del>',
			].join('');
		}

		return e.value;
	}).join('');
};

//_ WKCDiffArticlesForFile

exports.WKCDiffArticlesForFile = function(oldString, newString) {
	if (typeof newString !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	if (oldString === newString) {
		return [];
	}

	return [{
		WKCArticleBody: exports._WKCDiffArticleBodyForStrings(htmlEntitiesInstance.encode(oldString), htmlEntitiesInstance.encode(newString)).replace(/\n/g, '<br>'),
		WKCArticlePublishDate: new Date(),
	}];
};

//_ WKCDiffArticlesForPage

exports.WKCDiffArticlesForPage = function(oldString, newString) {
	if (typeof newString !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	oldString = turndownInstance.turndown((new JSDOM(oldString || '')).window.document.body.innerHTML);
	newString = turndownInstance.turndown((new JSDOM(newString)).window.document.body.innerHTML);

	if (oldString === newString) {
		return [];
	}

	return [{
		WKCArticleBody: showdownPackage.makeHtml(exports._WKCDiffArticleBodyForStrings(oldString, newString)),
		WKCArticlePublishDate: new Date(),
	}];
};

//_ WKCSnippetFromText

exports.WKCSnippetFromText = function(inputData) {
	if (typeof inputData !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	return inputData.length <= 100 ? inputData : inputData.slice(0, 100).split(' ').slice(0, -1).join(' ').concat('…');
};
