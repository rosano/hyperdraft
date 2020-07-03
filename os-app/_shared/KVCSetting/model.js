const mod = {

	KVCSettingModelErrorsFor (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		const errors = {};

		if (typeof inputData.KVCSettingKey !== 'string') {
			errors.KVCSettingKey = [
				'KVCErrorNotString',
			];
		} else if (inputData.KVCSettingKey.trim() === '') {
			errors.KVCSettingKey = [
				'KVCErrorNotFilled',
			];
		}

		if (typeof inputData.KVCSettingValue !== 'string') {
			errors.KVCSettingValue = [
				'KVCErrorNotString',
			];
		}

		return Object.entries(errors).length ? errors : null;
	},

};

export default mod;
