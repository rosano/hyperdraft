const mod = {

	KVCWriteFilterFunction (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return function (e) {
			// Searching and sorting text with diacritical marks in JavaScript | Thread Engineering https://thread.engineering/2018-08-29-searching-and-sorting-text-with-diacritical-marks-in-javascript/
			return !!e.KVCNoteBody.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(inputData.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''));
		};
	},

	KVCWriteLogicListSort (a, b) {
		if (b.KVCNoteModificationDate && a.KVCNoteModificationDate) {
			return b.KVCNoteModificationDate - a.KVCNoteModificationDate;
		}

		return b.KVCNoteCreationDate - a.KVCNoteCreationDate;
	},

};

Object.assign(exports, mod);
