export const WKXDocumentModelErrorsFor = function(inputData, options = {}) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInputNotValid');
	}

	let errors = {};

	if (typeof inputData.WKXDocumentID !== 'string') {
		errors.WKXDocumentID = [
			'WKCErrorNotString',
		];
	} else if (inputData.WKXDocumentID.trim() === '') {
		errors.WKXDocumentID = [
			'WKCErrorNotFilled',
		];
	}

	if (typeof inputData.WKXDocumentBody !== 'string') {
		errors.WKXDocumentBody = [
			'WKCErrorNotString',
		];
	}

	if (!(inputData.WKXDocumentCreationDate instanceof Date) || Number.isNaN(inputData.WKXDocumentCreationDate.getTime())) {
		errors.WKXDocumentCreationDate = [
			'WKCErrorNotDate',
		];
	}

	if (!(inputData.WKXDocumentModificationDate instanceof Date) || Number.isNaN(inputData.WKXDocumentModificationDate.getTime())) {
		errors.WKXDocumentModificationDate = [
			'WKCErrorNotDate',
		];
	}

	if (typeof inputData.WKXDocumentPublishStatusIsPublished !== 'undefined') {
		if (typeof inputData.WKXDocumentPublishStatusIsPublished !== 'boolean') {
			errors.WKXDocumentPublishStatusIsPublished = [
				'WKCErrorNotBoolean',
			];
		}
	}

	return Object.entries(errors).length ? errors : null;
};

export const WKXDocumentModelPreJSONSchemaValidate = function(inputData) {
	if (inputData.WKXDocumentCreationDate) {
		inputData.WKXDocumentCreationDate = inputData.WKXDocumentCreationDate.toISOString();
	}

	if (inputData.WKXDocumentModificationDate) {
		inputData.WKXDocumentModificationDate = inputData.WKXDocumentModificationDate.toISOString();
	}

	return inputData;
};

export const WKXDocumentModelPostJSONParse = function(inputData) {
	if (!inputData) {
		return inputData;
	}

	if (inputData.WKXDocumentCreationDate) {
		inputData.WKXDocumentCreationDate = new Date(inputData.WKXDocumentCreationDate);
	}

	if (inputData.WKXDocumentModificationDate) {
		inputData.WKXDocumentModificationDate = new Date(inputData.WKXDocumentModificationDate);
	}

	return inputData;
};
