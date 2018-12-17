/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var modelLibrary = require('./model');

//_ WKCMetalSubscriptionsCreate

exports.WKCMetalSubscriptionsCreate = function(databaseClient, inputData, completionHandler) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	if (!modelLibrary.WKCModelInputDataIsSubscriptionObject(modelLibrary.WKCModelSubscriptionPrepare(inputData))) {
		return completionHandler(null, inputData);
	}

	var currentDate = new Date();

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').insertOne(Object.assign(inputData, {
		WKCSubscriptionID: parseInt(new Date() * 1).toString(),
		WKCSubscriptionDateCreated: currentDate,
		WKCSubscriptionDateUpdated: currentDate,
	}), function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		var subscriptionObject = result.ops.pop();

		modelLibrary.WKCSubscriptionHiddenPropertyNames().forEach(function(obj) {
			delete subscriptionObject[obj];
		});

		return completionHandler(null, subscriptionObject);
	});
};

//_ WKCMetalSubscriptionsRead

exports.WKCMetalSubscriptionsRead = function(databaseClient, inputData, completionHandler) {
	if (typeof inputData !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').findOne({
		WKCSubscriptionID: inputData,
	}, function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		if (!result) {
			return completionHandler(new Error('WKCErrorNotFound'));
		}

		var subscriptionObject = result;

		modelLibrary.WKCSubscriptionHiddenPropertyNames().forEach(function(obj) {
			delete subscriptionObject[obj];
		});

		return completionHandler(null, subscriptionObject);
	});
};

//_ WKCMetalSubscriptionsUpdate

exports.WKCMetalSubscriptionsUpdate = function(databaseClient, objectID, inputData, completionHandler) {
	if (typeof objectID !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	if (!modelLibrary.WKCModelInputDataIsSubscriptionObject(inputData, {
		WKCModelValidatePresentOnly: true,
	})) {
		return completionHandler(null, inputData);
	}

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').findOneAndUpdate({
		WKCSubscriptionID: objectID,
	}, {
		'$set': Object.assign(inputData, {
			WKCSubscriptionDateUpdated: new Date(),
		}),
	}, {
		returnOriginal: false,
	}, function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		if (!result.value) {
			return completionHandler(new Error('WKCErrorNotFound'));
		}

		modelLibrary.WKCSubscriptionHiddenPropertyNames().forEach(function(obj) {
			delete result.value[obj];
		});

		return completionHandler(null, result.value);
	});
};

//_ WKCMetalSubscriptionsDelete

exports.WKCMetalSubscriptionsDelete = function(databaseClient, inputData, completionHandler) {
	if (typeof inputData !== 'string') {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').deleteOne({
		WKCSubscriptionID: inputData,
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

//_ WKCMetalSubscriptionsSearch

exports.WKCMetalSubscriptionsSearch = function(databaseClient, inputData, completionHandler) {
	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').find({}).project(modelLibrary.WKCSubscriptionHiddenPropertyNames().reduce(function(hash, e) {
		hash[e] = 0;
		
		return hash;
	}, {})).toArray(function(err, items) {
		if (err) {
			return completionHandler(err);
		}

		return completionHandler(null, items);
	});
};

//_ WKCMetalSubscriptionsNeedingFetch

exports.WKCMetalSubscriptionsNeedingFetch = function(databaseClient, completionHandler) {
	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').find({
		'$and': [
			{
				'$or': [
					{
						WKCSubscriptionFetchDate: {
							'$lte': new Date(new Date() - 1000 * 60 * 60),
						},
					},
					{
						WKCSubscriptionFetchDate: null,
					},
					],
			},
			{
				'$or': [
					{
						WKCSubscriptionErrorDate: {
							'$lte': new Date(new Date() - 1000 * 60 * 60),
						},
					},
					{
						WKCSubscriptionErrorDate: null,
					},
					],
			},
			],
	}).project(modelLibrary.WKCSubscriptionHiddenPropertyNames().reduce(function(hash, e) {
		hash[e] = 0;
		
		return hash;
	}, {})).toArray(function(err, items) {
		if (err) {
			return completionHandler(err);
		}

		return completionHandler(null, items);
	});
};
