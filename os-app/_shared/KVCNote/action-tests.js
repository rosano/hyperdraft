const { throws, rejects, deepEqual } = require('assert');

const mainModule = require('./action.js').default;
const KVCNoteStorage = require('./storage.js').default;
const KVCVersionsAction = require('../KVCVersion/action.js').default;
const KVCTemplate = require('../KVCTemplate/main.js');

const kTesting = {
	StubNoteObject() {
		return {
			KVCNoteBody: 'bravo',
		};
	},

	uPublish (param1 = kTesting.StubNoteObject(), param2 = '', param3 = {}, param4 = {}) {
		return mainModule.KVCNoteActionPublish(KVCTestingStorageClient, param1, param2, param3, param4);
	},
};

describe('KVCNoteActionCreate', function test_KVCNoteActionCreate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCNoteActionCreate(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns object with KVCErrors if not valid', async function() {
		deepEqual((await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteBody: null,
		}))).KVCErrors, {
			KVCNoteBody: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns inputData', async function() {
		const item = kTesting.StubNoteObject();
		deepEqual(item === await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, item), true);
	});

	it('sets KVCNoteID to unique value', async function() {
		const items = await uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).KVCNoteID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('sets KVCNoteCreationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).KVCNoteCreationDate < 100, true);
	});

	it('sets KVCNoteModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())).KVCNoteModificationDate < 100, true);
	});

});

describe('KVCNoteActionUpdate', function test_KVCNoteActionUpdate() {

	it('rejects if not valid', async function() {
		await rejects(mainModule.KVCNoteActionUpdate(KVCTestingStorageClient, {}), /KVCErrorInputNotValid/);
	});

	it('returns inputData', async function() {
		const item = await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());
		deepEqual(item === await mainModule.KVCNoteActionUpdate(KVCTestingStorageClient, item), true);
	});

	it('sets KVCNoteModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.KVCNoteActionUpdate(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNoteModificationDate < 100, true);
	});

	it('writes inputData if not found', async function() {
		const item = await mainModule.KVCNoteActionUpdate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteID: 'alfa',
			KVCNoteCreationDate: new Date(),
			KVCNoteModificationDate: new Date(),
		}));
		deepEqual(item, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteID: item.KVCNoteID,
			KVCNoteCreationDate: item.KVCNoteCreationDate,
			KVCNoteModificationDate: item.KVCNoteModificationDate,
			'@context': item['@context'],
		}));
	});

});

describe('KVCNoteActionDelete', function test_KVCNoteActionDelete() {

	it('rejects if not valid', async function() {
		await rejects(mainModule.KVCNoteActionDelete(KVCTestingStorageClient, {}), /KVCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mainModule.KVCNoteActionDelete(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())), {
			statusCode: 200,
		});
	});

	it('deletes KVCNote', async function() {
		await mainModule.KVCNoteActionDelete(KVCTestingStorageClient, await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));
		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {}), []);
	});

	it('deletes corresponding versionObjects', async function() {
		const item = await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());

		await KVCVersionsAction.KVCVersionActionCreate(KVCTestingStorageClient, {
			KVCVersionBody: 'charlie',
			KVCVersionNoteID: item.KVCNoteID,
			KVCVersionDate: new Date(),
		});

		await mainModule.KVCNoteActionDelete(KVCTestingStorageClient, item);
		deepEqual(await KVCVersionsAction.KVCVersionActionQuery(KVCTestingStorageClient, {}), []);
	});

});

describe('KVCNoteActionQuery', function test_KVCNoteActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mainModule.KVCNoteActionQuery(KVCTestingStorageClient, null), /KVCErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {}), []);
	});

	it('includes all KVCNotes if no query', async function() {
		const items = await uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			uSleep(1);
			return await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				KVCNoteBody: e,
			}));
		}));

		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {}), items.reverse());
	});

	it('filters string', async function() {
		const items = await uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				KVCNoteID: e,
			}));
		}));

		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {
			KVCNoteID: items.slice(-1).pop().KVCNoteID,
		}), items.slice(-1));
	});

	it('filters boolean', async function() {
		const items = await uSerial(Array.from(Array(3)).map(async function (e, index) {
			return await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
				KVCNoteIsPublic: !!index,
			}));
		}));

		deepEqual(await mainModule.KVCNoteActionQuery(KVCTestingStorageClient, {
			KVCNoteIsPublic: false,
		}), items.slice(0, 1));
	});

});

