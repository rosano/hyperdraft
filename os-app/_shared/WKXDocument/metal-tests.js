import { rejects, deepEqual } from 'assert';

import * as mainModule from './metal.js';

const kTesting = {
	StubDocumentObjectValid: function() {
		return {
			WKXDocumentID: 'alfa',
			WKXDocumentBody: 'charlie',
			WKXDocumentCreationDate: new Date('2019-02-23T13:56:36Z'),
			WKXDocumentModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('WKXDocumentMetalWrite', function testWKXDocumentMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKXDocumentMetalWrite(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKXDocumentMetalWrite(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObjectValid(), {
			WKXDocumentID: null,
		}))).WKCErrors, {
			WKXDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('resolves object', async function() {
		let item = await mainModule.WKXDocumentMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid());

		deepEqual(item, Object.assign(kTesting.StubDocumentObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKXDocumentMetalRead', function testWKXDocumentMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKXDocumentMetalRead(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves null if not found', async function() {
		deepEqual(await mainModule.WKXDocumentMetalRead(WKXTestingStorageClient, 'alfa'), null);
	});

	it('resolves object', async function() {
		let item = await mainModule.WKXDocumentMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid());

		deepEqual(await mainModule.WKXDocumentMetalRead(WKXTestingStorageClient, item.WKXDocumentID), item);
	});

});

describe('WKXDocumentMetalList', function testWKXDocumentMetalList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mainModule.WKXDocumentMetalList(WKXTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mainModule.WKXDocumentMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid());
		deepEqual(Object.values(await mainModule.WKXDocumentMetalList(WKXTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.WKXDocumentMetalList(WKXTestingStorageClient)), [item.WKXDocumentID]);
	});

});

describe('WKXDocumentMetalDelete', function testWKXDocumentMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKXDocumentMetalDelete(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mainModule.WKXDocumentMetalDelete(WKXTestingStorageClient, (await mainModule.WKXDocumentMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid())).WKXDocumentID), {
			statusCode: 200,
		});
	});

	it('deletes WKXDocument', async function() {
		await mainModule.WKXDocumentMetalDelete(WKXTestingStorageClient, (await mainModule.WKXDocumentMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid())).WKXDocumentID);
		deepEqual(await mainModule.WKXDocumentMetalList(WKXTestingStorageClient), {});
	});

});
