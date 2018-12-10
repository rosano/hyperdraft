/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var parserPackage = require('fast-xml-parser');

//_ WKCDiffArticlesForFeed

exports.WKCDiffArticlesForFeed = function(oldContent, newContent) {
	var oldIDs = (!oldContent ? [] : parserPackage.parse(oldContent).rss.channel.item).map(function(e) {
		return e.guid;
	});
	var newItems = parserPackage.parse(newContent);

	if (!(newItems = newItems.rss)) {
		return [];
	}

	if (!(newItems = newItems.channel)) {
		return [];
	}

	if (!(newItems = newItems.item)) {
		return [];
	}

	if (!Array.isArray(newItems)) {
		return [];
	}

	return newItems.filter(function(e) {
		return oldIDs.indexOf(e.guid) === -1;
	}).map(function(e) {
		return {
			WKCArticleTitle: e.title,
		};
	});
};
