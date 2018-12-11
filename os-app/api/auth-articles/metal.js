/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var modelLibrary = require('./model');

//_ WKCMetalArticlesCreate

exports.WKCMetalArticlesCreate = function(databaseClient, inputData, completionHandler) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	if (!modelLibrary.WKCModelInputDataIsArticleObject(modelLibrary.WKCModelArticlePrepare(inputData))) {
		return completionHandler(null, inputData);
	}

	var currentDate = new Date();

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_articles').insertOne(Object.assign(inputData, {
		WKCArticleID: parseInt(new Date() * 1).toString(),
		WKCArticleDateCreated: currentDate,
		WKCArticleDateUpdated: currentDate,
	}), function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		var articleObject = result.ops.pop();

		modelLibrary.WKCArticleHiddenPropertyNames().forEach(function(obj) {
			delete articleObject[obj];
		});

		return completionHandler(null, articleObject);
	});
};

//_ WKCMetalArticlesRead

exports.WKCMetalArticlesRead = function(databaseClient, inputData, completionHandler) {
	if (typeof inputData !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_articles').findOne({
		WKCArticleID: inputData,
	}, function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		if (!result) {
			return completionHandler(new Error('WKCErrorNotFound'));
		}

		var articleObject = result;

		modelLibrary.WKCArticleHiddenPropertyNames().forEach(function(obj) {
			delete articleObject[obj];
		});

		return completionHandler(null, articleObject);
	});
};

//_ WKCMetalArticlesUpdate

exports.WKCMetalArticlesUpdate = function(databaseClient, inputData1, inputData2, completionHandler) {
	if (typeof inputData1 !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof inputData2 !== 'object' || inputData2 === null) {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	if (!modelLibrary.WKCModelInputDataIsArticleObject(inputData2)) {
		return completionHandler(null, inputData2);
	}

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_articles').findOneAndUpdate({
		WKCArticleID: inputData1,
	},
	{
		'$set': Object.assign(inputData2, {
			WKCArticleDateUpdated: new Date(),
		}),
	}, function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		if (!result.value) {
			return completionHandler(new Error('WKCErrorNotFound'));
		}

		var articleObject = Object.assign(result.value, inputData2);

		modelLibrary.WKCArticleHiddenPropertyNames().forEach(function(obj) {
			delete articleObject[obj];
		});

		return completionHandler(null, articleObject);
	});
};

//_ WKCMetalArticlesDelete

exports.WKCMetalArticlesDelete = function(databaseClient, inputData, completionHandler) {
	if (typeof inputData !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_articles').deleteOne({
		WKCArticleID: inputData,
	}, function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		if (!result.result.n) {
			return completionHandler(new Error('WKCErrorNotFound'));
		}

		return completionHandler(null, true);
	});
};

//_ WKCMetalArticlesSearch

exports.WKCMetalArticlesSearch = function(databaseClient, inputData, completionHandler) {
	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_articles').find({}).project(modelLibrary.WKCArticleHiddenPropertyNames().reduce(function(hash, e) {
		hash[e] = 0;
		
		return hash;
	}, {})).toArray(function(err, items) {
		if (err) {
			return completionHandler(err);
		}

		return completionHandler(null, items);
	});
};
