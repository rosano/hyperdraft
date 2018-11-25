/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

var urlPackage = require('url');

//_ WKCModelInputDataIsSubscriptionObject

exports.WKCModelInputDataIsSubscriptionObject = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		return false;
	}

	var errors = {};

	if (!urlPackage.parse(inputData.WKCSubscriptionURL || '').hostname) {
		errors.WKCSubscriptionURL = [
			'WKCErrorNotFormatted',
		];
	}

	if (Object.keys(errors).length) {
		inputData.WKCErrors = errors;
		
		return false;
	}

	return true;
};
