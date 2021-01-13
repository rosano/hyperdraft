const { throws, rejects, deepEqual } = require('assert');

const mod = require('./main.js').default;

const KVCNoteAction = require('../KVCNote/action.js').default;

describe('KVC_DataModuleName', function test_KVC_DataModuleName() {

	it('returns string', function () {
		deepEqual(mod.KVC_DataModuleName(), 'wikiavec');
	});

});

describe('KVC_DataImport', function test_KVC_DataImport() {

	it('throws if not array', function () {
		throws(function () {
			mod.KVC_DataImport(KVCTestingStorageClient, null);
		}, /KVCErrorInputNotValid/);
	});

	it('throws if not filled', function () {
		throws(function () {
			mod.KVC_DataImport(KVCTestingStorageClient, []);
		}, /KVCErrorInputNotValid/);
	});

	context('KVCNote', function () {
		
		it('rejects if not valid', async function () {
			await rejects(mod.KVC_DataImport(KVCTestingStorageClient, [StubNoteObjectValid({
				KVCNoteBody: null,
			})]), /KVCErrorInputNotValid/);
		});

		it('returns array', async function () {
			const item = await mod.KVC_DataImport(KVCTestingStorageClient, [StubNoteObjectValid()]);

			deepEqual(item, [StubNoteObjectValid({
				KVCNoteID: item[0].KVCNoteID,
				KVCNoteCreationDate: item[0].KVCNoteCreationDate,
				KVCNoteModificationDate: item[0].KVCNoteModificationDate,
			})]);
		});

		it('creates KVCNote objects', async function () {
			const item = await mod.KVC_DataImport(KVCTestingStorageClient, [StubNoteObjectValid()]);

			deepEqual(await KVCNoteAction.KVCNoteActionQuery(KVCTestingStorageClient, {}), item);
		});
	
	});

});
