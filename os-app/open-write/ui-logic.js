export const WIKWriteTruncatedTitleFor = function (inputData, param2) {
	if (typeof inputData !== 'string') {
		throw new Error('WKCErrorInputNotValid');
	}

	const threshold = 60;

	if (inputData.length <= 60) {
		return inputData;
	}

	return inputData.slice(0, 60).split(' ').slice(0, -1).join(' ') + (param2 ? '…' : '');
};

export const WKCWriteLogicListSort = function (a, b) {
	if (b.WKCNoteModificationDate && a.WKCNoteModificationDate) {
		return b.WKCNoteModificationDate - a.WKCNoteModificationDate;
	}

	return b.WKCNoteCreationDate - a.WKCNoteCreationDate;
};
