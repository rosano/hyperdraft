const assert = require('assert');

const mainModule = require('./action.js');
const storageClient = require('../../WKCStorageClient/storage.js').WKCStorageClientForChangeDelegateMap({
	wkc_versions: null,
});

const kTesting = {
	StubVersionObject: function() {
		return {
			WKCVersionNoteID: 'bravo',
			WKCVersionBody: 'charlie',
		};
	},
};

describe('WKCVersionsActionCreate', function testWKCVersionsActionCreate() {

	it('rejects if not object', async function() {
		await assert.rejects(mainModule.WKCVersionsActionCreate(storageClient, null), /WKCErrorInputInvalid/);
	});

	it('returns object with WKCErrors if not valid', async function() {
		assert.deepEqual((await mainModule.WKCVersionsActionCreate(storageClient, Object.assign(kTesting.StubVersionObject(), {
			WKCVersionBody: null,
		}))).WKCErrors, {
			WKCVersionBody: [
				'WKCErrorNotString',
			],
		})
	});

	it('returns WKCVersion', async function() {
		let item = await mainModule.WKCVersionsActionCreate(storageClient, kTesting.StubVersionObject());

		assert.deepEqual(item, Object.assign(kTesting.StubVersionObject(), {
			WKCVersionID: item.WKCVersionID,
			WKCVersionDate: item.WKCVersionDate,
			'@context': item['@context'],
		}));
	});

	it('sets WKCVersionID to unique value', async function() {
		let items = []

		Array.from(Array(10)).forEach(async function (e) {
			items.push((await mainModule.WKCVersionsActionCreate(storageClient, kTesting.StubVersionObject())).WKCVersionID);
		});
		assert.deepEqual((new Set(items)).values(), items);
	});

	it('sets WKCVersionDate to now', async function() {
		assert.strictEqual(new Date() - (await mainModule.WKCVersionsActionCreate(storageClient, kTesting.StubVersionObject())).WKCVersionDate < 100, true);
	});

});
