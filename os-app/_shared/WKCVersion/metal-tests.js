import { rejects, deepEqual } from 'assert';

import * as mainModule from './metal.js';

const kTesting = {
	StubDocumentObjectValid: function() {
		return {
			WKCVersionID: 'alfa',
			WKCVersionDocumentID: 'bravo',
			WKCVersionBody: 'charlie',
			WKCVersionDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

describe('WKCVersionMetalWrite', function testWKCVersionMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCVersionMetalWrite(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCVersionMetalWrite(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObjectValid(), {
			WKCVersionID: null,
		}))).WKCErrors, {
			WKCVersionID: [
				'WKCErrorNotString',
			],
		});
	});

	it('resolves object', async function() {
		let item = await mainModule.WKCVersionMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid());

		deepEqual(item, Object.assign(kTesting.StubDocumentObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCVersionMetalRead', function testWKCVersionMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCVersionMetalRead(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves null if not found', async function() {
		deepEqual(await mainModule.WKCVersionMetalRead(WKXTestingStorageClient, 'alfa'), null);
	});

	it('resolves object', async function() {
		let item = await mainModule.WKCVersionMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid());

		deepEqual(await mainModule.WKCVersionMetalRead(WKXTestingStorageClient, item.WKCVersionID), item);
	});

});

describe('WKCVersionMetalList', function testWKCVersionMetalList() {

	it('resolves empty array if none', async function() {
		deepEqual(await mainModule.WKCVersionMetalList(WKXTestingStorageClient), {});
	});

	it('resolves array', async function() {
		let item = await mainModule.WKCVersionMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid());
		deepEqual(Object.values(await mainModule.WKCVersionMetalList(WKXTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.WKCVersionMetalList(WKXTestingStorageClient)), [item.WKCVersionID]);
	});

});

describe('WKCVersionMetalDelete', function testWKCVersionMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCVersionMetalDelete(WKXTestingStorageClient, 1), /WKCErrorInputNotValid/);
	});

	it('resolves object', async function() {
		deepEqual(await mainModule.WKCVersionMetalDelete(WKXTestingStorageClient, (await mainModule.WKCVersionMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid())).WKCVersionID), {
			statusCode: 200,
		});
	});

	it('deletes WKCVersion', async function() {
		await mainModule.WKCVersionMetalDelete(WKXTestingStorageClient, (await mainModule.WKCVersionMetalWrite(WKXTestingStorageClient, kTesting.StubDocumentObjectValid())).WKCVersionID);
		deepEqual(await mainModule.WKCVersionMetalList(WKXTestingStorageClient), {});
	});

});
