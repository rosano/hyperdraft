export const KVCNoteModelErrorsFor = function(inputData, options = {}) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('KVCErrorInputNotValid');
	}

	let errors = {};

	if (typeof inputData.KVCNoteID !== 'string') {
		errors.KVCNoteID = [
			'KVCErrorNotString',
		];
	} else if (inputData.KVCNoteID.trim() === '') {
		errors.KVCNoteID = [
			'KVCErrorNotFilled',
		];
	}

	if (typeof inputData.KVCNoteBody !== 'string') {
		errors.KVCNoteBody = [
			'KVCErrorNotString',
		];
	}

	if (!(inputData.KVCNoteCreationDate instanceof Date) || Number.isNaN(inputData.KVCNoteCreationDate.getTime())) {
		errors.KVCNoteCreationDate = [
			'KVCErrorNotDate',
		];
	}

	if (!(inputData.KVCNoteModificationDate instanceof Date) || Number.isNaN(inputData.KVCNoteModificationDate.getTime())) {
		errors.KVCNoteModificationDate = [
			'KVCErrorNotDate',
		];
	}

	if (typeof inputData.KVCNotePublishStatusIsPublished !== 'undefined') {
		if (typeof inputData.KVCNotePublishStatusIsPublished !== 'boolean') {
			errors.KVCNotePublishStatusIsPublished = [
				'KVCErrorNotBoolean',
			];
		}
	}

	return Object.entries(errors).length ? errors : null;
};

export const KVCNoteModelPreJSONSchemaValidate = function(inputData) {
	if (inputData.KVCNoteCreationDate) {
		inputData.KVCNoteCreationDate = inputData.KVCNoteCreationDate.toISOString();
	}

	if (inputData.KVCNoteModificationDate) {
		inputData.KVCNoteModificationDate = inputData.KVCNoteModificationDate.toISOString();
	}

	return inputData;
};

export const KVCNoteModelPostJSONParse = function(inputData) {
	if (!inputData) {
		return inputData;
	}

	if (inputData.KVCNoteCreationDate) {
		inputData.KVCNoteCreationDate = new Date(inputData.KVCNoteCreationDate);
	}

	if (inputData.KVCNoteModificationDate) {
		inputData.KVCNoteModificationDate = new Date(inputData.KVCNoteModificationDate);
	}

	return inputData;
};
