const mod = {

	uStubLineTokensFor (inputData) {
		let defaultType = inputData.trim()[0] === '#' ? 'header header-1' : 'variable-2';
		
		return inputData.split(' ').map(function (e1, index1) {
			return e1.split('').map(function (e2, index2) {
				return {
					string: e2,
					type: e1.match(/(http|\[\[)/) ? `${ defaultType } link` : defaultType,
				};
			});
		}).reduce(function (coll, e) {
			return coll.concat(coll.length ? [{
				string: ' ',
				type: defaultType,
			}] : []).concat(e);
		}, []).map(function (e, index) {
			return Object.assign(e, {
				start: index,
				end: index + 1,
			});
		});
	},

	WKCWriteEditorLineObjectsFor (inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('WKCErrorInputNotValid');
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
	},

	WKCWriteEditorHeaderTokensFrom (inputData) {
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
	},

};

Object.assign(exports, mod);