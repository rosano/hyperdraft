/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ WKCModelArticlePrepare

exports.WKCModelArticlePrepare = function(inputData) {
	if (inputData.WKCArticlePublishDate) {
		inputData.WKCArticlePublishDate = new Date(inputData.WKCArticlePublishDate);
	}

	if (inputData.WKCArticleDateDiscarded) {
		inputData.WKCArticleDateDiscarded = new Date(inputData.WKCArticleDateDiscarded);
	}

	return inputData;
};

//_ WKCModelInputDataIsArticleObject

exports.WKCModelInputDataIsArticleObject = function(inputData, options) {
	if (typeof inputData !== 'object' || inputData === null) {
		return false;
	}

	var errors = {};

	if (typeof inputData.WKCArticleSubscriptionID !== 'string' || !inputData.WKCArticleSubscriptionID) {
		errors.WKCArticleSubscriptionID = [
			'WKCErrorNotValid',
		];
	}

	if (!(inputData.WKCArticlePublishDate instanceof Date) || Number.isNaN(inputData.WKCArticlePublishDate.getTime())) {
		errors.WKCArticlePublishDate = [
			'WKCErrorNotDate',
		];
	}

	if (inputData.WKCArticleTitle) {
		if (typeof inputData.WKCArticleTitle !== 'string') {
			errors.WKCArticleTitle = [
				'WKCErrorNotString',
			];
		}
	}

	if (inputData.WKCArticleBody) {
		if (typeof inputData.WKCArticleBody !== 'string') {
			errors.WKCArticleBody = [
				'WKCErrorNotString',
			];
		}
	}

	if (inputData.WKCArticleSnippet) {
		if (typeof inputData.WKCArticleSnippet !== 'string') {
			errors.WKCArticleSnippet = [
				'WKCErrorNotString',
			];
		}
	}

	if (inputData.WKCArticleIsRead) {
		if (typeof inputData.WKCArticleIsRead !== 'boolean') {
			errors.WKCArticleIsRead = [
				'WKCErrorNotBoolean',
			];
		}
	}

	if (inputData.WKCArticleIsArchived) {
		if (typeof inputData.WKCArticleIsArchived !== 'boolean') {
			errors.WKCArticleIsArchived = [
				'WKCErrorNotBoolean',
			];
		}
	}

	if (inputData.WKCArticleIsDiscarded) {
		if (typeof inputData.WKCArticleIsDiscarded !== 'boolean') {
			errors.WKCArticleIsDiscarded = [
				'WKCErrorNotBoolean',
			];
		}
	}

	if (inputData.WKCArticleDateDiscarded) {
		if (!(inputData.WKCArticleDateDiscarded instanceof Date) || Number.isNaN(inputData.WKCArticleDateDiscarded.getTime())) {
			errors.WKCArticleDateDiscarded = [
				'WKCErrorNotDate',
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

	if (Object.keys(errors).length) {
		inputData.WKCErrors = errors;

		return false;
	}

	return true;
};

//_ WKCArticleHiddenPropertyNames

exports.WKCArticleHiddenPropertyNames = function() {
	return [
		'_id',
	];
};
