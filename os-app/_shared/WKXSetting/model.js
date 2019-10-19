export const WKXSettingModelErrorsFor = function(inputData) {
	if (typeof inputData !== 'object' || inputData === null) {
		throw new Error('WKCErrorInputNotValid');
	}

	var errors = {};

	if (typeof inputData.WKXSettingKey !== 'string') {
		errors.WKXSettingKey = [
			'WKCErrorNotString',
		];
	} else if (inputData.WKXSettingKey.trim() === '') {
		errors.WKXSettingKey = [
			'WKCErrorNotFilled',
		];
	}

	if (typeof inputData.WKXSettingValue !== 'string') {
		errors.WKXSettingValue = [
			'WKCErrorNotString',
		];
	}

	return Object.entries(errors).length ? errors : null;
};
