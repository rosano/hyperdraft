import { rejects, deepEqual } from 'assert';

import * as mainModule from './action.js';
import * as WKCVersionsAction from '../WKCVersion/action.js';

const kTesting = {
	StubDocumentObject: function() {
		return {
			WKCDocumentBody: 'bravo',
		};
	},
	uSerial: function (inputData) {
		return inputData.reduce(async function (coll, e) {
			return e.then(Array.prototype.concat.bind(await coll));
		}, Promise.resolve([]));
	},
	uSleep: function (inputData) {
		let endTime = new Date().getTime();
		while (new Date().getTime() < endTime + inputData) {}
	},
};

describe('WKCDocumentActionCreate', function testWKCDocumentActionCreate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
			WKCDocumentBody: null,
		}))).WKCErrors, {
			WKCDocumentBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCDocument', async function() {
		let item = await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject());

		deepEqual(item, Object.assign(kTesting.StubDocumentObject(), {
			WKCDocumentID: item.WKCDocumentID,
			WKCDocumentCreationDate: item.WKCDocumentCreationDate,
			WKCDocumentModificationDate: item.WKCDocumentModificationDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKCDocumentID to unique value', async function() {
		let items = await kTesting.uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject())).WKCDocumentID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('sets WKCDocumentCreationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject())).WKCDocumentCreationDate < 100, true);
	});

	it('sets WKCDocumentModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject())).WKCDocumentModificationDate < 100, true);
	});

});

describe('WKCDocumentActionRead', function testWKCDocumentActionRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCDocumentActionRead(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.WKCDocumentActionRead(WKCTestingStorageClient, 'alfa'), null);
	});

	it('returns WKCDocument', async function() {
		let item = await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject());

		deepEqual(item, await mainModule.WKCDocumentActionRead(WKCTestingStorageClient, item.WKCDocumentID));
	});

});

describe('WKCDocumentActionUpdate', function testWKCDocumentActionUpdate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCDocumentActionUpdate(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCDocumentActionUpdate(WKCTestingStorageClient, Object.assign(await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject()), {
			WKCDocumentID: null,
		}))).WKCErrors, {
			WKCDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCDocument', async function() {
		let itemCreated = await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject());

		let item = await mainModule.WKCDocumentActionUpdate(WKCTestingStorageClient, itemCreated);

		deepEqual(item, Object.assign(itemCreated, {
			WKCDocumentModificationDate: item.WKCDocumentModificationDate,
		}));
	});

	it('sets WKCDocumentModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKCDocumentActionUpdate(WKCTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject()))).WKCDocumentModificationDate < 100, true);
	});

	it('writes inputData if not found', async function() {
		let item = await mainModule.WKCDocumentActionUpdate(WKCTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
			WKCDocumentID: 'alfa',
			WKCDocumentCreationDate: new Date(),
		}));
		deepEqual(item, Object.assign(kTesting.StubDocumentObject(), {
			WKCDocumentID: item.WKCDocumentID,
			WKCDocumentCreationDate: item.WKCDocumentCreationDate,
			WKCDocumentModificationDate: item.WKCDocumentModificationDate,
			'@context': item['@context'],
		}));
	});

});

describe('WKCDocumentActionDelete', function testWKCDocumentActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCDocumentActionDelete(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mainModule.WKCDocumentActionDelete(WKCTestingStorageClient, (await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject())).WKCDocumentID), {
			statusCode: 200,
		});
	});

	it('deletes WKCDocument', async function() {
		let itemID;
		await mainModule.WKCDocumentActionDelete(WKCTestingStorageClient, itemID = (await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject())).WKCDocumentID);
		deepEqual(await mainModule.WKCDocumentActionRead(WKCTestingStorageClient, itemID), null);
	});

	it('deletes corresponding versionObjects', async function() {
		await mainModule.WKCDocumentActionDelete(WKCTestingStorageClient, (await WKCVersionsAction.WKCVersionActionCreate(WKCTestingStorageClient, {
			WKCVersionBody: 'charlie',
			WKCVersionDocumentID: (await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject())).WKCDocumentID,
			WKCVersionDate: new Date(),
		})).WKCVersionDocumentID);
		deepEqual(await WKCVersionsAction.WKCVersionActionQuery(WKCTestingStorageClient, {}), []);
	});

});

