const assert = require('assert');

return;

const mainModule = require('./rs-module.js');

const RemoteStorage = require('remotestoragejs');

const kTesting = {
	StubRemoteStorage: function(inputData) {
		let e = mainModule(inputData);

		let outputData = new RemoteStorage({
			modules: [e],
		});

		outputData.access.claim(e.name, 'rw');

		return outputData;
	},
	StubNoteObjectValid: function() {
		return {
			WKCNoteID: 'alfa',
			WKCNoteBody: 'bravo',
			WKCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
			WKCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

beforeEach(async function() {
	let remoteStorage = kTesting.StubRemoteStorage();
	await Promise.all(Object.keys(await remoteStorage.wkc_notes.listObjects()).map(remoteStorage.wkc_notes.deleteObject));
});

describe('OLSKChangeDelegateProtocol', function testOLSKChangeDelegateProtocol() {

	it('calls OLSKChangeDelegateAdd on create', function(done) {
		kTesting.StubRemoteStorage({
			OLSKChangeDelegateAdd: function (inputData) {
				assert.deepEqual(inputData, Object.assign(kTesting.StubNoteObjectValid(), {
					WKCNoteCreationDate: inputData.WKCNoteCreationDate,
					WKCNoteModificationDate: inputData.WKCNoteModificationDate,
					'@context': inputData['@context'],
				}));

				done();
			},
		}).wkc_notes.writeObject('alfa', kTesting.StubNoteObjectValid());
	});

	it('calls OLSKChangeDelegateUpdate on update', async function(done) {
		let remoteStorage = kTesting.StubRemoteStorage({
			OLSKChangeDelegateUpdate: function (inputData) {
				assert.deepEqual(inputData.WKCNoteBody, 'charlie');
				
				done();
			},
		});

		let item = remoteStorage.wkc_notes.writeObject('alfa', kTesting.StubNoteObjectValid());

		remoteStorage.wkc_notes.writeObject(item.WKCNoteID, Object.assign(item, {
			WKCNoteBody: 'charlie',
		}));
	});

	it('calls OLSKChangeDelegateRemove on delete', async function(done) {
		let remoteStorage = kTesting.StubRemoteStorage({
			OLSKChangeDelegateRemove: function (inputData) {
				assert.deepEqual(inputData.WKCNoteID, 'alfa');
				
				done();
			},
		});

		remoteStorage.wkc_notes.deleteObject((await remoteStorage.wkc_notes.writeObject('alfa', kTesting.StubNoteObjectValid())).WKCNoteID);
	});

});
