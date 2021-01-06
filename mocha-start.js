const RemoteStorage = require('remotestoragejs');

const KVC_Data = require('./os-app/_shared/KVC_Data/main.js').default;
const KVCNoteStorage = require('./os-app/_shared/KVCNote/storage.js').default;
const KVCSettingStorage = require('./os-app/_shared/KVCSetting/storage.js').default;

(function KVCMochaStorage() {
	if (process.env.OLSK_SPEC_MOCHA_INTERFACE === 'true') {
		return;
	}

	const storageModule = KVC_Data.KVC_DataModule([
		KVCNoteStorage.KVCNoteStorageBuild,
		KVCSettingStorage.KVCSettingStorageBuild,
	], {
		OLSKOptionIncludeDebug: true,
	});

	before(function() {
		global.KVCTestingStorageClient = new RemoteStorage({ modules: [ storageModule ] });

		global.KVCTestingStorageClient.access.claim(storageModule.name, 'rw');
	});

	beforeEach(function() {
		return global.KVCTestingStorageClient[storageModule.name].__DEBUG.__OLSKRemoteStorageReset();
	});
})();

(function KVCMochaStubs() {
	Object.entries({
		StubNoteObjectValid() {
			return {
				KVCNoteID: 'alfa',
				KVCNoteBody: 'bravo',
				KVCNoteCreationDate: new Date('2019-02-23T13:56:36Z'),
				KVCNoteModificationDate: new Date('2019-02-23T13:56:36Z'),
			};
		},

		StubSettingObjectValid() {
			return {
				KVCSettingKey: 'alfa',
				KVCSettingValue: 'bravo',
			};
		},
		
		uSerial (inputData) {
			return inputData.reduce(async function (coll, e) {
				return e.then(Array.prototype.concat.bind(await coll));
			}, Promise.resolve([]));
		},

		uSleep (inputData) {
			let endTime = new Date().getTime();
			while (new Date().getTime() < endTime + inputData) {}
		},
	}).map(function (e) {
		return global[e.shift()]  = e.pop();
	});
})();
