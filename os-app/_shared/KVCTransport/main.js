import OLSKRemoteStorage from 'OLSKRemoteStorage';

export default {
	ZDRSchemaKey: 'KVCTransport',
	ZDRSchemaDispatchValidate: (function () {}),
	ZDRSchemaPath: (function () {}),
	ZDRSchemaStub: (function () {}),
	ZDRSchemaMethods: {

		async KVCTransportImport (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('KVCErrorInputNotValid');
			}

			const _this = this;

			return Object.fromEntries(await Promise.all(Object.entries(inputData).map(async function ([key, value]) {
				if (!Array.isArray(value)) {
					throw new Error('KVCErrorInputNotValid');
				}

				return [key, await ({
					KVCNote: (function () {
						return Promise.all(value.map(function (e) {
							return _this.App.KVCNote.KVCNoteCreate(e).catch(function () {
								throw new Error('KVCErrorInputNotValid');
							});
						}));
					}),
					KVCSetting: (function () {
						return Promise.all(value.map(function (e) {
							return _this.App.KVCSetting.ZDRModelWriteObject(e).catch(function () {
								throw new Error('KVCErrorInputNotValid');
							});
						}));
					}),
				}[key]())];
			})));
		},

		KVCTransportExport (inputData) {
			if (typeof inputData !== 'object' || inputData === null) {
				throw new Error('KVCErrorInputNotValid');
			}

			return Object.entries(inputData).reduce(function (coll, [key, value]) {
				if (!Array.isArray(value)) {
					throw new Error('KVCErrorInputNotValid');
				}

				if (!value.length) {
					return coll;
				}
				
				return Object.assign(coll, {
					[key]: value.map(OLSKRemoteStorage.OLSKRemoteStorageSafeCopy),
				});
			}, {});
		},

	},
};
