export const WKCNoteModelErrorsFor = function(inputData, options = {}) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInputNotValid');
	}

	let errors = {};

	if (typeof inputData.WKCNoteID !== 'string') {
		errors.WKCNoteID = [
			'WKCErrorNotString',
		];
	} else if (inputData.WKCNoteID.trim() === '') {
		errors.WKCNoteID = [
			'WKCErrorNotFilled',
		];
	}

	if (typeof inputData.WKCNoteBody !== 'string') {
		errors.WKCNoteBody = [
			'WKCErrorNotString',
		];
	}

	if (!(inputData.WKCNoteCreationDate instanceof Date) || Number.isNaN(inputData.WKCNoteCreationDate.getTime())) {
		errors.WKCNoteCreationDate = [
			'WKCErrorNotDate',
		];
	}

	if (!(inputData.WKCNoteModificationDate instanceof Date) || Number.isNaN(inputData.WKCNoteModificationDate.getTime())) {
		errors.WKCNoteModificationDate = [
			'WKCErrorNotDate',
		];
	}

	if (typeof inputData.WKCNotePublishStatusIsPublished !== 'undefined') {
		if (typeof inputData.WKCNotePublishStatusIsPublished !== 'boolean') {
			errors.WKCNotePublishStatusIsPublished = [
				'WKCErrorNotBoolean',
			];
		}
	}

	return Object.entries(errors).length ? errors : null;
};

export const WKCNoteModelPreJSONSchemaValidate = function(inputData) {
	if (inputData.WKCNoteCreationDate) {
		inputData.WKCNoteCreationDate = inputData.WKCNoteCreationDate.toISOString();
	}

	if (inputData.WKCNoteModificationDate) {
		inputData.WKCNoteModificationDate = inputData.WKCNoteModificationDate.toISOString();
	}

	return inputData;
};

export const WKCNoteModelPostJSONParse = function(inputData) {
	if (!inputData) {
		return inputData;
	}

	if (inputData.WKCNoteCreationDate) {
		inputData.WKCNoteCreationDate = new Date(inputData.WKCNoteCreationDate);
	}

	if (inputData.WKCNoteModificationDate) {
		inputData.WKCNoteModificationDate = new Date(inputData.WKCNoteModificationDate);
	}

	return inputData;
};
