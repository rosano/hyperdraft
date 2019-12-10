export const KVCVersionModelErrorsFor = function(inputData, options = {}) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('KVCErrorInputNotValid');
	}

	let errors = {};

	if (typeof inputData.KVCVersionID !== 'string') {
		errors.KVCVersionID = [
			'KVCErrorNotString',
		];
	} else if (inputData.KVCVersionID.trim() === '') {
		errors.KVCVersionID = [
			'KVCErrorNotFilled',
		];
	}

	if (typeof inputData.KVCVersionNoteID !== 'string') {
		errors.KVCVersionNoteID = [
			'KVCErrorNotString',
		];
	} else if (inputData.KVCVersionNoteID.trim() === '') {
		errors.KVCVersionNoteID = [
			'KVCErrorNotFilled',
		];
	}

	if (typeof inputData.KVCVersionBody !== 'string') {
		errors.KVCVersionBody = [
			'KVCErrorNotString',
		];
	}

	if (!(inputData.KVCVersionDate instanceof Date) || Number.isNaN(inputData.KVCVersionDate.getTime())) {
		errors.KVCVersionDate = [
			'KVCErrorNotDate',
		];
	}

	return Object.entries(errors).length ? errors : null;
};

export const KVCVersionModelPreJSONSchemaValidate = function(inputData) {
	if (inputData.KVCVersionDate) {
		inputData.KVCVersionDate = inputData.KVCVersionDate.toISOString();
	}

	return inputData;
};

export const KVCVersionModelPostJSONParse = function(inputData) {
	if (!inputData) {
		return inputData;
	}

	if (inputData.KVCVersionDate) {
		inputData.KVCVersionDate = new Date(inputData.KVCVersionDate);
	}

	return inputData;
};
