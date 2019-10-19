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
		await rejects(mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
			WKCDocumentBody: null,
		}))).WKCErrors, {
			WKCDocumentBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCDocument', async function() {
		let item = await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject());

		deepEqual(item, Object.assign(kTesting.StubDocumentObject(), {
			WKCDocumentID: item.WKCDocumentID,
			WKCDocumentCreationDate: item.WKCDocumentCreationDate,
			WKCDocumentModificationDate: item.WKCDocumentModificationDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKCDocumentID to unique value', async function() {
		let items = await kTesting.uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())).WKCDocumentID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('sets WKCDocumentCreationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())).WKCDocumentCreationDate < 100, true);
	});

	it('sets WKCDocumentModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())).WKCDocumentModificationDate < 100, true);
	});

});

describe('WKCDocumentActionRead', function testWKCDocumentActionRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKCDocumentActionRead(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.WKCDocumentActionRead(WKXTestingStorageClient, 'alfa'), null);
	});

	it('returns WKCDocument', async function() {
		let item = await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject());

		deepEqual(item, await mainModule.WKCDocumentActionRead(WKXTestingStorageClient, item.WKCDocumentID));
	});

});

describe('WKCDocumentActionUpdate', function testWKCDocumentActionUpdate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCDocumentActionUpdate(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCDocumentActionUpdate(WKXTestingStorageClient, Object.assign(await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()), {
			WKCDocumentID: null,
		}))).WKCErrors, {
			WKCDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCDocument', async function() {
		let itemCreated = await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject());

		let item = await mainModule.WKCDocumentActionUpdate(WKXTestingStorageClient, itemCreated);

		deepEqual(item, Object.assign(itemCreated, {
			WKCDocumentModificationDate: item.WKCDocumentModificationDate,
		}));
	});

	it('sets WKCDocumentModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKCDocumentActionUpdate(WKXTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()))).WKCDocumentModificationDate < 100, true);
	});

	it('writes inputData if not found', async function() {
		let item = await mainModule.WKCDocumentActionUpdate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
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
		await rejects(mainModule.WKCDocumentActionDelete(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mainModule.WKCDocumentActionDelete(WKXTestingStorageClient, (await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())).WKCDocumentID), {
			statusCode: 200,
		});
	});

	it('deletes WKCDocument', async function() {
		let itemID;
		await mainModule.WKCDocumentActionDelete(WKXTestingStorageClient, itemID = (await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())).WKCDocumentID);
		deepEqual(await mainModule.WKCDocumentActionRead(WKXTestingStorageClient, itemID), null);
	});

	it('deletes corresponding versionObjects', async function() {
		await mainModule.WKCDocumentActionDelete(WKXTestingStorageClient, (await WKCVersionsAction.WKCVersionActionCreate(WKXTestingStorageClient, {
			WKCVersionBody: 'charlie',
			WKCVersionDocumentID: (await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())).WKCDocumentID,
			WKCVersionDate: new Date(),
		})).WKCVersionDocumentID);
		deepEqual(await WKCVersionsAction.WKCVersionActionQuery(WKXTestingStorageClient, {}), []);
	});

});

describe('WKCDocumentActionQuery', function testWKCDocumentActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCDocumentActionQuery(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.WKCDocumentActionQuery(WKXTestingStorageClient, {}), []);
	});

	it('includes all WKCDocuments if no query', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			kTesting.uSleep(1);
			return await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
				WKCDocumentBody: e,
			}));
		}));

		deepEqual(await mainModule.WKCDocumentActionQuery(WKXTestingStorageClient, {}), items.reverse());
	});

	it('filters string', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
				WKCDocumentID: e,
			}));
		}));

		deepEqual(await mainModule.WKCDocumentActionQuery(WKXTestingStorageClient, {
			WKCDocumentID: items.slice(-1).pop().WKCDocumentID,
		}), items.slice(-1));
	});

	it('filters boolean', async function() {
		let items = await kTesting.uSerial(Array.from(Array(3)).map(async function (e, index) {
			return await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
				WKCDocumentPublishStatusIsPublished: !!index,
			}));
		}));

		deepEqual(await mainModule.WKCDocumentActionQuery(WKXTestingStorageClient, {
			WKCDocumentPublishStatusIsPublished: false,
		}), items.slice(0, 1));
	});

});

