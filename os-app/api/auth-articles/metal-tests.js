/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

const assert = require('assert');

const mainModule = require('./metal.js');

const StubValidArticle = function() {
	return {
		WKCArticleSubscriptionID: 'alfa',
		WKCArticlePublishDate: new Date('2019-01-06T15:12:22.333Z'),
	};
};

describe('WKCMetalArticlesCreate', function testWKCMetalArticlesCreate() {

	it('throws error if param2 not object', function() {
		assert.throws(function() {
			mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, '', function() {});
		}, /WKCErrorInputNotValid/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, {}, null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns WKCErrors if not valid WKCArticle', function(done) {
		mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, Object.assign(StubValidArticle(), {
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
		mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, StubValidArticle(), function(err, responseJSON) {
			assert.deepEqual(responseJSON, Object.assign(StubValidArticle(), {
				WKCArticleID: responseJSON.WKCArticleID,
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
			mainModule.WKCMetalArticlesRead(WKCTestingMongoClient, 1, function() {});
		}, /WKCErrorInputNotValid/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			mainModule.WKCMetalArticlesRead(WKCTestingMongoClient, '1', null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns error if WKCArticleID not found', function(done) {
		mainModule.WKCMetalArticlesRead(WKCTestingMongoClient, '5c192c1edb2f6c6d8a78c9f0', function(err) {
			assert.deepEqual(err, new Error('WKCErrorNotFound'));

			done();
		});
	});

	it('returns WKCArticle', function(done) {
		mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, StubValidArticle(), function(err, articleObject) {

			mainModule.WKCMetalArticlesRead(WKCTestingMongoClient, articleObject.WKCArticleID, function(err, responseJSON) {
				assert.deepEqual(responseJSON, articleObject);

				done();
			});
		});
	});

});

describe('WKCMetalArticlesUpdate', function testWKCMetalArticlesUpdate() {

	it('throws error if param2 not string', function() {
		assert.throws(function() {
			mainModule.WKCMetalArticlesUpdate(WKCTestingMongoClient, 1, {}, function() {});
		}, /WKCErrorInputNotValid/);
	});

	it('throws error if param3 not object', function() {
		assert.throws(function() {
			mainModule.WKCMetalArticlesUpdate(WKCTestingMongoClient, '1', null, function() {});
		}, /WKCErrorInputNotValid/);
	});

	it('throws error if param4 not function', function() {
		assert.throws(function() {
			mainModule.WKCMetalArticlesUpdate(WKCTestingMongoClient, '1', {}, null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns error if WKCArticleID not found', function(done) {
		mainModule.WKCMetalArticlesUpdate(WKCTestingMongoClient, '5c192c1edb2f6c6d8a78c9f0', StubValidArticle(), function(err) {
			assert.deepEqual(err, new Error('WKCErrorNotFound'));

			done();
		});
	});

	it('returns WKCErrors if not valid value', function(done) {
		mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, StubValidArticle(), function(err, articleObject) {
			mainModule.WKCMetalArticlesUpdate(WKCTestingMongoClient, articleObject.WKCArticleID, {
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
		mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, Object.assign(StubValidArticle(), {
			WKCArticleTitle: 'alfa',
		}), function(err, articleObject) {
			mainModule.WKCMetalArticlesUpdate(WKCTestingMongoClient, articleObject.WKCArticleID, {
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
			mainModule.WKCMetalArticlesDelete(WKCTestingMongoClient, 1, function() {});
		}, /WKCErrorInputNotValid/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			mainModule.WKCMetalArticlesDelete(WKCTestingMongoClient, '1', null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns error if WKCArticleID not found', function(done) {
		mainModule.WKCMetalArticlesDelete(WKCTestingMongoClient, '5c192c1edb2f6c6d8a78c9f0', function(err) {
			assert.deepEqual(err, new Error('WKCErrorNotFound'));

			done();
		});
	});

	it('returns WKCArticle', function(done) {
		mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, StubValidArticle(), function(err, responseJSON) {
			mainModule.WKCMetalArticlesDelete(WKCTestingMongoClient, responseJSON.WKCArticleID, function(err, responseJSON) {
				assert.deepEqual(responseJSON, true);

				done();
			});
		});
	});

});

describe('WKCMetalArticlesSearch', function testWKCMetalArticlesSearch() {

	it('throws error if param2 not function', function() {
		assert.throws(function() {
			mainModule.WKCMetalArticlesSearch(WKCTestingMongoClient, null, function () {});
		}, /WKCErrorInputNotValid/);
	});

	it('throws error if param3 not function', function() {
		assert.throws(function() {
			mainModule.WKCMetalArticlesSearch(WKCTestingMongoClient, {}, null);
		}, /WKCErrorInputNotValid/);
	});

	it('throws error if param4 not object', function() {
		assert.throws(function() {
			mainModule.WKCMetalArticlesSearch(WKCTestingMongoClient, {}, function() {}, null);
		}, /WKCErrorInputNotValid/);
	});

	it('returns all if param2 empty', function(done) {
		mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, StubValidArticle(), function(err, articleObject1) {
			mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, StubValidArticle(), function(err, articleObject2) {
				mainModule.WKCMetalArticlesSearch(WKCTestingMongoClient, {}, function(err, responseJSON) {
					assert.deepEqual(responseJSON, [articleObject2, articleObject1]);

					done();
				});
			});
		});
	});

	it('returns filtered if param2 filled', function(done) {
		mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, StubValidArticle(), function(err, articleObject1) {
			mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, Object.assign(StubValidArticle(), {
				WKCArticleIsArchived: true,
			}), function(err, articleObject2) {
				mainModule.WKCMetalArticlesSearch(WKCTestingMongoClient, {
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

	context('WKCOptionLimit', function () {

		it('throws error if not int', function() {
			assert.throws(function() {
				mainModule.WKCMetalArticlesSearch(WKCTestingMongoClient, {}, function() {}, {
					WKCOptionLimit: '1',
				});
			}, /WKCErrorInputNotValid/);
		});

		it('returns limited if WKCOptionLimit set', function(done) {
			mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, StubValidArticle(), function(err, articleObject1) {
				mainModule.WKCMetalArticlesCreate(WKCTestingMongoClient, StubValidArticle(), function(err, articleObject2) {
					mainModule.WKCMetalArticlesSearch(WKCTestingMongoClient, {}, function(err, responseJSON) {
						assert.deepEqual(responseJSON, [articleObject2]);

						done();
					}, {
						WKCOptionLimit: 1,
					});
				});
			});
		});

	});

});
