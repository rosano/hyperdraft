/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ _WKCSettingsMetalSet

exports._WKCSettingsMetalSet = async function(databaseClient, param1, param2) {
	if (typeof param1 !== 'string') {
		return Promise.reject(new Error('WKCErrorInvalidInput'));
	}

	if (typeof param2 === 'undefined') {
		return Promise.reject(new Error('WKCErrorInvalidInput'));
	}

	let outputData = (await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_settings').findOneAndUpdate({
		WKCSettingsKey: param1,
	}, {
		'$set': {
			WKCSettingValue: param2,
		},
	}, {
		upsert: true,
		returnOriginal: false,
	})).value;

	return Promise.resolve(true);
};

//_ _WKCSettingsMetalGet

exports._WKCSettingsMetalGet = async function(databaseClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('WKCErrorInvalidInput'));
	}

	let outputData = await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('wkc_settings').findOne({
		WKCSettingsKey: inputData,
	});

	return Promise.resolve(outputData ? outputData.WKCSettingValue : undefined);
};

//_ WKCSettingsMetalProperty

exports.WKCSettingsMetalProperty = async function(databaseClient, param1, param2) {
	if (typeof param2 === 'undefined') {
		return await exports._WKCSettingsMetalGet(databaseClient, param1);
	}

	return await exports._WKCSettingsMetalSet(databaseClient, param1, param2);
};
