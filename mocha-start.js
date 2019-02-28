let moduleSlugs = [
	'wkc_notes',
	'wkc_versions',
	'wkc_settings',
];

const uSerial = function (inputData) {
	return inputData.reduce(async function (coll, e) {
		return e.then(Array.prototype.concat.bind(await coll));
	}, Promise.resolve([]));
};

var mongodbPackage = require('mongodb');

before(function(done) {
	mongodbPackage.MongoClient.connect(process.env.WKC_DATABASE_URL, {
		useNewUrlParser: true,
	}, function(err, client) {
		if (err) {
			throw err;
		}

		global.WKCTestingMongoClient = client;
		global.WKCTestingStorageClient = require('./os-app/_shared/WKCStorageClient/storage.js').WKCStorageClientForChangeDelegateMap(moduleSlugs.reduce(function (coll, e) {
			coll[e] = null;
			return coll;
		}, {}));

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
	await uSerial(moduleSlugs.map(async function (e) {
		return await Promise.all(Object.keys(await global.WKCTestingStorageClient[e].listObjects()).map(global.WKCTestingStorageClient[e].deleteObject));
	}));

	global.WKCTestingMongoClient.db(process.env.WKC_SHARED_DATABASE_NAME).dropDatabase();
});

process.on('unhandledRejection', (reason, promise) => {
	// console.log('Unhandledd Rejection at:', reason, promise)
	// Recommended: send the information to sentry.io
	// or whatever crash reporting service you use
});
