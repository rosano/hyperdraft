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
			WKCNoteDateCreated: new Date('2019-02-23T13:56:36Z'),
			RSNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
		};
	},
};

beforeEach(async function() {
	let remoteStorage = kTesting.StubRemoteStorage();
	await Promise.all(Object.keys(await remoteStorage.rsp_notes.listObjects()).map(remoteStorage.rsp_notes.deleteObject));
});

describe('RSChangeDelegateProtocol', function testRSChangeDelegateProtocol() {

	it('calls RSChangeDelegateAdd on create', function(done) {
		kTesting.StubRemoteStorage({
			RSChangeDelegateAdd: function (inputData) {
				assert.deepEqual(inputData, Object.assign(kTesting.StubNoteObjectValid(), {
					WKCNoteDateCreated: inputData.WKCNoteDateCreated,
					RSNoteModificationDate: inputData.RSNoteModificationDate,
					'@context': inputData['@context'],
				}));

				done();
			},
		}).rsp_notes.writeObject('alfa', kTesting.StubNoteObjectValid());
	});

	it('calls RSChangeDelegateUpdate on update', async function(done) {
		let remoteStorage = kTesting.StubRemoteStorage({
			RSChangeDelegateUpdate: function (inputData) {
				assert.deepEqual(inputData.WKCNoteBody, 'charlie');
				
				done();
			},
		});

		let item = remoteStorage.rsp_notes.writeObject('alfa', kTesting.StubNoteObjectValid());

		remoteStorage.rsp_notes.writeObject(item.WKCNoteID, Object.assign(item, {
			WKCNoteBody: 'charlie',
		}));
	});

	it('calls RSChangeDelegateRemove on delete', async function(done) {
		let remoteStorage = kTesting.StubRemoteStorage({
			RSChangeDelegateRemove: function (inputData) {
				assert.deepEqual(inputData.WKCNoteID, 'alfa');
				
				done();
			},
		});

		remoteStorage.rsp_notes.deleteObject((await remoteStorage.rsp_notes.writeObject('alfa', kTesting.StubNoteObjectValid())).WKCNoteID);
	});

});