describe('KVCNoteActionPublishPath', function test_KVCNoteActionPublishPath() {

	const item = Object.assign(StubNoteObjectValid(), {
		KVCNotePublicID: 'charlie',
	});

	it('throws if param1 not valid', function() {
		throws(function() {
			mainModule.KVCNoteActionPublishPath({}, false);
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not boolean', function() {
		throws(function() {
			mainModule.KVCNoteActionPublishPath(item, 'true');
		}, /KVCErrorInputNotValid/);
	});

	it('returns KVCNoteStoragePublicObjectPath', function() {
		deepEqual(mainModule.KVCNoteActionPublishPath(item, false), KVCNoteStorage.KVCNoteStoragePublicObjectPath(item));
	});

	it('returns KVCNoteStoragePublicRootPagePath if param2 true', function() {
		deepEqual(mainModule.KVCNoteActionPublishPath(item, true), KVCNoteStorage.KVCNoteStoragePublicRootPagePath());
	});

});

describe('KVCNoteActionPublicPath', function test_KVCNoteActionPublicPath() {

	const item = Object.assign(StubNoteObjectValid(), {
		KVCNotePublicID: 'charlie',
	});

	it('throws if param1 not valid', function() {
		throws(function() {
			mainModule.KVCNoteActionPublicPath({}, false);
		}, /KVCErrorInputNotValid/);
	});

	it('throws if param2 not boolean', function() {
		throws(function() {
			mainModule.KVCNoteActionPublicPath(item, 'true');
		}, /KVCErrorInputNotValid/);
	});

	it('returns KVCNoteStoragePublicObjectPath', function() {
		deepEqual(mainModule.KVCNoteActionPublicPath(item, false), KVCNoteStorage.KVCNoteStoragePublicObjectPath(item));
	});

	it('returns / if param2 true', function() {
		deepEqual(mainModule.KVCNoteActionPublicPath(item, true), '/');
	});

});

describe('KVCNoteActionPublicTitlePathMap', function test_KVCNoteActionPublicTitlePathMap() {

	it('returns object', async function() {
		deepEqual(await mainModule.KVCNoteActionPublicTitlePathMap(KVCTestingStorageClient, '', true), {});
	});

	it('excludes if KVCNoteIsPublic false', async function() {
		await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());
		deepEqual(await mainModule.KVCNoteActionPublicTitlePathMap(KVCTestingStorageClient, '', true), {});
	});

	it('includes if KVCNoteIsPublic true', async function() {
		const item = await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));
		deepEqual(await mainModule.KVCNoteActionPublicTitlePathMap(KVCTestingStorageClient, '', true), {
			bravo: item.KVCNotePublicID,
		});
	});

	it('selects last updated note if duplicate title', async function() {
		await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteBody: 'alfa\nbravo',
		})));

		uSleep(1);
		
		const item = await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteBody: 'alfa\ncharlie',
		})));

		deepEqual(await mainModule.KVCNoteActionPublicTitlePathMap(KVCTestingStorageClient, '', true), {
			alfa: item.KVCNotePublicID,
		});
	});

	it('links to KVCNoteActionPublicPath', async function() {
		const item = await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));
		deepEqual(await mainModule.KVCNoteActionPublicTitlePathMap(KVCTestingStorageClient, item.KVCNoteID, true), {
			bravo: '/',
		});
	});

});

