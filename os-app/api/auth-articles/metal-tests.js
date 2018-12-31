/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var assert = require('assert');

var metalLibrary = require('./metal');

const kTestingValidArticle = function() {
	return {
		WKCArticleSubscriptionID: 'alfa',
		WKCArticlePublishDate: new Date(),
	};
};

describe('WKCMetalArticlesCreate', function testWKCMetalArticlesCreate() {

	it('throws error if param2 not object', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalArticlesCreate(WKCTestingMongoClient, '', function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalArticlesCreate(WKCTestingMongoClient, {}, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns WKCErrors if not valid WKCArticle', function(done) {
		metalLibrary.WKCMetalArticlesCreate(WKCTestingMongoClient, Object.assign(kTestingValidArticle(), {
			WKCArticlePublishDate: new Date('alfa'),
		}), function(err, responseJSON) {
			assert.deepEqual(responseJSON.WKCErrors, {
				WKCArticlePublishDate: [
					'WKCErrorNotDate',
				],
			});

			done();
		});
	});

	it('returns WKCArticle', function(done) {
		const item = kTestingValidArticle();

		metalLibrary.WKCMetalArticlesCreate(WKCTestingMongoClient, item, function(err, responseJSON) {
			assert.deepEqual(responseJSON, Object.assign(item, {
				WKCArticleDateCreated: responseJSON.WKCArticleDateCreated,
				WKCArticleDateUpdated: responseJSON.WKCArticleDateUpdated,
			}));

			done();
		});
	});

});

describe('WKCMetalArticlesRead', function testWKCMetalArticlesRead() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalArticlesRead(WKCTestingMongoClient, 1, function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalArticlesRead(WKCTestingMongoClient, '1', null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns error if WKCArticleID not found', function(done) {
		metalLibrary.WKCMetalArticlesRead(WKCTestingMongoClient, '5c192c1edb2f6c6d8a78c9f0', function(err) {
			assert.deepEqual(err, new Error('WKCErrorNotFound'));

			done();
		});
	});

	it('returns WKCArticle', function(done) {
		metalLibrary.WKCMetalArticlesCreate(WKCTestingMongoClient, kTestingValidArticle(), function(err, articleObject) {

			metalLibrary.WKCMetalArticlesRead(WKCTestingMongoClient, articleObject.WKCArticleID, function(err, responseJSON) {
				assert.deepEqual(responseJSON, articleObject);

				done();
			});
		});
	});

});

describe('WKCMetalArticlesUpdate', function testWKCMetalArticlesUpdate() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalArticlesUpdate(WKCTestingMongoClient, 1, {}, function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not object', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalArticlesUpdate(WKCTestingMongoClient, '1', null, function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param4 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalArticlesUpdate(WKCTestingMongoClient, '1', {}, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns error if WKCArticleID not found', function(done) {
		metalLibrary.WKCMetalArticlesUpdate(WKCTestingMongoClient, '5c192c1edb2f6c6d8a78c9f0', kTestingValidArticle(), function(err) {
			assert.deepEqual(err, new Error('WKCErrorNotFound'));

			done();
		});
	});

	it('returns WKCErrors if not valid value', function(done) {
		metalLibrary.WKCMetalArticlesCreate(WKCTestingMongoClient, kTestingValidArticle(), function(err, articleObject) {
			metalLibrary.WKCMetalArticlesUpdate(WKCTestingMongoClient, articleObject.WKCArticleID, {
				WKCArticlePublishDate: new Date('alfa'),
			}, function(err, responseJSON) {
				assert.deepEqual(responseJSON.WKCErrors, {
					WKCArticlePublishDate: [
						'WKCErrorNotDate',
					],
				});

				done();
			});
		});
	});

	it('returns WKCArticle', function(done) {
		metalLibrary.WKCMetalArticlesCreate(WKCTestingMongoClient, Object.assign(kTestingValidArticle(), {
			WKCArticleTitle: 'alfa',
		}), function(err, articleObject) {
			metalLibrary.WKCMetalArticlesUpdate(WKCTestingMongoClient, articleObject.WKCArticleID, {
				WKCArticleTitle: 'bravo',
			}, function(err, responseJSON) {
				assert.deepEqual(responseJSON.WKCArticleTitle, 'bravo');

				done();
			});
		});
	});

});

describe('WKCMetalArticlesDelete', function testWKCMetalArticlesDelete() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalArticlesDelete(WKCTestingMongoClient, 1, function() {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalArticlesDelete(WKCTestingMongoClient, '1', null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns error if WKCArticleID not found', function(done) {
		metalLibrary.WKCMetalArticlesDelete(WKCTestingMongoClient, '5c192c1edb2f6c6d8a78c9f0', function(err) {
			assert.deepEqual(err, new Error('WKCErrorNotFound'));

			done();
		});
	});

	it('returns WKCArticle', function(done) {
		metalLibrary.WKCMetalArticlesCreate(WKCTestingMongoClient, kTestingValidArticle(), function(err, responseJSON) {
			metalLibrary.WKCMetalArticlesDelete(WKCTestingMongoClient, responseJSON.WKCArticleID, function(err, responseJSON) {
				assert.deepEqual(responseJSON, true);

				done();
			});
		});
	});

});

describe('WKCMetalArticlesSearch', function testWKCMetalArticlesSearch() {

	it('throws error if param2 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalArticlesSearch(WKCTestingMongoClient, null, function () {});
		}, /WKCErrorInvalidInput/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			metalLibrary.WKCMetalArticlesSearch(WKCTestingMongoClient, {}, null);
		}, /WKCErrorInvalidInput/);
	});

	it('returns all if param2 empty', function(done) {
		metalLibrary.WKCMetalArticlesCreate(WKCTestingMongoClient, kTestingValidArticle(), function(err, articleObject1) {
			metalLibrary.WKCMetalArticlesCreate(WKCTestingMongoClient, kTestingValidArticle(), function(err, articleObject2) {
				metalLibrary.WKCMetalArticlesSearch(WKCTestingMongoClient, {}, function(err, responseJSON) {
					assert.deepEqual(responseJSON, [articleObject1, articleObject2]);

					done();
				});
			});
		});
	});

	it('returns filtered if param2 filled', function(done) {
		metalLibrary.WKCMetalArticlesCreate(WKCTestingMongoClient, kTestingValidArticle(), function(err, articleObject1) {
			metalLibrary.WKCMetalArticlesCreate(WKCTestingMongoClient, Object.assign(kTestingValidArticle(), {
				WKCArticleIsArchived: true,
			}), function(err, articleObject2) {
				metalLibrary.WKCMetalArticlesSearch(WKCTestingMongoClient, {
					WKCArticleIsArchived: {
						'$ne': true,
					},
				}, function(err, responseJSON) {
					assert.deepEqual(responseJSON, [articleObject1]);

					done();
				});
			});
		});
	});

});
