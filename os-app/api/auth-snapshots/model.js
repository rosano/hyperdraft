/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ WKCSnapshotsModelErrorsFor

exports.WKCSnapshotsModelErrorsFor = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInvalidInput');
	}

	var errors = {};

	if (typeof inputData.WKCSnapshotBody !== 'string') {
		errors.WKCSnapshotBody = [
			'WKCErrorNotString',
		];
	}

	return Object.keys(errors).length ? errors : null;
};

//_ WKCSnapshotHiddenPropertyNames

exports.WKCSnapshotHiddenPropertyNames = function() {
	return [
		'_id',
	];
};
