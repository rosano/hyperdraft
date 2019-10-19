export const WKXVersionModelErrorsFor = function(inputData, options = {}) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInputNotValid');
	}

	let errors = {};

	if (typeof inputData.WKXVersionID !== 'string') {
		errors.WKXVersionID = [
			'WKCErrorNotString',
		];
	} else if (inputData.WKXVersionID.trim() === '') {
		errors.WKXVersionID = [
			'WKCErrorNotFilled',
		];
	}

	if (typeof inputData.WKXVersionDocumentID !== 'string') {
		errors.WKXVersionDocumentID = [
			'WKCErrorNotString',
		];
	} else if (inputData.WKXVersionDocumentID.trim() === '') {
		errors.WKXVersionDocumentID = [
			'WKCErrorNotFilled',
		];
	}

	if (typeof inputData.WKXVersionBody !== 'string') {
		errors.WKXVersionBody = [
			'WKCErrorNotString',
		];
	}

	if (!(inputData.WKXVersionDate instanceof Date) || Number.isNaN(inputData.WKXVersionDate.getTime())) {
		errors.WKXVersionDate = [
			'WKCErrorNotDate',
		];
	}

	return Object.entries(errors).length ? errors : null;
};

export const WKXVersionModelPreJSONSchemaValidate = function(inputData) {
	if (inputData.WKXVersionDate) {
		inputData.WKXVersionDate = inputData.WKXVersionDate.toISOString();
	}

	return inputData;
};

export const WKXVersionModelPostJSONParse = function(inputData) {
	if (!inputData) {
		return inputData;
	}

	if (inputData.WKXVersionDate) {
		inputData.WKXVersionDate = new Date(inputData.WKXVersionDate);
	}

	return inputData;
};
