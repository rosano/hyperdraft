export const WKCVersionModelErrorsFor = function(inputData, options = {}) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInputNotValid');
	}

	let errors = {};

	if (typeof inputData.WKCVersionID !== 'string') {
		errors.WKCVersionID = [
			'WKCErrorNotString',
		];
	} else if (inputData.WKCVersionID.trim() === '') {
		errors.WKCVersionID = [
			'WKCErrorNotFilled',
		];
	}

	if (typeof inputData.WKCVersionNoteID !== 'string') {
		errors.WKCVersionNoteID = [
			'WKCErrorNotString',
		];
	} else if (inputData.WKCVersionNoteID.trim() === '') {
		errors.WKCVersionNoteID = [
			'WKCErrorNotFilled',
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
