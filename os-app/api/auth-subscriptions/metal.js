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
		return completionHandler(inputData);
	}

	var subscriptionDate = new Date();

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_subscriptions').insertOne(Object.assign(inputData, {
		WKCSubscriptionID: (new Date()) * 1,
		WKCSubscriptionDateCreated: subscriptionDate,
		WKCSubscriptionDateUpdated: subscriptionDate,
	}), function(err, result) {
		if (err) {
			throw new Error('WKCErrorDatabaseCreate');
		}

		var subscriptionObject = result.ops.pop();

		// modelLibrary.WKCModelsubscriptionsHiddenPropertyNames().forEach(function(obj) {
		// 	delete subscriptionObject[obj];
		// });

		// return res.json(subscriptionObject);

		return completionHandler(subscriptionObject);
	});
};
