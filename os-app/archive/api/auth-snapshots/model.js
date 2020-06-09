/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ WKCSnapshotsModelErrorsFor

exports.WKCSnapshotsModelErrorsFor = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('KVCErrorInputNotValid');
	}

	const errors = {};

	if (!inputData.WKCSnapshotSubscriptionID) {
		errors.WKCSnapshotSubscriptionID = [
			'KVCErrorNotUnempty',
		];
	}

	if (typeof inputData.WKCSnapshotSubscriptionID !== 'string') {
		errors.WKCSnapshotSubscriptionID = [
			'KVCErrorNotString',
		];
	}

	if (typeof inputData.WKCSnapshotBody !== 'string') {
		errors.WKCSnapshotBody = [
			'KVCErrorNotString',
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
