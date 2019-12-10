export const KVCWriteTruncatedTitleFor = function (inputData, param2) {
	if (typeof inputData !== 'string') {
		throw new Error('KVCErrorInputNotValid');
	}

	const threshold = 60;

	if (inputData.length <= 60) {
		return inputData;
	}

	return inputData.slice(0, 60).split(' ').slice(0, -1).join(' ') + (param2 ? '…' : '');
};

export const KVCWriteLogicListSort = function (a, b) {
	if (b.KVCNoteModificationDate && a.KVCNoteModificationDate) {
		return b.KVCNoteModificationDate - a.KVCNoteModificationDate;
	}

	return b.KVCNoteCreationDate - a.KVCNoteCreationDate;
};
