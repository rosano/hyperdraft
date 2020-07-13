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
		if (a.KVCNoteIsArchived !== b.KVCNoteIsArchived) {
			return a.KVCNoteIsArchived ? 1 : -1;
		}

		if (b.KVCNoteModificationDate && a.KVCNoteModificationDate) {
			return b.KVCNoteModificationDate - a.KVCNoteModificationDate;
		}

		return b.KVCNoteCreationDate - a.KVCNoteCreationDate;
	},

	KVCWriteHumanTimestampString (inputData) {
		if (!(inputData instanceof Date) || Number.isNaN(inputData.getTime())) {
			throw new Error('KVCErrorInputNotValid');
		}

		return inputData.toJSON().slice(0, 16);
	},

	KVCWriteLauncherItemJournalTemplate (param1, param2) {
		if (!(param1 instanceof Date) || Number.isNaN(param1.getTime())) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof param2 !== 'function') {
			throw new Error('KVCErrorInputNotValid');
		}

		return param2('KVCWriteLauncherItemJournalText').toLowerCase() + '-' + mod.KVCWriteHumanTimestampString(param1) + '\n\n- ';
	},

	KVCWriteCustomDomainBaseURLData (inputData) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		if (!inputData.match(/https?\:\/\//)) {
			inputData = 'https://' + inputData;
		};

		try {
			const item = new URL('', inputData);
			return item.protocol + '//' + item.hostname + '/';
		} catch (err) {
			return null;
		}
	},

	KVCWriteCustomDomainBaseURLFunction (param1, param2, param3, param4) {
		if (typeof param1 !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof param2 !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		return function (url, domain) {
			if (typeof url !== 'string') {
				throw new Error('KVCErrorInputNotValid');
			}

			if (typeof domain !== 'string') {
				throw new Error('KVCErrorInputNotValid');
			}

			return url.replace(param1.replace(param2, ''), domain);
		};
	},

};

Object.assign(exports, mod);
