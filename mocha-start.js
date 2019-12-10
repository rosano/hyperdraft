(function WKCMochaMongo() {
	var mongodbPackage = require('mongodb');

	before(function(done) {
		mongodbPackage.MongoClient.connect(process.env.WKC_DATABASE_URL, {
			useNewUrlParser: true,
		}, function(err, client) {
			if (err) {
				throw err;
			}

			global.WKCTestingMongoClient = client;

			done();
		});
	});

	after(function() {
		if (!global.WKCTestingMongoClient) {
			return;
		}

		global.WKCTestingMongoClient.close();
	});

	beforeEach(async function() {
		global.WKCTestingMongoClient.db(process.env.WKC_SHARED_DATABASE_NAME).dropDatabase();
	});
})();

const WKCStorageModule = require('./os-app/_shared/WKCStorageModule/main.js');
const WKCNoteStorage = require('./os-app/_shared/WKCNote/storage.js');
const WKCSettingStorage = require('./os-app/_shared/WKCSetting/storage.js');
const WKCVersionStorage = require('./os-app/_shared/WKCVersion/storage.js');

(function WKCMochaStorage() {
	if (process.env.OLSK_TESTING_BEHAVIOUR === 'true') {
		return;
	}

	const uSerial = function (inputData) {
		return inputData.reduce(async function (coll, e) {
			return e.then(Array.prototype.concat.bind(await coll));
		}, Promise.resolve([]));
	};

	before(function(done) {
		global.WKCTestingStorageClient = require('./os-app/_shared/WKCStorageClient/main.js').WKCStorageClient({
			modules: [
				WKCStorageModule.WKCStorageModule([
					WKCNoteStorage.WKCNoteStorage,
					WKCSettingStorage.WKCSettingStorage,
					WKCVersionStorage.WKCVersionStorage,
				].map(function (e) {
					return {
						WKCCollectionStorageGenerator: e,
						WKCCollectionChangeDelegate: null,
					};
				}))
			],
		});

		done();
	});

	beforeEach(async function() {
		await uSerial([
			'kvc_notes',
			'kvc_settings',
			'kvc_versions',
		].map(async function (e) {
			return await Promise.all(Object.keys(await global.WKCTestingStorageClient.wikiavec[e].listObjects()).map(global.WKCTestingStorageClient.wikiavec[e].deleteObject));
		}));
	});
})();
