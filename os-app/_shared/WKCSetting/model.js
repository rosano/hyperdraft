export const WKCSettingModelErrorsFor = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('KVCErrorInputNotValid');
	}

	var errors = {};

	if (typeof inputData.WKCSettingKey !== 'string') {
		errors.WKCSettingKey = [
			'KVCErrorNotString',
		];
	} else if (inputData.WKCSettingKey.trim() === '') {
		errors.WKCSettingKey = [
			'KVCErrorNotFilled',
		];
	}

	if (typeof inputData.WKCSettingValue !== 'string') {
		errors.WKCSettingValue = [
			'KVCErrorNotString',
		];
	}

	return Object.entries(errors).length ? errors : null;
};
