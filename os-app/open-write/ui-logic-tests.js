const { throws, deepEqual } = require('assert');

const mod = require('./ui-logic.js').default;

const uLocalized = function (inputData) {
	return inputData + '-LOCALIZED';
};

describe('KVCWriteAccessibilitySummary', function test_KVCWriteAccessibilitySummary() {

	it('throws if not valid', function () {
		throws(function () {
			mod.KVCWriteAccessibilitySummary({});
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = Math.random().toString();
		deepEqual(mod.KVCWriteAccessibilitySummary(StubNoteObjectValid({
			KVCNoteBody: item + '\n' + Math.random().toString(),
		})), item);
	});

	it('truncates long string', function() {
		const item = Array.from(Array(100)).map(Math.random).join(' ');
		deepEqual(mod.KVCWriteAccessibilitySummary(StubNoteObjectValid({
			KVCNoteBody: item,
		})), require('OLSKString').OLSKStringSnippet(item));
	});

});

describe('KVCWriteSortFunction', function test_KVCWriteSortFunction() {

	it('sorts by KVCNoteModificationDate descending', function() {
		const item1 = {
			KVCNoteModificationDate: new Date(0),
		};
		const item2 = {
			KVCNoteModificationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mod.KVCWriteSortFunction), [item2, item1]);
	});

	it('sorts by KVCNoteCreationDate descending', function() {
		const item1 = {
			KVCNoteCreationDate: new Date(0),
		};
		const item2 = {
			KVCNoteCreationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mod.KVCWriteSortFunction), [item2, item1]);
	});

	it('sorts KVCNoteIsArchived below others', function() {
		const item1 = {
			KVCNoteCreationDate: new Date(0),
			KVCNoteIsArchived: true,
		};
		const item2 = {
			KVCNoteCreationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mod.KVCWriteSortFunction), [item2, item1]);
	});

});

describe('KVCWritePublicSymbol', function test_KVCWritePublicSymbol() {

	it('returns string', function() {
		deepEqual(mod.KVCWritePublicSymbol(), 'ᗕ');
	});

});

