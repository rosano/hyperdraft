import KVCTemplate from '../_shared/KVCTemplate/main.js';

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

	KVCWriteBacklinksMap (inputData) {
		if (!Array.isArray(inputData)) {
			throw new Error('KVCErrorInputNotValid');
		}

		return inputData.reduce(function (coll, item, index, source) {
			const title = KVCTemplate.KVCTemplatePlaintextTitle(item.KVCNoteBody);

			coll[title] = source.filter(function (e) {
				return e.KVCNoteBody.includes(`[[${ title }]]`);
			});
			
			return coll;
		}, {});
	},

	KVCWriteLauncherItemBacklinksTemplate (param1, param2, param3) {
		if (!(param1 instanceof Date) || Number.isNaN(param1.getTime())) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof param2 !== 'object' || param2 === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (typeof param3 !== 'function') {
			throw new Error('KVCErrorInputNotValid');
		}

		return param3('KVCWriteLauncherItemBacklinksText').toLowerCase() + '-' + mod.KVCWriteHumanTimestampString(param1) + '\n\n' + Object.keys(param2).sort(function (a, b) {
			return param2[a].length < param2[b].length ? -1 : 0;
		}).map(function (e) {
			return `# [[${ e }]]\n${ param2[e].slice().sort(function (a, b) {
				if (!a.KVCNoteIsArchived && !!b.KVCNoteIsArchived) {
					return -1;
				}

				if (!!a.KVCNoteIsArchived && !b.KVCNoteIsArchived) {
					return 1;
				}

				return 0;
			}).map(function (e) {
				return `- [[${ KVCTemplate.KVCTemplatePlaintextTitle(e.KVCNoteBody) }]]`;
			}).join('\n') }`;
		}).join('\n\n');
	},

};

export default mod;
