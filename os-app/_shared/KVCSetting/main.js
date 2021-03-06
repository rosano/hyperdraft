const mod = {

	KVCSettingErrors (inputData, options = {}) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		const errors = {};

		if (typeof inputData.KVCSettingKey !== 'string') {
			errors.KVCSettingKey = [
				'KVCErrorNotString',
			];
		} else if (!inputData.KVCSettingKey.trim()) {
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

	KVCSettingDirectory () {
		return 'kvc_settings';
	},

	KVCSettingPath (inputData) {
		return `${ mod.KVCSettingDirectory() }/${ inputData.KVCSettingKey }`;
	},

	KVCSettingStub (inputData) {
		return {
			KVCSettingKey: inputData.split('/').pop(),
		};
	},

};

export default Object.assign(mod, {
	ZDRSchemaKey: 'KVCSetting',
	ZDRSchemaDispatchValidate: mod.KVCSettingErrors,
	ZDRSchemaPath: mod.KVCSettingPath,
	ZDRSchemaStub: mod.KVCSettingStub,
	ZDRSchemaMethods: {
		
		async KVCSettingList () {
			return Object.values(await this.App.KVCSetting.ZDRModelListObjects());
		},

	},
});
