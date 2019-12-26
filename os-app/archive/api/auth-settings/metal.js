/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

//_ _KVCSettingsMetalSet

exports._KVCSettingsMetalSet = async function(databaseClient, param1, param2) {
	if (typeof param1 !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	if (typeof param2 === 'undefined') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	let outputData = (await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('kvc_settings').findOneAndUpdate({
		KVCSettingKey: param1,
	}, {
		'$set': {
			KVCSettingValue: param2,
		},
	}, {
		upsert: true,
		returnOriginal: false,
	})).value;

	return Promise.resolve(true);
};

//_ _KVCSettingsMetalGet

exports._KVCSettingsMetalGet = async function(databaseClient, inputData) {
	if (typeof inputData !== 'string') {
		return Promise.reject(new Error('KVCErrorInputNotValid'));
	}

	let outputData = await databaseClient.db(process.env.WKC_SHARED_DATABASE_NAME).collection('kvc_settings').findOne({
		KVCSettingKey: inputData,
	});

	return Promise.resolve(outputData ? outputData.KVCSettingValue : undefined);
};

//_ KVCSettingsMetalProperty

exports.KVCSettingsMetalProperty = async function(databaseClient, param1, param2) {
	if (typeof param2 === 'undefined') {
		return await exports._KVCSettingsMetalGet(databaseClient, param1);
	}

	return await exports._KVCSettingsMetalSet(databaseClient, param1, param2);
};
