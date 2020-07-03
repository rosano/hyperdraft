const mod = {

	KVCNoteModelErrorsFor (inputData, options = {}) {
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

		if (typeof inputData.KVCNoteIsPublic !== 'undefined') {
			if (typeof inputData.KVCNoteIsPublic !== 'boolean') {
				errors.KVCNoteIsPublic = [
					'KVCErrorNotBoolean',
				];
			}
		}

		return Object.entries(errors).length ? errors : null;
	},

};

export default mod;
