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
		await rejects(mainModule.WKCDocumentMetalWrite(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCDocumentMetalWrite(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCDocumentID: null,
		}))).WKCErrors, {
			WKCDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('resolves object', async function() {
		let item = await mainModule.WKCDocumentMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid());

		deepEqual(item, Object.assign(kTesting.StubDocumentObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCDocumentMetalRead', function testWKCDocumentMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCDocumentMetalRead(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves null if not found', async function() {
		deepEqual(await mainModule.WKCDocumentMetalRead(WKXTestingStorageClient, 'alfa'), null);
	});

	it('resolves object', async function() {
		let item = await mainModule.WKCDocumentMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid());

		deepEqual(await mainModule.WKCDocumentMetalRead(WKXTestingStorageClient, item.WKCDocumentID), item);
	});

});

describe('WKCDocumentMetalList', function testWKCDocumentMetalList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mainModule.WKCDocumentMetalList(WKXTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mainModule.WKCDocumentMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid());
		deepEqual(Object.values(await mainModule.WKCDocumentMetalList(WKXTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.WKCDocumentMetalList(WKXTestingStorageClient)), [item.WKCDocumentID]);
	});

});

describe('WKCDocumentMetalDelete', function testWKCDocumentMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCDocumentMetalDelete(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mainModule.WKCDocumentMetalDelete(WKXTestingStorageClient, (await mainModule.WKCDocumentMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid())).WKCDocumentID), {
			statusCode: 200,
		});
	});

	it('deletes WKCDocument', async function() {
		await mainModule.WKCDocumentMetalDelete(WKXTestingStorageClient, (await mainModule.WKCDocumentMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid())).WKCDocumentID);
		deepEqual(await mainModule.WKCDocumentMetalList(WKXTestingStorageClient), {});
	});

});
