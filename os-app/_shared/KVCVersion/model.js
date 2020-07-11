const mod = {

	KVCVersionModelErrorsFor (inputData, options = {}) {
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
	}

};

export default mod;
