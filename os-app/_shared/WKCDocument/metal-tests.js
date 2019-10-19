import { rejects, deepEqual } from 'assert';

import * as mainModule from './metal.js';

const kTesting = {
	StubDocumentObjectValid: function() {
		return {
			WKCDocumentID: 'alfa',
			WKCDocumentBody: 'charlie',
			WKCDocumentCreationDate: new Date('2019-02-23T13:56:36Z'),
			WKCDocumentModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('WKCDocumentMetalWrite', function testWKCDocumentMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCDocumentMetalWrite(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCDocumentMetalWrite(WKCTestingStorageClient, Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCDocumentID: null,
		}))).WKCErrors, {
			WKCDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('resolves object', async function() {
		let item = await mainModule.WKCDocumentMetalWrite(WKCTestingStorageClient, kTesting.StubDocumentObjectValid());

		deepEqual(item, Object.assign(kTesting.StubDocumentObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCDocumentMetalRead', function testWKCDocumentMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCDocumentMetalRead(WKCTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves null if not found', async function() {
		deepEqual(await mainModule.WKCDocumentMetalRead(WKCTestingStorageClient, 'alfa'), null);
	});

	it('resolves object', async function() {
		let item = await mainModule.WKCDocumentMetalWrite(WKCTestingStorageClient, kTesting.StubDocumentObjectValid());

		deepEqual(await mainModule.WKCDocumentMetalRead(WKCTestingStorageClient, item.WKCDocumentID), item);
	});

});

describe('WKCDocumentMetalList', function testWKCDocumentMetalList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mainModule.WKCDocumentMetalList(WKCTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mainModule.WKCDocumentMetalWrite(WKCTestingStorageClient, kTesting.StubDocumentObjectValid());
		deepEqual(Object.values(await mainModule.WKCDocumentMetalList(WKCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.WKCDocumentMetalList(WKCTestingStorageClient)), [item.WKCDocumentID]);
	});

});

describe('WKCDocumentMetalDelete', function testWKCDocumentMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCDocumentMetalDelete(WKCTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mainModule.WKCDocumentMetalDelete(WKCTestingStorageClient, (await mainModule.WKCDocumentMetalWrite(WKCTestingStorageClient, kTesting.StubDocumentObjectValid())).WKCDocumentID), {
			statusCode: 200,
		});
	});

	it('deletes WKCDocument', async function() {
		await mainModule.WKCDocumentMetalDelete(WKCTestingStorageClient, (await mainModule.WKCDocumentMetalWrite(WKCTestingStorageClient, kTesting.StubDocumentObjectValid())).WKCDocumentID);
		deepEqual(await mainModule.WKCDocumentMetalList(WKCTestingStorageClient), {});
	});

});
