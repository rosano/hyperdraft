const mod = {

	KVCWriteMasterTruncatedTitle (inputData, param2) {
		if (typeof inputData !== 'string') {
			throw new Error('KVCErrorInputNotValid');
		}

		const threshold = 60;

		if (inputData.length <= 60) {
			return inputData;
		}

		return inputData.slice(0, 60).split(' ').slice(0, -1).join(' ') + (param2 ? '…' : '');
	},

};

Object.assign(exports, mod);
