const mod = {

	KVCVitrineRouteGuard (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('KVCErrorInputNotValid');
		}

		if (!(inputData.KVC_VITRINE_NV_URL || '').trim()) {
			return new Error('KVC_VITRINE_NV_URL not defined');
		}

		if (!(inputData.KVC_VITRINE_VIDEO_URL || '').trim()) {
			return new Error('KVC_VITRINE_VIDEO_URL not defined');
		}
	},

};

Object.assign(exports, mod);