describe('KVCNoteActionPublish', function test_KVCNoteActionPublish() {

	it('rejects if param1 not valid', async function() {
		await rejects(mainModule.KVCNoteActionPublish(KVCTestingStorageClient, {}, '', {}, {}), /KVCErrorInputNotValid/);
	});

	it('rejects if param2 not string', async function() {
		await rejects(mainModule.KVCNoteActionPublish(KVCTestingStorageClient, StubNoteObjectValid(), null, {}, {}), /KVCErrorInputNotValid/);
	});

	it('rejects if param3 not object', async function() {
		await rejects(mainModule.KVCNoteActionPublish(KVCTestingStorageClient, StubNoteObjectValid(), '', null, {}), /KVCErrorInputNotValid/);
	});

	it('rejects if options not object', async function() {
		await rejects(mainModule.KVCNoteActionPublish(KVCTestingStorageClient, StubNoteObjectValid(), '', {}, null), /KVCErrorInputNotValid/);
	});

	it('returns param1', async function() {
		const item = await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject());
		deepEqual(item === await kTesting.uPublish(item), true);
	});

	it('sets KVCNoteIsPublic to true', async function() {
		deepEqual((await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNoteIsPublic, true);
	});

	it('sets KVCNotePublishDate to now', async function() {
		deepEqual(new Date() - (await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNotePublishDate < 100, true);
	});

	it('kees existing KVCNotePublishDate', async function() {
		const item = await mainModule.KVCNoteActionRetract(KVCTestingStorageClient, await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())), false);
		const date = item.KVCNotePublishDate;

		deepEqual((await kTesting.uPublish(item)).KVCNotePublishDate, date);
	});

	it('sets KVCNotePublicID to string', async function() {
		deepEqual(typeof (await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNotePublicID, 'string');
	});

	it('sets KVCNotePublicID to lowercase', async function() {
		const item = (await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNotePublicID;
		deepEqual(item, item.toLowerCase());
	});

	it('sets KVCNotePublicID to unique value', async function() {
		const items = await uSerial(Array.from(Array(10)).map(async function (e) {
			return (await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()))).KVCNotePublicID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('keeps existing KVCNotePublicID', async function() {
		const item = await mainModule.KVCNoteActionRetract(KVCTestingStorageClient, await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())), false);
		const id = item.KVCNotePublicID;

		deepEqual((await kTesting.uPublish(item)).KVCNotePublicID, id);
	});

	it('writes to public folder', async function() {
		const item = await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()), 'alfa');

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, 'alfa');
	});

	it('replaces public links', async function() {
		const item = await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, Object.assign(kTesting.StubNoteObject(), {
			KVCNoteBody: 'bravo\n[[charlie]]'
		})), `alfa {${ KVCTemplate.KVCTemplateTokenPostBody() }}`, {
			charlie: 'delta',
		});

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, 'alfa <p><a href="delta">charlie</a></p>');
	});

	it('writes to two paths if KVCOptionIsRoot true', async function() {
		const item = await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()), 'alfa', {}, {
			KVCOptionIsRoot: true,
		});

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, 'alfa');
		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicRootPagePath())).data, 'alfa');
	});

	it('replaces tokens', async function() {
		const item = await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()), `alfa {${ KVCTemplate.KVCTemplateTokenPostTitle() }}`);

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, 'alfa bravo');
	});

	context('blocks', function () {
		
		it('replaces if not present', async function() {
			const item = await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()), `alfa {block:alfa}{/block:alfa}`);

			deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, 'alfa ');
		});
		
		it('replaces KVCTemplateTokenRootURL', async function() {
			const item = await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()), `alfa {block:${ KVCTemplate.KVCTemplateTokenRootURL() }}{${ KVCTemplate.KVCTemplateTokenRootURL() }}{/block:${ KVCTemplate.KVCTemplateTokenRootURL() }}`, {}, {
				KVCOptionRootURL: 'bravo',
			});

			deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, 'alfa bravo');
		});
	
	});

});

describe('KVCNoteActionRetract', function test_KVCNoteActionRetract() {

	it('rejects if param1 not valid', async function() {
		await rejects(mainModule.KVCNoteActionRetract(KVCTestingStorageClient, {}, false), /KVCErrorInputNotValid/);
	});

	it('rejects if param2 not boolean', async function() {
		const item = await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));

		await rejects(mainModule.KVCNoteActionRetract(KVCTestingStorageClient, item, 'true'), /KVCErrorInputNotValid/);
	});

	it('returns KVCNote', async function() {
		const item = await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()));

		deepEqual(item === await mainModule.KVCNoteActionRetract(KVCTestingStorageClient, item, false), true);
	});

	it('sets KVCNoteIsPublic to false', async function() {
		deepEqual((await mainModule.KVCNoteActionRetract(KVCTestingStorageClient, await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())), false)).KVCNoteIsPublic, false);
	});

	it('deletes file from public folder', async function() {
		const item = await mainModule.KVCNoteActionRetract(KVCTestingStorageClient, await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject())), false);

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, undefined);
	});

	it('deletes from two paths if param2 true', async function() {
		const item = await mainModule.KVCNoteActionRetract(KVCTestingStorageClient, await kTesting.uPublish(await mainModule.KVCNoteActionCreate(KVCTestingStorageClient, kTesting.StubNoteObject()), 'alfa', {}, {
			KVCOptionIsRoot: true,
		}), true);

		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicObjectPath(item))).data, undefined);
		deepEqual((await KVCTestingStorageClient.wikiavec.__DEBUG.__OLSKRemoteStoragePublicClient().getFile(KVCNoteStorage.KVCNoteStoragePublicRootPagePath())).data, undefined);
	});

});
