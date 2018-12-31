/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var urlPackage = require('url');

//_ WKCSubscriptionTypeFeedRSS

exports.WKCSubscriptionTypeFeedRSS = function() {
	return 'FeedRSS';
};

//_ WKCSubscriptionTypeFeedAtom

exports.WKCSubscriptionTypeFeedAtom = function() {
	return 'FeedAtom';
};

//_ WKCSubscriptionTypeFile

exports.WKCSubscriptionTypeFile = function() {
	return 'File';
};

//_ WKCSubscriptionTypePage

exports.WKCSubscriptionTypePage = function() {
	return 'Page';
};

//_ WKCSubscriptionTypeCustomTwitter

exports.WKCSubscriptionTypeCustomTwitter = function() {
	return 'CustomTwitter';
};

//_ WKCSubscriptionTypes

exports.WKCSubscriptionTypes = function() {
	return [
		exports.WKCSubscriptionTypeFeedRSS(),
		exports.WKCSubscriptionTypeFeedAtom(),
		exports.WKCSubscriptionTypeFile(),
		exports.WKCSubscriptionTypePage(),
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

	if (exports.WKCSubscriptionTypes().indexOf(inputData.WKCSubscriptionType) === -1) {
		errors.WKCSubscriptionType = [
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

	if (options && options.WKCModelValidatePresentOnly) {
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
