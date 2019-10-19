export const WKCSettingModelErrorsFor = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInputNotValid');
	}

	var errors = {};

	if (typeof inputData.WKCSettingKey !== 'string') {
		errors.WKCSettingKey = [
			'WKCErrorNotString',
		];
	} else if (inputData.WKCSettingKey.trim() === '') {
		errors.WKCSettingKey = [
			'WKCErrorNotFilled',
		];
	}

	if (typeof inputData.WKCSettingValue !== 'string') {
		errors.WKCSettingValue = [
			'WKCErrorNotString',
		];
	}

	return Object.entries(errors).length ? errors : null;
};
