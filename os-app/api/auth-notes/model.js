/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ WKCNotesModelPrepare

exports.WKCNotesModelPrepare = function(inputData) {
	if (inputData.WKCNoteDateCreated) {
		inputData.WKCNoteDateCreated = new Date(inputData.WKCNoteDateCreated);
	}

	if (inputData.WKCNoteDateUpdated) {
		inputData.WKCNoteDateUpdated = new Date(inputData.WKCNoteDateUpdated);
	}

	return inputData;
};

//_ WKCNotesModelErrorsFor

exports.WKCNotesModelErrorsFor = function(inputData, options) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInvalidInput');
	}

	var errors = {};

	if (typeof inputData.WKCNoteBody !== 'string') {
		errors.WKCNoteBody = [
			'WKCErrorNotString',
		];
	}

	if (typeof inputData.WKCNotePublishStatusIsPublished !== 'undefined') {
		if (typeof inputData.WKCNotePublishStatusIsPublished !== 'boolean') {
			errors.WKCNotePublishStatusIsPublished = [
				'WKCErrorNotBoolean',
			];
		}
	}

	if (options && options.WKCOptionValidatePresentOnly) {
		Object.keys(errors).forEach(function(e) {
			if (typeof inputData[e] === 'undefined') {
				delete errors[e];
			}
		});
	}

	return Object.entries(errors).length ? errors : null;
};

//_ WKCNotesModelHiddenPropertyNames

exports.WKCNotesModelHiddenPropertyNames = function() {
	return [
		'_id',
	];
};
