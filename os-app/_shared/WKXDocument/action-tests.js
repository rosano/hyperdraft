import { rejects, deepEqual } from 'assert';

import * as mainModule from './action.js';
import * as WKCVersionsAction from '../WKXVersion/action.js';

const kTesting = {
	StubDocumentObject: function() {
		return {
			WKXDocumentBody: 'bravo',
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

describe('WKXDocumentActionCreate', function testWKXDocumentActionCreate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
			WKXDocumentBody: null,
		}))).WKCErrors, {
			WKXDocumentBody: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKXDocument', async function() {
		let item = await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject());

		deepEqual(item, Object.assign(kTesting.StubDocumentObject(), {
			WKXDocumentID: item.WKXDocumentID,
			WKXDocumentCreationDate: item.WKXDocumentCreationDate,
			WKXDocumentModificationDate: item.WKXDocumentModificationDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKXDocumentID to unique value', async function() {
		let items = await kTesting.uSerial(Array.from(Array(10)).map(async function (e) {
			return (await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())).WKXDocumentID;
		}));
		deepEqual([...(new Set(items))], items);
	});

	it('sets WKXDocumentCreationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())).WKXDocumentCreationDate < 100, true);
	});

	it('sets WKXDocumentModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())).WKXDocumentModificationDate < 100, true);
	});

});

describe('WKXDocumentActionRead', function testWKXDocumentActionRead() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKXDocumentActionRead(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns null if not found', async function() {
		deepEqual(await mainModule.WKXDocumentActionRead(WKXTestingStorageClient, 'alfa'), null);
	});

	it('returns WKXDocument', async function() {
		let item = await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject());

		deepEqual(item, await mainModule.WKXDocumentActionRead(WKXTestingStorageClient, item.WKXDocumentID));
	});

});

describe('WKXDocumentActionUpdate', function testWKXDocumentActionUpdate() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKXDocumentActionUpdate(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKXDocumentActionUpdate(WKXTestingStorageClient, Object.assign(await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()), {
			WKXDocumentID: null,
		}))).WKCErrors, {
			WKXDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKXDocument', async function() {
		let itemCreated = await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject());

		let item = await mainModule.WKXDocumentActionUpdate(WKXTestingStorageClient, itemCreated);

		deepEqual(item, Object.assign(itemCreated, {
			WKXDocumentModificationDate: item.WKXDocumentModificationDate,
		}));
	});

	it('sets WKXDocumentModificationDate to now', async function() {
		deepEqual(new Date() - (await mainModule.WKXDocumentActionUpdate(WKXTestingStorageClient, await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()))).WKXDocumentModificationDate < 100, true);
	});

	it('writes inputData if not found', async function() {
		let item = await mainModule.WKXDocumentActionUpdate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
			WKXDocumentID: 'alfa',
			WKXDocumentCreationDate: new Date(),
		}));
		deepEqual(item, Object.assign(kTesting.StubDocumentObject(), {
			WKXDocumentID: item.WKXDocumentID,
			WKXDocumentCreationDate: item.WKXDocumentCreationDate,
			WKXDocumentModificationDate: item.WKXDocumentModificationDate,
			'@context': item['@context'],
		}));
	});

});

describe('WKXDocumentActionDelete', function testWKXDocumentActionDelete() {

	it('rejects if not string', async function() {
		await rejects(mainModule.WKXDocumentActionDelete(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object', async function() {
		deepEqual(await mainModule.WKXDocumentActionDelete(WKXTestingStorageClient, (await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())).WKXDocumentID), {
			statusCode: 200,
		});
	});

	it('deletes WKXDocument', async function() {
		let itemID;
		await mainModule.WKXDocumentActionDelete(WKXTestingStorageClient, itemID = (await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())).WKXDocumentID);
		deepEqual(await mainModule.WKXDocumentActionRead(WKXTestingStorageClient, itemID), null);
	});

	it('deletes corresponding versionObjects', async function() {
		await mainModule.WKXDocumentActionDelete(WKXTestingStorageClient, (await WKCVersionsAction.WKXVersionActionCreate(WKXTestingStorageClient, {
			WKXVersionBody: 'charlie',
			WKXVersionDocumentID: (await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())).WKXDocumentID,
			WKXVersionDate: new Date(),
		})).WKXVersionDocumentID);
		deepEqual(await WKCVersionsAction.WKXVersionActionQuery(WKXTestingStorageClient, {}), []);
	});

});

