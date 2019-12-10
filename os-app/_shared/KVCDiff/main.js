/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

// const diffPackage = require('diff');
const diffPatchMatchPackage = require('diff-match-patch');

//_ _KVCDiffConvertDiffTagsToHTML

exports._KVCDiffConvertDiffTagsToHTML = function(inputData) {
	return inputData.replace(/\{(\/)?KVCDiffInsert\}/g, '<$1ins>').replace(/\{(\/)?KVCDiffDelete\}/g, '<$1del>');
};

//_ KVCDiffHTMLForStrings

exports.KVCDiffHTMLForStrings = function(oldString, newString) {
	if (typeof newString !== 'string') {
		throw new Error('KVCErrorInputNotValid');
	}

	return (new diffPatchMatchPackage()).diff_main(oldString || '', newString).map(function(e) {
		return {
			added: e[0] === 1 ? true : undefined,
			removed: e[0] === -1 ? true : undefined,
			value: e[1],
		};
	}).map(function(e, index, collection) {
		if (e.added) {
			return [
				'{KVCDiffInsert}',
				e.value,
				'{/KVCDiffInsert}',
			].join('');
		}

		if (e.removed) {
			return [
				'{KVCDiffDelete}',
				e.value,
				'{/KVCDiffDelete}',
			].join('');
		}

		if (e.value.split('\n').length <= 4) {
			return e.value;
		}

		if (!index) {
			return ['…'].concat(e.value.split('\n').slice(-4)).join('\n');
		}

		if (index === (collection.length - 1) && e.value.split('\n').length <= 5) {
			return e.value;
		}

		if (index === (collection.length - 1)) {
			return e.value.split('\n').slice(0, 4).concat(['…']).join('\n').concat('\n');
		}

		if (e.value.split('\n').length <= 8) {
			return e.value;
		}

		return e.value.split('\n').slice(0, 4).concat(['…']).concat(e.value.split('\n').slice(-4)).join('\n');

		return e.value;
	}).join('');

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
				'{KVCDiffInsert}',
				e.value,
				'{/KVCDiffInsert}',
			].join('');
		}

		if (e.removed === true) {
			return [
				'{KVCDiffDelete}',
				e.value,
				'{/KVCDiffDelete}',
			].join('');
		}

		return e.value;
	}).join('');
};
