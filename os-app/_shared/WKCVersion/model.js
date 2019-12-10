export const WKCVersionModelErrorsFor = function(inputData, options = {}) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('KVCErrorInputNotValid');
	}

	let errors = {};

	if (typeof inputData.WKCVersionID !== 'string') {
		errors.WKCVersionID = [
			'KVCErrorNotString',
		];
	} else if (inputData.WKCVersionID.trim() === '') {
		errors.WKCVersionID = [
			'KVCErrorNotFilled',
		];
	}

	if (typeof inputData.WKCVersionNoteID !== 'string') {
		errors.WKCVersionNoteID = [
			'KVCErrorNotString',
		];
	} else if (inputData.WKCVersionNoteID.trim() === '') {
		errors.WKCVersionNoteID = [
			'KVCErrorNotFilled',
		];
	}

	if (typeof inputData.WKCVersionBody !== 'string') {
		errors.WKCVersionBody = [
			'KVCErrorNotString',
		];
	}

	if (!(inputData.WKCVersionDate instanceof Date) || Number.isNaN(inputData.WKCVersionDate.getTime())) {
		errors.WKCVersionDate = [
			'KVCErrorNotDate',
		];
	}

	return Object.entries(errors).length ? errors : null;
};

export const WKCVersionModelPreJSONSchemaValidate = function(inputData) {
	if (inputData.WKCVersionDate) {
		inputData.WKCVersionDate = inputData.WKCVersionDate.toISOString();
	}

	return inputData;
};

export const WKCVersionModelPostJSONParse = function(inputData) {
	if (!inputData) {
		return inputData;
	}

	if (inputData.WKCVersionDate) {
		inputData.WKCVersionDate = new Date(inputData.WKCVersionDate);
	}

	return inputData;
};
