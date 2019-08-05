export const WKCWriteLogicListSort = function (a, b) {
	if (b.WKCNoteModificationDate && a.WKCNoteModificationDate) {
		return b.WKCNoteModificationDate - a.WKCNoteModificationDate;
	}

	return b.WKCNoteCreationDate - a.WKCNoteCreationDate;
};

export const WKCWriteLineObjectsFor = function (inputData) {
	if (!Array.isArray(inputData)) {
		throw new Error('WKCErrorInputInvalid');
	}

	return Object.values(inputData.reduce(function (coll, e) {
		let key = (Object.keys(coll).pop() || -1);

		if (!coll[key] || (coll[key].type !== e.type)) {
			key += 1;

			coll[key] = {
				start: e.start,
				type: e.type,
			};
		}

		coll[key].end = e.end;
		coll[key].string = (coll[key].string || '').concat(e.string);

		return coll;
	}, {}));
};

export const WKCWriteHeaderTokensFrom = function (inputData) {
	if (!Array.isArray(inputData)) {
		throw new Error('WKCErrorInputInvalid');
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
	}))
};
