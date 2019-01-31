/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ WKCNotesModelErrorsFor

exports.WKCNotesModelErrorsFor = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInvalidInput');
	}

	var errors = {};

	if (typeof inputData.WKCNoteBody !== 'string') {
		errors.WKCNoteBody = [
			'WKCErrorNotString',
		];
	}

	return Object.entries(errors).length ? errors : null;
};

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

//_ WKCModelInputDataIsNotePublishStatusObject

exports.WKCModelInputDataIsNotePublishStatusObject = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return false;
	}

	var errors = {};

	if (typeof inputData.WKCNotePublishStatusIsPublished !== 'boolean') {
		errors.WKCNotePublishStatusIsPublished = [
			'WKCErrorNotBoolean',
		];
	}

	if (Object.keys(errors).length) {
		inputData.WKCErrors = errors;

		return false;
	}

	return true;
};

//_ WKCModelNotesHiddenPropertyNames

exports.WKCModelNotesHiddenPropertyNames = function() {
	return [
		'_id',
	];
};

//_ WKCModelNotesPublicPropertyNames

exports.WKCModelNotesPublicPropertyNames = function() {
	return [
		'WKCNotePublicID',
		'WKCNoteDateCreated',
		'WKCNoteDateUpdated',
		'WKCNoteBody',
	];
};