describe('KVCWriteIsMatch', function test_KVCWriteIsMatch() {

	it('throws error param2 if not string', function() {
		throws(function() {
			mod.KVCWriteIsMatch({}, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns false if no match', function() {
		deepEqual(mod.KVCWriteIsMatch({
			KVCNoteBody: 'alfa',
		}, 'bravo'), false);
	});

	it('matches OLSKStringMatch', function() {
		deepEqual(mod.KVCWriteIsMatch({
			KVCNoteBody: uRandomElement('alfa', 'álfa'),
		}, uRandomElement('alf', 'alfa', 'ALF')), true);
	});

	context('KVCWritePublicSymbol', function () {
		
		it('matches whole string', function() {
			deepEqual(mod.KVCWriteIsMatch({
				KVCNoteBody: Math.random().toString(),
				KVCNoteIsPublic: true,
			}, mod.KVCWritePublicSymbol()), true);
		});

		it('returns false if no match', function() {
			deepEqual(mod.KVCWriteIsMatch({
				KVCNoteBody: Math.random().toString(),
				KVCNoteIsPublic: true,
			}, mod.KVCWritePublicSymbol() + Math.random().toString()), false);
		});

		it('matches non symbol', function() {
			const KVCNoteBody = Math.random().toString();
			deepEqual(mod.KVCWriteIsMatch({
				KVCNoteBody,
				KVCNoteIsPublic: true,
			}, mod.KVCWritePublicSymbol() + KVCNoteBody), true);
		});

		it('matches non symbol with space', function() {
			const KVCNoteBody = Math.random().toString();
			deepEqual(mod.KVCWriteIsMatch({
				KVCNoteBody,
				KVCNoteIsPublic: true,
			}, mod.KVCWritePublicSymbol() + ' ' +KVCNoteBody), true);
		});
	
	});

});

describe('KVCWriteExactSortFunction', function test_KVCWriteExactSortFunction() {

	it('throws if param1 not string', function () {
		throws(function () {
			mod.KVCWriteExactSortFunction(null, Math.random().toString(), Math.random().toString());
		}, /KVCErrorInputNotValid/);
	});

	it('bumps exact', function() {
		const item = Math.random().toString();
		deepEqual(mod.KVCWriteExactSortFunction(item, {
			KVCNoteBody: item + Math.random().toString(),
		}, {
			KVCNoteBody: item,
		}), 1);
	});

	it('bumps startsWith', function() {
		const item = Math.random().toString();
		deepEqual(mod.KVCWriteExactSortFunction(item, {
			KVCNoteBody: Math.random().toString() + item,
		}, {
			KVCNoteBody: item + Math.random().toString(),
		}), 1);
	});

	it('bumps match title', function() {
		const item = Math.random().toString();
		deepEqual(mod.KVCWriteExactSortFunction(item, {
			KVCNoteBody: Math.random().toString() + '\n' + item,
		}, {
			KVCNoteBody: Math.random().toString() + item,
		}), 1);
	});

	it('matches OLSKStringMatch', function() {
		deepEqual(mod.KVCWriteExactSortFunction(uRandomElement('alf', 'alfa', 'ALF'), {
			KVCNoteBody: Math.random().toString(),
		}, {
			KVCNoteBody: uRandomElement('alfa', 'álfa'),
		}), 1);
	});

});

describe('KVCWriteHumanTimestampString', function test_KVCWriteHumanTimestampString() {

	it('throws error if not date', function() {
		throws(function() {
			mod.KVCWriteHumanTimestampString(new Date('alfa'));
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = new Date();
		deepEqual(mod.KVCWriteHumanTimestampString(item), `${ item.toJSON().slice(0, 16) }`);
	});

});

describe('KVCWriteLauncherItemJournalTemplate', function test_KVCWriteLauncherItemJournalTemplate() {

	it('throws error if param1 not date', function() {
		throws(function() {
			mod.KVCWriteHumanTimestampString(new Date('alfa'), function () {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not function', function() {
		throws(function() {
			mod.KVCWriteLauncherItemJournalTemplate(new Date(), null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = new Date();
		deepEqual(mod.KVCWriteLauncherItemJournalTemplate(item, function (inputData) {
			return 'Alfa-' + inputData;
		}), ('Alfa-' + 'KVCWriteLauncherItemJournalText').toLowerCase() + '-' + mod.KVCWriteHumanTimestampString(item) + '\n\n- ');
	});

});

describe('KVCWriteCustomDomainBaseURLData', function test_KVCWriteCustomDomainBaseURLData() {

	it('throws error if not string', function() {
		throws(function() {
			mod.KVCWriteCustomDomainBaseURLData(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns null if no text', function() {
		deepEqual(mod.KVCWriteCustomDomainBaseURLData(''), null);
	});

	it('returns null if no host', function() {
		deepEqual(mod.KVCWriteCustomDomainBaseURLData('https:///'), null);
	});

	it('returns string if host', function() {
		deepEqual(mod.KVCWriteCustomDomainBaseURLData('example.com'), 'https://example.com/');
	});

	it('returns string if URL with host', function() {
		deepEqual(mod.KVCWriteCustomDomainBaseURLData('https://example.com'), 'https://example.com/');
	});

	it('returns string if URL with path', function() {
		deepEqual(mod.KVCWriteCustomDomainBaseURLData('https://example.com/alfa/bravo'), 'https://example.com/');
	});

	it('returns string if URL with https', function() {
		deepEqual(mod.KVCWriteCustomDomainBaseURLData('https://example.com/alfa/bravo'), 'https://example.com/');
	});

});

describe('KVCWriteCustomDomainBaseURLFunction', function test_KVCWriteCustomDomainBaseURLFunction() {

	it('throws error if param1 not string', function() {
		throws(function() {
			mod.KVCWriteCustomDomainBaseURLFunction(null, '');
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not string', function() {
		throws(function() {
			mod.KVCWriteCustomDomainBaseURLFunction('', null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns function', function() {
		deepEqual(typeof mod.KVCWriteCustomDomainBaseURLFunction('', ''), 'function');
	});

	context('function', function () {

		it('throws error if url not string', function() {
			throws(function() {
				mod.KVCWriteCustomDomainBaseURLFunction('', '')(null, '');
			}, /KVCErrorInputNotValid/);
		});

		it('throws error if domain not string', function() {
			throws(function() {
				mod.KVCWriteCustomDomainBaseURLFunction('', '')('', null);
			}, /KVCErrorInputNotValid/);
		});
		
		it('returns string', function() {
			deepEqual(mod.KVCWriteCustomDomainBaseURLFunction('', '')('', ''), '');
		});
		
		it('returns replaces common substring between original params with domain in url', function() {
			deepEqual(mod.KVCWriteCustomDomainBaseURLFunction('alfa-bravo', '-bravo')('alfa-delta', 'echo'), 'echo-delta');
		});
	
	});

});

describe('KVCWriteBacklinksMap', function test_KVCWriteBacklinksMap() {

	it('throws if not array', function () {
		throws(function () {
			mod.KVCWriteBacklinksMap(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object', function() {
		deepEqual(mod.KVCWriteBacklinksMap([]), {});
	});

	it('includes if no links', function() {
		const item = StubNoteObjectValid();
		deepEqual(mod.KVCWriteBacklinksMap([item]), {
			[item.KVCNoteBody]: [],
		});
	});

	it('includes if broken links', function() {
		deepEqual(mod.KVCWriteBacklinksMap([StubNoteObjectValid({
			KVCNoteBody: 'alfa\n[[bravo]]'
		})]), {
			alfa: [],
		});
	});

	it('includes if unresolved links', function() {
		const item1 = StubNoteObjectValid({
			KVCNoteBody: 'alfa\n[[bravo]]'
		});
		const item2 = StubNoteObjectValid({
			KVCNoteBody: 'bravo'
		});
		deepEqual(mod.KVCWriteBacklinksMap([item1, item2]), {
			alfa: [],
			bravo: [item1],
		});
	});

	it('includes if resolved links', function() {
		const item1 = StubNoteObjectValid({
			KVCNoteBody: 'alfa\n[[bravo]]'
		});
		const item2 = StubNoteObjectValid({
			KVCNoteBody: 'bravo\n[[alfa]]'
		});
		deepEqual(mod.KVCWriteBacklinksMap([item1, item2]), {
			alfa: [item2],
			bravo: [item1],
		});
	});

});

describe('KVCWriteLauncherItemBacklinksTemplate', function test_KVCWriteLauncherItemBacklinksTemplate() {

	it('throws error if param1 not date', function() {
		throws(function() {
			mod.KVCWriteHumanTimestampString(new Date('alfa'), {}, function () {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not object', function() {
		throws(function() {
			mod.KVCWriteLauncherItemBacklinksTemplate(new Date(), null, function () {});
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param3 not function', function() {
		throws(function() {
			mod.KVCWriteLauncherItemBacklinksTemplate(new Date(), {}, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = new Date();
		deepEqual(mod.KVCWriteLauncherItemBacklinksTemplate(item, {}, function (inputData) {
			return 'Alfa-' + inputData;
		}), ('Alfa-' + 'KVCWriteLauncherItemBacklinksText').toLowerCase() + '-' + mod.KVCWriteHumanTimestampString(item) + '\n\n');
	});

	it('creates heading for each key', function() {
		deepEqual(mod.KVCWriteLauncherItemBacklinksTemplate(new Date(), {
			alfa: [],
		}, function (inputData) { return inputData }).split('\n\n').slice(1).join('\n\n'), '# [[alfa]]\n');
	});

	it('creates item for each value item', function() {
		deepEqual(mod.KVCWriteLauncherItemBacklinksTemplate(new Date(), {
			alfa: [StubNoteObjectValid({
				KVCNoteBody: 'bravo'
			})],
		}, function (inputData) { return inputData }).split('\n\n').slice(1).join('\n\n'), '# [[alfa]]\n- [[bravo]]');
	});

	it('sorts by length ascending', function() {
		deepEqual(mod.KVCWriteLauncherItemBacklinksTemplate(new Date(), {
			alfa: [StubNoteObjectValid({
				KVCNoteBody: 'bravo',
			}), StubNoteObjectValid({
				KVCNoteBody: 'charlie',
			})],
			bravo: [StubNoteObjectValid({
				KVCNoteBody: 'delta',
			})],
		}, function (inputData) { return inputData }).split('\n\n').slice(1).join('\n\n'), '# [[bravo]]\n- [[delta]]\n\n# [[alfa]]\n- [[bravo]]\n- [[charlie]]');
	});

	it('sorts KVCNoteIsArchived below', function() {
		deepEqual(mod.KVCWriteLauncherItemBacklinksTemplate(new Date(), {
			alfa: [StubNoteObjectValid({
				KVCNoteBody: 'bravo',
				KVCNoteIsArchived: true,
			}), StubNoteObjectValid({
				KVCNoteBody: 'charlie',
			})],
		}, function (inputData) { return inputData }).split('\n\n').slice(1).join('\n\n'), '# [[alfa]]\n- [[charlie]]\n- [[bravo]]');
	});

});

describe('KVCWriteLauncherItemVersionsTemplate', function test_KVCWriteLauncherItemVersionsTemplate() {

	it('throws error if param1 not date', function() {
		throws(function() {
			mod.KVCWriteLauncherItemVersionsTemplate(new Date('alfa'), uLocalized, []);
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not function', function() {
		throws(function() {
			mod.KVCWriteLauncherItemVersionsTemplate(new Date(), null, []);
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param3 not array', function() {
		throws(function() {
			mod.KVCWriteLauncherItemVersionsTemplate(new Date(), uLocalized, null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns string', function() {
		const item = new Date();
		deepEqual(mod.KVCWriteLauncherItemVersionsTemplate(item, uLocalized, []), uLocalized('KVCWriteVersionsWord') + '-' + mod.KVCWriteHumanTimestampString(item));
	});

	it('shows param3 if present', function() {
		const item = new Date();
		const items = Array.from(Array(Math.max(1, Date.now() % 10))).map(function () {
			return StubNoteObjectValid();
		});
		deepEqual(mod.KVCWriteLauncherItemVersionsTemplate(item, uLocalized, items), uLocalized('KVCWriteVersionsWord') + '-' + mod.KVCWriteHumanTimestampString(item) + items.map(function (e) {
				return '\n\n# ' + e.KVCNoteModificationDate.toLocaleString() + '\n```\n' + e.KVCNoteBody + '\n```';
			}).join(''));
	});

});

describe('KVCWriteFileNoteObject', function test_KVCWriteFileNoteObject() {

	const uFile = function (inputData) {
		return Object.assign({
			_LCHReadTextFileObjectContent: Math.random().toString(),
			lastModified: Date.now(),
			name: Math.random().toString(),
			size: parseInt(Math.random() * 1000),
		}, inputData);
	};

	it('throws error if not File', function() {
		throws(function() {
			mod.KVCWriteFileNoteObject(uFile({
				lastModified: null,
			}));
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if no _LCHReadTextFileObjectContent', function() {
		throws(function() {
			mod.KVCWriteFileNoteObject(uFile({
				_LCHReadTextFileObjectContent: null,
			}));
		}, /KVCErrorInputNotValid/);
	});

	it('throws error if param2 not boolean', function() {
		throws(function() {
			mod.KVCWriteFileNoteObject(uFile(), null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object', function() {
		const item = uFile();
		deepEqual(mod.KVCWriteFileNoteObject(item), {
			KVCNoteBody: item._LCHReadTextFileObjectContent,
			KVCNoteCreationDate: new Date(item.lastModified),
			KVCNoteModificationDate: new Date(item.lastModified),
		});
	});

	context('param2', function () {

		it('extracts filename to KVCNoteBody', function() {
			const filename = Math.random().toString();
			const _LCHReadTextFileObjectContent = Math.random().toString();
			deepEqual(mod.KVCWriteFileNoteObject(uFile({
				_LCHReadTextFileObjectContent,
				name: filename + '.' + Date.now().toString(),
			}), true).KVCNoteBody, filename + '\n\n' + _LCHReadTextFileObjectContent);
		});
	
	});

});

describe('KVCWriteLauncherItemPublishAll', function test_KVCWriteLauncherItemPublishAll() {

	const _KVCWriteLauncherItemPublishAll = function (inputData = {}) {
		return mod.KVCWriteLauncherItemPublishAll(Object.assign({
			OLSKLocalized: uLocalized,
			ParamConnected: true,
			ParamMod: Object.assign({
				ControlNotePublish: (function () {}),
				_OLSKCatalog: {
					modPublic: Object.assign({
						_OLSKCatalogDataItemsAll: (function () {
							return [];
						}),
					}, inputData),
				},
			}, inputData),
		}, inputData));
	}

	it('throws if not object', function () {
		throws(function () {
			mod.KVCWriteLauncherItemPublishAll(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if OLSKLocalized not function', function () {
		throws(function () {
			_KVCWriteLauncherItemPublishAll({
				OLSKLocalized: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if ParamConnected not boolean', function () {
		throws(function () {
			_KVCWriteLauncherItemPublishAll({
				ParamConnected: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('returns object', function () {
		const item = _KVCWriteLauncherItemPublishAll();

		deepEqual(item, {
			LCHRecipeSignature: 'KVCWriteLauncherItemPublishAll',
			LCHRecipeName: uLocalized('KVCWriteLauncherItemPublishAllText'),
			LCHRecipeCallback: item.LCHRecipeCallback,
			LCHRecipeIsExcluded: item.LCHRecipeIsExcluded,
		});
	});

	context('LCHRecipeCallback', function () {

		it('returns undefined', function () {
			deepEqual(_KVCWriteLauncherItemPublishAll().LCHRecipeCallback(), undefined);
		});

		it('calls ParamMod.ControlNotePublish on each item in ParamMod._OLSKCatalog.modPublic._OLSKCatalogDataItemsAll', function () {
			const items = [{
				KVCNotePublicID: Math.random().toString(),
			}];
			deepEqual(uCapture(function (capture) {
				_KVCWriteLauncherItemPublishAll({
					ControlNotePublish: (function () {
						capture([...arguments][0]);
					}),
					_OLSKCatalogDataItemsAll: (function () {
						return items;
					}),
				}).LCHRecipeCallback();
			}), items);
		});

		it('excludes if no KVCNotePublicID', function () {
			deepEqual(uCapture(function (capture) {
				_KVCWriteLauncherItemPublishAll({
					ControlNotePublish: (function () {
						capture([...arguments][0]);
					}),
					_OLSKCatalogDataItemsAll: (function () {
						return [{}];
					}),
				}).LCHRecipeCallback();
			}), []);
		});

		it('excludes if no KVCNoteIsPublic', function () {
			deepEqual(uCapture(function (capture) {
				_KVCWriteLauncherItemPublishAll({
					ControlNotePublish: (function () {
						capture([...arguments][0]);
					}),
					_OLSKCatalogDataItemsAll: (function () {
						return [{
							KVCNotePublicID: Math.random().toString(),
							KVCNoteIsPublic: true,
						}];
					}),
				}).LCHRecipeCallback();
			}), []);
		});

	});

	context('LCHRecipeIsExcluded', function () {

		it('returns true if ParamConnected false', function () {
			deepEqual(_KVCWriteLauncherItemPublishAll({
				ParamConnected: false,
			}).LCHRecipeIsExcluded(), true);
		});

		it('returns false', function () {
			deepEqual(_KVCWriteLauncherItemPublishAll({
				ParamConnected: true,
			}).LCHRecipeIsExcluded(), false);
		});

	});

});

describe('KVCWriteRecipes', function test_KVCWriteRecipes() {

	const _KVCWriteRecipes = function (inputData = {}) {
		return mod.KVCWriteRecipes(Object.assign({
			OLSKLocalized: uLocalized,
			ParamConnected: uRandomElement(true, false),
			ParamMod: {},
			ParamSpecUI: false,
		}, inputData))
	};

	it('throws if not object', function () {
		throws(function () {
			mod.KVCWriteRecipes(null);
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if ParamMod not object', function () {
		throws(function () {
			_KVCWriteRecipes({
				ParamMod: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('throws if ParamSpecUI not boolean', function () {
		throws(function () {
			_KVCWriteRecipes({
				ParamSpecUI: null,
			});
		}, /OLSKErrorInputNotValid/);
	});

	it('returns producton recipes', function () {
		deepEqual(_KVCWriteRecipes().map(function (e) {
			return e.LCHRecipeSignature || e.LCHRecipeName;
		}), Object.keys(mod).filter(function (e) {
			return e.match(/Launcher/) && !e.match(/Fake/) && !e.match(/Template/);
		}));
	});

	context('ParamSpecUI', function () {

		it('returns all recipes if true', function () {
			deepEqual(_KVCWriteRecipes({
				ParamSpecUI: true,
			}).map(function (e) {
				return e.LCHRecipeSignature || e.LCHRecipeName;
			}), Object.keys(mod).filter(function (e) {
				return e.match(/Launcher/) && !e.match(/Template/);
			}));
		});
	
	});

});
