export const WKCDocumentModelErrorsFor = function(inputData, options = {}) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInputNotValid');
	}

	let errors = {};

	if (typeof inputData.WKCDocumentID !== 'string') {
		errors.WKCDocumentID = [
			'WKCErrorNotString',
		];
	} else if (inputData.WKCDocumentID.trim() === '') {
		errors.WKCDocumentID = [
			'WKCErrorNotFilled',
		];
	}

	if (typeof inputData.WKCDocumentBody !== 'string') {
		errors.WKCDocumentBody = [
			'WKCErrorNotString',
		];
	}

	if (!(inputData.WKCDocumentCreationDate instanceof Date) || Number.isNaN(inputData.WKCDocumentCreationDate.getTime())) {
		errors.WKCDocumentCreationDate = [
			'WKCErrorNotDate',
		];
	}

	if (!(inputData.WKCDocumentModificationDate instanceof Date) || Number.isNaN(inputData.WKCDocumentModificationDate.getTime())) {
		errors.WKCDocumentModificationDate = [
			'WKCErrorNotDate',
		];
	}

	if (typeof inputData.WKCDocumentPublishStatusIsPublished !== 'undefined') {
		if (typeof inputData.WKCDocumentPublishStatusIsPublished !== 'boolean') {
			errors.WKCDocumentPublishStatusIsPublished = [
				'WKCErrorNotBoolean',
			];
		}
	}

	return Object.entries(errors).length ? errors : null;
};

export const WKCDocumentModelPreJSONSchemaValidate = function(inputData) {
	if (inputData.WKCDocumentCreationDate) {
		inputData.WKCDocumentCreationDate = inputData.WKCDocumentCreationDate.toISOString();
	}

	if (inputData.WKCDocumentModificationDate) {
		inputData.WKCDocumentModificationDate = inputData.WKCDocumentModificationDate.toISOString();
	}

	return inputData;
};

export const WKCDocumentModelPostJSONParse = function(inputData) {
	if (!inputData) {
		return inputData;
	}

	if (inputData.WKCDocumentCreationDate) {
		inputData.WKCDocumentCreationDate = new Date(inputData.WKCDocumentCreationDate);
	}

	if (inputData.WKCDocumentModificationDate) {
		inputData.WKCDocumentModificationDate = new Date(inputData.WKCDocumentModificationDate);
	}

	return inputData;
};
