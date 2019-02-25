//_ RSModulesSharedJSONSchemaForErrors

exports.RSModulesSharedJSONSchemaForErrors = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInputInvalid');
	}

	return {
		type: 'object',
		properties: Object.entries(inputData).reduce(function (coll, [key, val]) {
			coll[key] = {};

			coll[key].type = [...val].shift().replace('WKCErrorNot', '').toLowerCase().replace('filled', 'string');

			if (coll[key].type === 'date') {
				coll[key].type = 'string';
				coll[key].format = 'date-time';
			}

			return coll;
		}, {}),
		required: Object.entries(inputData).filter(function ([key, val]) {
			return !val.includes('__RSOptional');
		}).map(function ([key, val]) {
			return key;
		}),
	};
};
