var mongodbPackage = require('mongodb');

before(function(done) {
	mongodbPackage.MongoClient.connect(process.env.WKC_DATABASE_URL, function(err, client) {
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

beforeEach(function() {
	global.WKCTestingMongoClient.db(process.env.WKC_SHARED_DATABASE_NAME).dropDatabase();
});
