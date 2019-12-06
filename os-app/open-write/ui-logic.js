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

export const WKCWriteHeaderTokensFrom = function (inputData) {
	if (!Array.isArray(inputData)) {
		throw new Error('WKCErrorInputNotValid');
	}

	return [].concat.apply([], inputData.map(function (e, i) {
		let validTokens = e.filter(function (e) {
			return e.type && e.type.match('header') && e.string.match(/\w/);
		});

		if (!validTokens.length) {
			return [];
		}

		return validTokens.reduce(function (coll, e) {
			if (typeof coll.start === 'undefined') {
				coll.start = e.start;
			}
			
			if (typeof coll.type === 'undefined') {
				coll.type = e.type;
			}
			
			coll.string = (coll.string || '').concat(e.string);
			coll.end = e.end;

			return coll;
		}, {
			line: i,
		});
	}));
};
