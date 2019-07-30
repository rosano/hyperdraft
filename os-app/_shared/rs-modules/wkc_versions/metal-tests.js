import { rejects, deepEqual } from 'assert';

import * as mainModule from './metal.js';

const kTesting = {
	StubVersionObjectValid: function() {
		return {
			WKCVersionID: 'alfa',
			WKCVersionNoteID: 'alfa',
			WKCVersionBody: 'bravo',
			WKCVersionDate: new Date('2019-01-30T18:10:00.000Z'),
		};
	},
};

describe('WKCVersionsMetalWrite', function testWKCVersionsMetalWrite() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCVersionsMetalWrite(WKCTestingStorageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCVersionsMetalWrite(WKCTestingStorageClient, Object.assign(kTesting.StubVersionObjectValid(), {
			WKCVersionID: null,
		}))).WKCErrors, {
			WKCVersionID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCVersion', async function() {
		let item = await mainModule.WKCVersionsMetalWrite(WKCTestingStorageClient, kTesting.StubVersionObjectValid());

		deepEqual(item, Object.assign(kTesting.StubVersionObjectValid(), {
			'@context': item['@context'],
		}));
	});

});

describe('WKCVersionsMetalRead', function testWKCVersionsMetalRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCVersionsMetalRead(WKCTestingStorageClient, 1), /WKCErrorInputInvalid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.WKCVersionsMetalRead(WKCTestingStorageClient, 'alfa'), null);
	});

	it('returns WKCVersion', async function() {
		let item = await mainModule.WKCVersionsMetalWrite(WKCTestingStorageClient, kTesting.StubVersionObjectValid());

		deepEqual(await mainModule.WKCVersionsMetalRead(WKCTestingStorageClient, item.WKCVersionID), item);
	});

});

describe('WKCVersionsMetalList', function testWKCVersionsMetalList() {

	it('returns empty array if none', async function() {
		deepEqual(await mainModule.WKCVersionsMetalList(WKCTestingStorageClient), {});
	});

	it('returns existing WKCVersions', async function() {
		let item = await mainModule.WKCVersionsMetalWrite(WKCTestingStorageClient, kTesting.StubVersionObjectValid());
		deepEqual(Object.values(await mainModule.WKCVersionsMetalList(WKCTestingStorageClient)), [item]);
		deepEqual(Object.keys(await mainModule.WKCVersionsMetalList(WKCTestingStorageClient)), [item.WKCVersionID]);
	});

});

describe('WKCVersionsMetalDelete', function testWKCVersionsMetalDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCVersionsMetalDelete(WKCTestingStorageClient, 1), /WKCErrorInputInvalid/);
	});

	it('returns statusCode', async function() {
		deepEqual(await mainModule.WKCVersionsMetalDelete(WKCTestingStorageClient, (await mainModule.WKCVersionsMetalWrite(WKCTestingStorageClient, kTesting.StubVersionObjectValid())).WKCVersionID), {
			statusCode: 200,
		});
	});

	it('deletes WKCVersion', async function() {
		await mainModule.WKCVersionsMetalDelete(WKCTestingStorageClient, (await mainModule.WKCVersionsMetalWrite(WKCTestingStorageClient, kTesting.StubVersionObjectValid())).WKCVersionID);
		deepEqual(await mainModule.WKCVersionsMetalList(WKCTestingStorageClient), {});
	});

});
