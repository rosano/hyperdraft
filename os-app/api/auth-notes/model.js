/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ WKCModelInputDataIsNotesObject

exports.WKCModelInputDataIsNotesObject = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return false;
	}

	var errors = {};

	if (typeof inputData.WKCNoteBody !== 'string') {
		errors.WKCNoteBody = [
			'WKCErrorNotString',
		];
	}

	if (Object.keys(errors).length) {
		inputData.WKCErrors = errors;
		
		return false;
	}

	return true;
};

//_ WKCModelNotesUnusedPropertyNames

exports.WKCModelNotesUnusedPropertyNames = function(inputData) {
	return [
		'_id',
	];
};
