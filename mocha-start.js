(function KVCMochaBrowerHost() {
	if (process.env.OLSK_TESTING_BEHAVIOUR !== 'true') {
		return;
	}

	browser.site = process.env.KVC_SHARED_REF_HOST + ':' + process.env.PORT;
})();


(function KVCMochaMongo() {
	if (!process.env.WKC_DATABASE_URL || !process.env.WKC_SHARED_DATABASE_NAME) {
		global.KVCTestingMongoSkipped = true;
		return;
	}

	var mongodbPackage = require('mongodb');

	before(function(done) {
		mongodbPackage.MongoClient.connect(process.env.WKC_DATABASE_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}, function(err, client) {
			if (err) {
				throw err;
			}

			global.KVCTestingMongoClient = client;

			done();
		});
	});

	after(function() {
		if (!global.KVCTestingMongoClient) {
			return;
		}

		global.KVCTestingMongoClient.close();
	});

	beforeEach(async function() {
		global.KVCTestingMongoClient.db(process.env.WKC_SHARED_DATABASE_NAME).dropDatabase();
	});
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

	const uSerial = function (inputData) {
		return inputData.reduce(async function (coll, e) {
			return e.then(Array.prototype.concat.bind(await coll));
		}, Promise.resolve([]));
	};

	const storageModule = KVC_Data.KVC_DataModule([
		KVCNoteStorage.KVCNoteStorageBuild,
		KVCSettingStorage.KVCSettingStorageBuild,
		KVCVersionStorage.KVCVersionStorageBuild,
	]);

	before(function() {
		global.KVCTestingStorageClient = new RemoteStorage({ modules: [ storageModule ] });

		global.KVCTestingStorageClient.access.claim(storageModule.name, 'rw');
	});

	beforeEach(async function() {
		await uSerial(Object.keys(global.KVCTestingStorageClient[storageModule.name]).map(async function (e) {
			return await Promise.all(Object.keys(await global.KVCTestingStorageClient[storageModule.name][e].KVCStorageList()).map(global.KVCTestingStorageClient[storageModule.name][e].KVCStorageDelete));
		}));
	});
})();
