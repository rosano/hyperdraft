const mod = {

	KVCWriteFilterFunction (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return function (e) {
			return !!e.KVCNoteBody.toLowerCase().match(inputData.toLowerCase());
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
