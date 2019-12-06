const { throws, deepEqual } = require('assert');

const mainModule = require('./ui-logic.js');
const WKCEditorLogic = require('../open-next/submodules/WKCEditor/ui-logic.js');

const kTesting = {
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
};

describe('WIKWriteTruncatedTitleFor', function testWIKWriteTruncatedTitleFor() {

	it('throws error if not string', function() {
		throws(function() {
			mainModule.WIKWriteTruncatedTitleFor(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns input', function() {
		deepEqual(mainModule.WIKWriteTruncatedTitleFor('alfa'), 'alfa');
	});

	it('includes if under 60 characters', function() {
		deepEqual(mainModule.WIKWriteTruncatedTitleFor('alfa bravo charlie delta echo foxtrot golf hotel juliet kilo'), 'alfa bravo charlie delta echo foxtrot golf hotel juliet kilo');
	});

	it('truncates text', function() {
		deepEqual(mainModule.WIKWriteTruncatedTitleFor('alfa bravo charlie delta echo foxtrot golf hotel juliet kilos'), 'alfa bravo charlie delta echo foxtrot golf hotel juliet');
	});

	it('adds ellipsis if second parameter truthy', function() {
		deepEqual(mainModule.WIKWriteTruncatedTitleFor('alfa bravo charlie delta echo foxtrot golf hotel juliet kilos', true), 'alfa bravo charlie delta echo foxtrot golf hotel juliet…');
	});

});

describe('WKCWriteLogicListSort', function testWKCWriteLogicListSort() {

	it('sorts by WKCNoteModificationDate descending', function() {
		var item1 = {
			WKCNoteModificationDate: new Date(0),
		};
		var item2 = {
			WKCNoteModificationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mainModule.WKCWriteLogicListSort), [item2, item1]);
	});

	it('sorts by WKCNoteCreationDate descending if no WKCNoteModificationDate', function() {
		var item1 = {
			WKCNoteCreationDate: new Date(0),
		};
		var item2 = {
			WKCNoteCreationDate: new Date(1),
		};

		deepEqual([item1, item2].sort(mainModule.WKCWriteLogicListSort), [item2, item1]);
	});

});

describe('WKCWriteHeaderTokensFrom', function testWKCWriteHeaderTokensFrom() {

	it('throws error if not array', function() {
		throws(function() {
			mainModule.WKCWriteHeaderTokensFrom(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mainModule.WKCWriteHeaderTokensFrom([]), []);
	});

	it('excludes if not header', function() {
		deepEqual(mainModule.WKCWriteHeaderTokensFrom([
			WKCEditorLogic.WKCEditorLineObjectsFor(kTesting.uStubLineTokensFor('alfa')),
			WKCEditorLogic.WKCEditorLineObjectsFor(kTesting.uStubLineTokensFor('[[bravo]]')),
		]), []);
	});

	it('includes if header', function() {
		deepEqual(mainModule.WKCWriteHeaderTokensFrom([
			WKCEditorLogic.WKCEditorLineObjectsFor(kTesting.uStubLineTokensFor('# alfa')),
		]), WKCEditorLogic.WKCEditorLineObjectsFor(kTesting.uStubLineTokensFor('# alfa')).map(function (e) {
			return Object.assign(e, {
				line: 0,
			});
		}));
	});

	it('excludes if not verbal', function() {
		deepEqual(mainModule.WKCWriteHeaderTokensFrom([
			WKCEditorLogic.WKCEditorLineObjectsFor(kTesting.uStubLineTokensFor('alfa')),
			WKCEditorLogic.WKCEditorLineObjectsFor(kTesting.uStubLineTokensFor('====')),
		].map(function (e) {
			return e.map(function (e) {
				return Object.assign(e, {
					type: 'header header-1',
				});
			});
		})), [{
			start: 0,
			end: 4,
			string: 'alfa',
			type: 'header header-1',
			line: 0,
		}]);
	});

	it('merges multiple header objects', function() {
		deepEqual(mainModule.WKCWriteHeaderTokensFrom([
			WKCEditorLogic.WKCEditorLineObjectsFor(kTesting.uStubLineTokensFor('# PA PARC https://www.supermarchepa.com/pages/weekly-flyer')),
		]), [{
			start: 0,
			end: 58,
			string: '# PA PARC https://www.supermarchepa.com/pages/weekly-flyer',
			type: 'header header-1',
			line: 0,
		}]);
	});

});
