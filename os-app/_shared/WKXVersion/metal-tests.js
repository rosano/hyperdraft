import { rejects, deepEqual } from 'assert';

import * as mainModule from './metal.js';

const kTesting = {
	StubDocumentObjectValid: function() {
		return {
			WKXVersionID: 'alfa',
			WKXVersionDocumentID: 'bravo',
			WKXVersionBody: 'charlie',
			WKXVersionDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('WKXVersionMetalWrite', function testWKXVersionMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKXVersionMetalWrite(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKXVersionMetalWrite(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObjectValid(), {
			WKXVersionID: null,
		}))).WKCErrors, {
			WKXVersionID: [
				'WKCErrorNotString',
			],
		});
	});

	it('resolves object', async function() {
		let item = await mainModule.WKXVersionMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid());

		deepEqual(item, Object.assign(kTesting.StubDocumentObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKXVersionMetalRead', function testWKXVersionMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKXVersionMetalRead(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves null if not found', async function() {
		deepEqual(await mainModule.WKXVersionMetalRead(WKXTestingStorageClient, 'alfa'), null);
	});

	it('resolves object', async function() {
		let item = await mainModule.WKXVersionMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid());

		deepEqual(await mainModule.WKXVersionMetalRead(WKXTestingStorageClient, item.WKXVersionID), item);
	});

});

describe('WKXVersionMetalList', function testWKXVersionMetalList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mainModule.WKXVersionMetalList(WKXTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mainModule.WKXVersionMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid());
		deepEqual(Object.values(await mainModule.WKXVersionMetalList(WKXTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.WKXVersionMetalList(WKXTestingStorageClient)), [item.WKXVersionID]);
	});

});

describe('WKXVersionMetalDelete', function testWKXVersionMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKXVersionMetalDelete(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mainModule.WKXVersionMetalDelete(WKXTestingStorageClient, (await mainModule.WKXVersionMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid())).WKXVersionID), {
			statusCode: 200,
		});
	});

	it('deletes WKXVersion', async function() {
		await mainModule.WKXVersionMetalDelete(WKXTestingStorageClient, (await mainModule.WKXVersionMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid())).WKXVersionID);
		deepEqual(await mainModule.WKXVersionMetalList(WKXTestingStorageClient), {});
	});

});