describe('WKCDocumentActionQuery', function testWKCDocumentActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCDocumentActionQuery(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.WKCDocumentActionQuery(WKCTestingStorageClient, {}), []);
	});

	it('includes all WKCDocuments if no query', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			kTesting.uSleep(1);
			return await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
				WKCDocumentBody: e,
			}));
		}));

		deepEqual(await mainModule.WKCDocumentActionQuery(WKCTestingStorageClient, {}), items.reverse());
	});

	it('filters string', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
				WKCDocumentID: e,
			}));
		}));

		deepEqual(await mainModule.WKCDocumentActionQuery(WKCTestingStorageClient, {
			WKCDocumentID: items.slice(-1).pop().WKCDocumentID,
		}), items.slice(-1));
	});

	it('filters boolean', async function() {
		let items = await kTesting.uSerial(Array.from(Array(3)).map(async function (e, index) {
			return await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
				WKCDocumentPublishStatusIsPublished: !!index,
			}));
		}));

		deepEqual(await mainModule.WKCDocumentActionQuery(WKCTestingStorageClient, {
			WKCDocumentPublishStatusIsPublished: false,
		}), items.slice(0, 1));
	});

});

describe('WKCDocumentActionPublish', function testWKCDocumentActionPublish() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, Object.assign(await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject()), {
			WKCDocumentID: null,
		}))).WKCErrors, {
			WKCDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCDocument', async function() {
		let itemCreated = await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject());

		let item = await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, itemCreated);

		deepEqual(item, Object.assign(itemCreated, {
			WKCDocumentModificationDate: item.WKCDocumentModificationDate,
			WKCDocumentPublishStatusIsPublished: item.WKCDocumentPublishStatusIsPublished,
			WKCDocumentPublicID: item.WKCDocumentPublicID,
		}));
	});

	it('sets WKCDocumentPublishStatusIsPublished to true', async function() {
		deepEqual((await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject()))).WKCDocumentPublishStatusIsPublished, true);
	});

	it('sets WKCDocumentPublicID to 1 if none published', async function() {
		deepEqual((await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject()))).WKCDocumentPublicID, '1');
	});

	it('sets WKCDocumentPublicID to 2 if one published and deleted', async function() {
		mainModule.WKCDocumentActionDelete(WKCTestingStorageClient, await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject())));
		deepEqual((await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject()))).WKCDocumentPublicID, '2');
	});

	it('sets WKCDocumentPublicID to 3 if two published and deleted', async function() {
		let serialPromises = async function () {
			return ['alfa', 'bravo'].reduce(function (coll, e) {
				return coll.then(async function () {
					return await mainModule.WKCDocumentActionDelete(WKCTestingStorageClient, (await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, (await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
						WKCDocumentBody: e,
					}))))).WKCDocumentID);
				});

				return coll;
			}, Promise.resolve());
		};

		await serialPromises();

		deepEqual((await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, (await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject())))).WKCDocumentPublicID, '3');
	});

});

describe('WKCDocumentActionUnpublish', function testWKCDocumentActionUnpublish() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCDocumentActionUnpublish(WKCTestingStorageClient, Object.assign(await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject())), {
			WKCDocumentID: null,
		}))).WKCErrors, {
			WKCDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCDocument', async function() {
		let item = await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject()));

		deepEqual(await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, item), Object.assign(item, {
			WKCDocumentModificationDate: item.WKCDocumentModificationDate,
			WKCDocumentPublishStatusIsPublished: item.WKCDocumentPublishStatusIsPublished,
		}));
	});

	it('sets WKCDocumentPublishStatusIsPublished to false', async function() {
		deepEqual((await mainModule.WKCDocumentActionUnpublish(WKCTestingStorageClient, await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject())))).WKCDocumentPublishStatusIsPublished, false);
	});	

});

describe('WKCDocumentActionGetPublicLinks', function testWKCDocumentActionGetPublicLinks() {

	it('returns hash', async function() {
		deepEqual(await mainModule.WKCDocumentActionGetPublicLinks(WKCTestingStorageClient), {});
	});

	it('excludes if WKCDocumentPublishStatusIsPublished false', async function() {
		await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject());
		deepEqual(await mainModule.WKCDocumentActionGetPublicLinks(WKCTestingStorageClient), {});
	});

	it('includes if WKCDocumentPublishStatusIsPublished true', async function() {
		let item = await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, (await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, kTesting.StubDocumentObject())));

		deepEqual(await mainModule.WKCDocumentActionGetPublicLinks(WKCTestingStorageClient), [[item.WKCDocumentBody, item.WKCDocumentPublicID]].reduce(function (coll, e) {
			coll[e[0]] = e[1];

			return coll;
		}, {}));
	});

	it('selects last updated note if duplicate title', async function() {
		await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, (await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
			WKCDocumentBody: `heading\nalfa`,
		}))));
		kTesting.uSleep(1);
		await mainModule.WKCDocumentActionPublish(WKCTestingStorageClient, (await mainModule.WKCDocumentActionCreate(WKCTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
			WKCDocumentBody: `heading\nbravo`,
		}))));

		deepEqual(await mainModule.WKCDocumentActionGetPublicLinks(WKCTestingStorageClient), {
			heading: '2',
		});
	});

});

