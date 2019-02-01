/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var urlPackage = require('url');

//_ WKCSubscriptionHandlerFeedRSS

exports.WKCSubscriptionHandlerFeedRSS = function() {
	return 'FeedRSS';
};

//_ WKCSubscriptionHandlerFeedAtom

exports.WKCSubscriptionHandlerFeedAtom = function() {
	return 'FeedAtom';
};

//_ WKCSubscriptionHandlerFile

exports.WKCSubscriptionHandlerFile = function() {
	return 'File';
};

//_ WKCSubscriptionHandlerPage

exports.WKCSubscriptionHandlerPage = function() {
	return 'Page';
};

//_ WKCSubscriptionHandlerCustomTwitterTimeline

exports.WKCSubscriptionHandlerCustomTwitterTimeline = function() {
	return 'CustomTwitterTimeline';
};

//_ WKCSubscriptionHandlerCustomTwitterTimelineRequestCallback

exports.WKCSubscriptionHandlerCustomTwitterTimelineRequestCallback = function(databaseClient, completionHandler) {
	if (typeof completionHandler !== 'function') {
		throw new Error('WKCErrorInvalidInput');
	}

	return databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_settings').findOne({
		WKCSettingKey: 'kWKCSettingKeyCustomTwitterToken',
	}, function(err, result) {
		if (err) {
			return completionHandler(err);
		}

		if (!result) {
			return completionHandler(new Error('WKCErrorCustomTwitterMissingToken'));
		}

		var settingObject = result;

		exports.WKCSubscriptionHiddenPropertyNames().forEach(function(obj) {
			delete settingObject[obj];
		});

		return completionHandler(undefined, {
			auth: {
				bearer: settingObject.WKCSettingValue,
			},
		});
	});
};

//_ WKCSubscriptionHandlers

exports.WKCSubscriptionHandlers = function() {
	return [
		exports.WKCSubscriptionHandlerFeedRSS(),
		exports.WKCSubscriptionHandlerFeedAtom(),
		exports.WKCSubscriptionHandlerFile(),
		exports.WKCSubscriptionHandlerPage(),
		exports.WKCSubscriptionHandlerCustomTwitterTimeline(),
	];
};

//_ WKCModelSubscriptionPrepare

exports.WKCModelSubscriptionPrepare = function(inputData) {
	if (inputData.WKCSubscriptionFetchDate !== undefined) {
		inputData.WKCSubscriptionFetchDate = new Date(inputData.WKCSubscriptionFetchDate);
	}

	return inputData;
};

//_ WKCSubscriptionsModelErrorsFor

exports.WKCSubscriptionsModelErrorsFor = function(inputData, options) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInvalidInput');
	}

	var errors = {};

	if (!urlPackage.parse(inputData.WKCSubscriptionURL || '').hostname) {
		errors.WKCSubscriptionURL = [
			'WKCErrorNotFormatted',
		];
	}

	if (exports.WKCSubscriptionHandlers().indexOf(inputData.WKCSubscriptionHandler) === -1) {
		errors.WKCSubscriptionHandler = [
			'WKCErrorNotValid',
		];
	}

	if (inputData.WKCSubscriptionName) {
		if (typeof inputData.WKCSubscriptionName !== 'string') {
			errors.WKCSubscriptionName = [
				'WKCErrorNotString',
			];
		}
	}

	if (inputData.WKCSubscriptionBlurb) {
		if (typeof inputData.WKCSubscriptionBlurb !== 'string') {
			errors.WKCSubscriptionBlurb = [
				'WKCErrorNotString',
			];
		}
	}

	if (inputData.WKCSubscriptionFetchDate) {
		if (!(inputData.WKCSubscriptionFetchDate instanceof Date) || Number.isNaN(inputData.WKCSubscriptionFetchDate.getTime())) {
			errors.WKCSubscriptionFetchDate = [
				'WKCErrorNotDate',
			];
		}
	}

	if (inputData.WKCSubscriptionFetchContent) {
		if (typeof inputData.WKCSubscriptionFetchContent !== 'string') {
			errors.WKCSubscriptionFetchContent = [
				'WKCErrorNotString',
			];
		}
	}

	if (inputData.WKCSubscriptionErrorDate) {
		if (!(inputData.WKCSubscriptionErrorDate instanceof Date) || Number.isNaN(inputData.WKCSubscriptionErrorDate.getTime())) {
			errors.WKCSubscriptionErrorDate = [
				'WKCErrorNotDate',
			];
		}
	}

	if (inputData.WKCSubscriptionErrorMessage) {
		if (typeof inputData.WKCSubscriptionErrorMessage !== 'string') {
			errors.WKCSubscriptionErrorMessage = [
				'WKCErrorNotString',
			];
		}
	}

	if (inputData.WKCSubscriptionIsPaused) {
		if (typeof inputData.WKCSubscriptionIsPaused !== 'boolean') {
			errors.WKCSubscriptionIsPaused = [
				'WKCErrorNotBoolean',
			];
		}
	}

	if (options && options.WKCOptionValidatePresentOnly) {
		Object.keys(errors).forEach(function(e) {
			if (typeof inputData[e] === 'undefined') {
				delete errors[e];
			}
		});
	}

	return Object.keys(errors).length ? errors : null;
};

//_ WKCSubscriptionHiddenPropertyNames

exports.WKCSubscriptionHiddenPropertyNames = function() {
	return [
		'_id',
	];
};