describe('WKCDocumentActionPublish', function testWKCDocumentActionPublish() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, Object.assign(await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()), {
			WKCDocumentID: null,
		}))).WKCErrors, {
			WKCDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCDocument', async function() {
		let itemCreated = await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject());

		let item = await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, itemCreated);

		deepEqual(item, Object.assign(itemCreated, {
			WKCDocumentModificationDate: item.WKCDocumentModificationDate,
			WKCDocumentPublishStatusIsPublished: item.WKCDocumentPublishStatusIsPublished,
			WKCDocumentPublicID: item.WKCDocumentPublicID,
		}));
	});

	it('sets WKCDocumentPublishStatusIsPublished to true', async function() {
		deepEqual((await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()))).WKCDocumentPublishStatusIsPublished, true);
	});

	it('sets WKCDocumentPublicID to 1 if none published', async function() {
		deepEqual((await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()))).WKCDocumentPublicID, '1');
	});

	it('sets WKCDocumentPublicID to 2 if one published and deleted', async function() {
		mainModule.WKCDocumentActionDelete(WKXTestingStorageClient, await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())));
		deepEqual((await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()))).WKCDocumentPublicID, '2');
	});

	it('sets WKCDocumentPublicID to 3 if two published and deleted', async function() {
		let serialPromises = async function () {
			return ['alfa', 'bravo'].reduce(function (coll, e) {
				return coll.then(async function () {
					return await mainModule.WKCDocumentActionDelete(WKXTestingStorageClient, (await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, (await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
						WKCDocumentBody: e,
					}))))).WKCDocumentID);
				});

				return coll;
			}, Promise.resolve());
		};

		await serialPromises();

		deepEqual((await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, (await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())))).WKCDocumentPublicID, '3');
	});

});

describe('WKCDocumentActionUnpublish', function testWKCDocumentActionUnpublish() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKCDocumentActionUnpublish(WKXTestingStorageClient, Object.assign(await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())), {
			WKCDocumentID: null,
		}))).WKCErrors, {
			WKCDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKCDocument', async function() {
		let item = await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()));

		deepEqual(await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, item), Object.assign(item, {
			WKCDocumentModificationDate: item.WKCDocumentModificationDate,
			WKCDocumentPublishStatusIsPublished: item.WKCDocumentPublishStatusIsPublished,
		}));
	});

	it('sets WKCDocumentPublishStatusIsPublished to false', async function() {
		deepEqual((await mainModule.WKCDocumentActionUnpublish(WKXTestingStorageClient, await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())))).WKCDocumentPublishStatusIsPublished, false);
	});	

});

describe('WKCDocumentActionGetPublicLinks', function testWKCDocumentActionGetPublicLinks() {

	it('returns hash', async function() {
		deepEqual(await mainModule.WKCDocumentActionGetPublicLinks(WKXTestingStorageClient), {});
	});

	it('excludes if WKCDocumentPublishStatusIsPublished false', async function() {
		await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject());
		deepEqual(await mainModule.WKCDocumentActionGetPublicLinks(WKXTestingStorageClient), {});
	});

	it('includes if WKCDocumentPublishStatusIsPublished true', async function() {
		let item = await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, (await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())));

		deepEqual(await mainModule.WKCDocumentActionGetPublicLinks(WKXTestingStorageClient), [[item.WKCDocumentBody, item.WKCDocumentPublicID]].reduce(function (coll, e) {
			coll[e[0]] = e[1];

			return coll;
		}, {}));
	});

	it('selects last updated note if duplicate title', async function() {
		await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, (await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
			WKCDocumentBody: `heading\nalfa`,
		}))));
		kTesting.uSleep(1);
		await mainModule.WKCDocumentActionPublish(WKXTestingStorageClient, (await mainModule.WKCDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
			WKCDocumentBody: `heading\nbravo`,
		}))));

		deepEqual(await mainModule.WKCDocumentActionGetPublicLinks(WKXTestingStorageClient), {
			heading: '2',
		});
	});

});

