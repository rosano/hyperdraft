/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ WKCVersionsModelErrorsFor

exports.WKCVersionsModelErrorsFor = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInvalidInput');
	}

	var errors = {};

	if (!inputData.WKCVersionNoteID) {
		errors.WKCVersionNoteID = [
			'WKCErrorNotUnempty',
		];
	}

	if (typeof inputData.WKCVersionNoteID !== 'string') {
		errors.WKCVersionNoteID = [
			'WKCErrorNotString',
		];
	}

	if (typeof inputData.WKCVersionBody !== 'string') {
		errors.WKCVersionBody = [
			'WKCErrorNotString',
		];
	}

	if (!(inputData.WKCVersionDate instanceof Date) || Number.isNaN(inputData.WKCVersionDate.getTime())) {
		errors.WKCVersionDate = [
			'WKCErrorNotDate',
		];
	}

	return Object.entries(errors).length ? errors : null;
};

//_ WKCVersionsHiddenPropertyNames

exports.WKCVersionsHiddenPropertyNames = function() {
	return [
		'_id',
	];
};
