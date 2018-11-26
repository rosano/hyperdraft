/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var modelLibrary = require('./model');

//_ WKCMetalSubscriptionsCreate

exports.WKCMetalSubscriptionsCreate = function(databaseClient, inputData, completionHandler) {
	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	if (!modelLibrary.WKCModelInputDataIsSubscriptionObject(inputData)) {
		return completionHandler(null, inputData);
	}

	var subscriptionDate = new Date();

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').insertOne(Object.assign(inputData, {
		WKCSubscriptionID: (new Date()) * 1,
		WKCSubscriptionDateCreated: subscriptionDate,
		WKCSubscriptionDateUpdated: subscriptionDate,
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

exports.WKCMetalSubscriptionsUpdate = function(databaseClient, inputData1, inputData2, completionHandler) {
	if (typeof inputData2 !== 'object' || inputData2 === null) {
		throw new Error('WKCErrorInvalidInput');
	}

	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	if (!modelLibrary.WKCModelInputDataIsSubscriptionObject(inputData2)) {
		return completionHandler(null, inputData2);
	}

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').findOneAndUpdate({
		WKCSubscriptionID: inputData1,
	},
	{
		'$set': Object.assign(inputData2, {
			WKCSubscriptionDateUpdated: new Date(),
		}),
	}, function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		if (!result.value) {
			return completionHandler(new Error('WKCErrorNotFound'));
		}

		var subscriptionObject = Object.assign(result.value, inputData2);

		modelLibrary.WKCSubscriptionHiddenPropertyNames().forEach(function(obj) {
			delete subscriptionObject[obj];
		});

		return completionHandler(null, subscriptionObject);
	});
};
