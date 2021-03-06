const { throws, rejects, deepEqual, strictEqual, notStrictEqual } = require('assert');

const mod = require('./main.js').default;

const KVCNote = require('../KVCNote/main.js').default;

describe('KVCTransportImport', function test_KVCTransportImport() {

	it('rejects if not object', async function () {
		await rejects(ZDRTestingWrap.App.KVCTransport.KVCTransportImport(null), /KVCErrorInputNotValid/);
	});

	it('returns object', async function () {
		deepEqual(await ZDRTestingWrap.App.KVCTransport.KVCTransportImport({}), {});
	});

	context('KVCNote', function () {

		it('rejects if not array', async function () {
			await rejects(ZDRTestingWrap.App.KVCTransport.KVCTransportImport({
				KVCNote: null,
			}), /KVCErrorInputNotValid/);
		});
		
		it('rejects if not valid', async function () {
			await rejects(ZDRTestingWrap.App.KVCTransport.KVCTransportImport({
				KVCNote: [StubNoteObjectValid({
					KVCNoteBody: null,
				})],
			}), /KVCErrorInputNotValid/);
		});

		it('passes input', async function () {
			const item = StubNoteObjectValid()
			strictEqual((await ZDRTestingWrap.App.KVCTransport.KVCTransportImport({
				KVCNote: [item],
			})).KVCNote.shift(), item);
		});

		it('writes objects', async function () {
			const item = StubNoteObjectValid();

			await ZDRTestingWrap.App.KVCTransport.KVCTransportImport({
				KVCNote: [item],
			});

			deepEqual(await ZDRTestingWrap.App.KVCNote.KVCNoteList(), [item]);
		});
	
	});

	context('KVCSetting', function () {

		it('rejects if not array', async function () {
			await rejects(ZDRTestingWrap.App.KVCTransport.KVCTransportImport({
				KVCSetting: null,
			}), /KVCErrorInputNotValid/);
		});
		
		it('rejects if not valid', async function () {
			await rejects(ZDRTestingWrap.App.KVCTransport.KVCTransportImport({
				KVCSetting: [StubSettingObjectValid({
					KVCSettingKey: null,
				})],
			}), /KVCErrorInputNotValid/);
		});

		it('passes input', async function () {
			const item = StubSettingObjectValid()
			strictEqual((await ZDRTestingWrap.App.KVCTransport.KVCTransportImport({
				KVCSetting: [item],
			})).KVCSetting.shift(), item);
		});

		it('writes objects', async function () {
			const item = StubSettingObjectValid();

			await ZDRTestingWrap.App.KVCTransport.KVCTransportImport({
				KVCSetting: [item],
			});

			deepEqual(await ZDRTestingWrap.App.KVCSetting.KVCSettingList(), [item]);
		});
	
	});

});

describe('KVCTransportExport', function test_KVCTransportExport() {

	it('throws if not object', function () {
		throws(function () {
			ZDRTestingWrap.App.KVCTransport.KVCTransportExport(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object', function () {
		deepEqual(ZDRTestingWrap.App.KVCTransport.KVCTransportExport({}), {});
	});

	context('KVCNote', function () {

		it('throws if not array', function () {
			throws(function () {
				ZDRTestingWrap.App.KVCTransport.KVCTransportExport({
					KVCNote: null,
				});
			}, /KVCErrorInputNotValid/);
		});

		it('copies input', function () {
			const item = StubNoteObjectValid();
			notStrictEqual((ZDRTestingWrap.App.KVCTransport.KVCTransportExport({
				KVCNote: [item],
			})).KVCNote.shift(), item);
		});

		it('strips dynamic attributes', function () {
			const item = StubNoteObjectValid({
				$alfa: Math.random().toString(),
			});
			deepEqual((ZDRTestingWrap.App.KVCTransport.KVCTransportExport({
				KVCNote: [item],
			})).KVCNote.shift().$alfa, undefined);
		});
	
	});

	context('KVCSetting', function () {

		it('throws if not array', function () {
			throws(function () {
				ZDRTestingWrap.App.KVCTransport.KVCTransportExport({
					KVCSetting: null,
				});
			}, /KVCErrorInputNotValid/);
		});

		it('copies input', function () {
			const item = StubSettingObjectValid();
			notStrictEqual((ZDRTestingWrap.App.KVCTransport.KVCTransportExport({
				KVCSetting: [item],
			})).KVCSetting.shift(), item);
		});

		it('strips dynamic attributes', function () {
			const item = StubSettingObjectValid({
				$alfa: Math.random().toString(),
			});
			deepEqual((ZDRTestingWrap.App.KVCTransport.KVCTransportExport({
				KVCSetting: [item],
			})).KVCSetting.shift().$alfa, undefined);
		});
	
	});

});
