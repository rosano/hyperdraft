(function KVCMochaBrowerHost() {
	if (process.env.OLSK_TESTING_BEHAVIOUR !== 'true') {
		return;
	}

	browser.site = process.env.KVC_SHARED_REF_HOST + ':' + process.env.PORT;
})();

const RemoteStorage = require('remotestoragejs');

const KVC_Data = require('./os-app/_shared/KVC_Data/main.js').default;
const KVCNoteStorage = require('./os-app/_shared/KVCNote/storage.js').default;
const KVCSettingStorage = require('./os-app/_shared/KVCSetting/storage.js').default;
const KVCVersionStorage = require('./os-app/_shared/KVCVersion/storage.js').default;

(function KVCMochaStorage() {
	if (process.env.OLSK_TESTING_BEHAVIOUR === 'true') {
		return;
	}

	const storageModule = KVC_Data.KVC_DataModule([
		KVCNoteStorage.KVCNoteStorageBuild,
		KVCSettingStorage.KVCSettingStorageBuild,
		KVCVersionStorage.KVCVersionStorageBuild,
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

		StubVersionObjectValid() {
			return {
				KVCVersionID: 'alfa',
				KVCVersionNoteID: 'bravo',
				KVCVersionBody: '',
				KVCVersionDate: new Date('2019-02-23T13:56:36Z'),
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

		uSerial2 (inputData) {
			return inputData.reduce(function (coll, e) {
				return coll.then(e);
			}, Promise.resolve());
		},

		uLaunch (inputData) {
			return uSerial2([
				function () {
					return browser.pressButton('.OLSKAppToolbarLauncherButton');
				},
				function () {
					return browser.fill('.LCHLauncherFilterInput', inputData);
				},
				function () {
					return browser.click('.LCHLauncherPipeItem');
				},
			]);
		},

		uSleep (inputData) {
			let endTime = new Date().getTime();
			while (new Date().getTime() < endTime + inputData) {}
		},
	}).map(function (e) {
		return global[e.shift()]  = e.pop();
	});
})();
