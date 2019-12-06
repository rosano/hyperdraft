const { throws, deepEqual } = require('assert');

const mainModule = require('./ui-logic.js');

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

describe('WKCEditorLineObjectsFor', function testWKCEditorLineObjectsFor() {

	it('throws error if not array', function() {
		throws(function() {
			mainModule.WKCEditorLineObjectsFor(null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns array', function() {
		deepEqual(mainModule.WKCEditorLineObjectsFor([]), []);
	});

	it('converts non-link single', function() {
		deepEqual(mainModule.WKCEditorLineObjectsFor(kTesting.uStubLineTokensFor('alfa')), [{
			start: 0,
			end: 4,
			string: 'alfa',
			type: 'variable-2',
		}]);
	});

	it('converts non-link multiple', function() {
		deepEqual(mainModule.WKCEditorLineObjectsFor(kTesting.uStubLineTokensFor('alfa bravo')), [{
			start: 0,
			end: 10,
			string: 'alfa bravo',
			type: 'variable-2',
		}]);
	});

	it('converts link single', function() {
		deepEqual(mainModule.WKCEditorLineObjectsFor(kTesting.uStubLineTokensFor('[[alfa]]')), [{
			start: 0,
			end: 8,
			string: '[[alfa]]',
			type: 'variable-2 link',
		}]);
	});

	it('converts link multiple', function() {
		deepEqual(mainModule.WKCEditorLineObjectsFor(kTesting.uStubLineTokensFor('[[alfa]] [[bravo]]')), [{
			start: 0,
			end: 8,
			string: '[[alfa]]',
			type: 'variable-2 link',
		}, {
			start: 8,
			end: 9,
			string: ' ',
			type: 'variable-2',
		}, {
			start: 9,
			end: 18,
			string: '[[bravo]]',
			type: 'variable-2 link',
		}]);
	});

	it('converts header', function() {
		deepEqual(mainModule.WKCEditorLineObjectsFor(kTesting.uStubLineTokensFor('# alfa')), [{
			start: 0,
			end: 6,
			string: '# alfa',
			type: 'header header-1',
		}]);
	});

	it('converts multiple header objects', function() {
		deepEqual(mainModule.WKCEditorLineObjectsFor(kTesting.uStubLineTokensFor('# alfa [[bravo]]')), [{
			start: 0,
			end: 7,
			string: '# alfa ',
			type: 'header header-1',
		}, {
			start: 7,
			end: 16,
			string: '[[bravo]]',
			type: 'header header-1 link',
		}]);
	});

});