describe('WKXDocumentActionQuery', function testWKXDocumentActionQuery() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKXDocumentActionQuery(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns array', async function() {
		deepEqual(await mainModule.WKXDocumentActionQuery(WKXTestingStorageClient, {}), []);
	});

	it('includes all WKXDocuments if no query', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			kTesting.uSleep(1);
			return await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
				WKXDocumentBody: e,
			}));
		}));

		deepEqual(await mainModule.WKXDocumentActionQuery(WKXTestingStorageClient, {}), items.reverse());
	});

	it('filters string', async function() {
		let items = await kTesting.uSerial(['alfa', 'bravo', 'charlie'].map(async function (e) {
			return await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
				WKXDocumentID: e,
			}));
		}));

		deepEqual(await mainModule.WKXDocumentActionQuery(WKXTestingStorageClient, {
			WKXDocumentID: items.slice(-1).pop().WKXDocumentID,
		}), items.slice(-1));
	});

	it('filters boolean', async function() {
		let items = await kTesting.uSerial(Array.from(Array(3)).map(async function (e, index) {
			return await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
				WKXDocumentPublishStatusIsPublished: !!index,
			}));
		}));

		deepEqual(await mainModule.WKXDocumentActionQuery(WKXTestingStorageClient, {
			WKXDocumentPublishStatusIsPublished: false,
		}), items.slice(0, 1));
	});

});

describe('WKXDocumentActionPublish', function testWKXDocumentActionPublish() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, Object.assign(await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()), {
			WKXDocumentID: null,
		}))).WKCErrors, {
			WKXDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKXDocument', async function() {
		let itemCreated = await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject());

		let item = await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, itemCreated);

		deepEqual(item, Object.assign(itemCreated, {
			WKXDocumentModificationDate: item.WKXDocumentModificationDate,
			WKXDocumentPublishStatusIsPublished: item.WKXDocumentPublishStatusIsPublished,
			WKXDocumentPublicID: item.WKXDocumentPublicID,
		}));
	});

	it('sets WKXDocumentPublishStatusIsPublished to true', async function() {
		deepEqual((await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()))).WKXDocumentPublishStatusIsPublished, true);
	});

	it('sets WKXDocumentPublicID to 1 if none published', async function() {
		deepEqual((await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()))).WKXDocumentPublicID, '1');
	});

	it('sets WKXDocumentPublicID to 2 if one published and deleted', async function() {
		mainModule.WKXDocumentActionDelete(WKXTestingStorageClient, await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())));
		deepEqual((await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()))).WKXDocumentPublicID, '2');
	});

	it('sets WKXDocumentPublicID to 3 if two published and deleted', async function() {
		let serialPromises = async function () {
			return ['alfa', 'bravo'].reduce(function (coll, e) {
				return coll.then(async function () {
					return await mainModule.WKXDocumentActionDelete(WKXTestingStorageClient, (await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, (await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
						WKXDocumentBody: e,
					}))))).WKXDocumentID);
				});

				return coll;
			}, Promise.resolve());
		};

		await serialPromises();

		deepEqual((await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, (await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())))).WKXDocumentPublicID, '3');
	});

});

describe('WKXDocumentActionUnpublish', function testWKXDocumentActionUnpublish() {

	it('rejects if not object', async function() {
		await rejects(mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, null), /WKCErrorInputNotValid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		deepEqual((await mainModule.WKXDocumentActionUnpublish(WKXTestingStorageClient, Object.assign(await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())), {
			WKXDocumentID: null,
		}))).WKCErrors, {
			WKXDocumentID: [
				'WKCErrorNotString',
			],
		});
	});

	it('returns WKXDocument', async function() {
		let item = await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject()));

		deepEqual(await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, item), Object.assign(item, {
			WKXDocumentModificationDate: item.WKXDocumentModificationDate,
			WKXDocumentPublishStatusIsPublished: item.WKXDocumentPublishStatusIsPublished,
		}));
	});

	it('sets WKXDocumentPublishStatusIsPublished to false', async function() {
		deepEqual((await mainModule.WKXDocumentActionUnpublish(WKXTestingStorageClient, await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())))).WKXDocumentPublishStatusIsPublished, false);
	});	

});

describe('WKXDocumentActionGetPublicLinks', function testWKXDocumentActionGetPublicLinks() {

	it('returns hash', async function() {
		deepEqual(await mainModule.WKXDocumentActionGetPublicLinks(WKXTestingStorageClient), {});
	});

	it('excludes if WKXDocumentPublishStatusIsPublished false', async function() {
		await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject());
		deepEqual(await mainModule.WKXDocumentActionGetPublicLinks(WKXTestingStorageClient), {});
	});

	it('includes if WKXDocumentPublishStatusIsPublished true', async function() {
		let item = await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, (await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, kTesting.StubDocumentObject())));

		deepEqual(await mainModule.WKXDocumentActionGetPublicLinks(WKXTestingStorageClient), [[item.WKXDocumentBody, item.WKXDocumentPublicID]].reduce(function (coll, e) {
			coll[e[0]] = e[1];

			return coll;
		}, {}));
	});

	it('selects last updated note if duplicate title', async function() {
		await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, (await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
			WKXDocumentBody: `heading\nalfa`,
		}))));
		kTesting.uSleep(1);
		await mainModule.WKXDocumentActionPublish(WKXTestingStorageClient, (await mainModule.WKXDocumentActionCreate(WKXTestingStorageClient, Object.assign(kTesting.StubDocumentObject(), {
			WKXDocumentBody: `heading\nbravo`,
		}))));

		deepEqual(await mainModule.WKXDocumentActionGetPublicLinks(WKXTestingStorageClient), {
			heading: '2',
		});
	});

});

