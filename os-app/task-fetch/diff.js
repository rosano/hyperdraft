/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const WKCDiff = require('../_shared/WKCDiff/main.js');

var jsdomPackage = require('jsdom');
const { JSDOM } = jsdomPackage;
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
		WKCArticleBody: WKCDiff._WKCDiffConvertDiffTagsToHTML(showdownPackage.makeHtml(WKCDiff.WKCDiffHTMLForStrings(oldString, newString))),
		WKCArticlePublishDate: new Date(),
	}];
};
