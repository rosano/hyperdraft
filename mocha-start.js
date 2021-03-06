(function KVCMochaWrap() {
	if (process.env.OLSK_SPEC_MOCHA_INTERFACE === 'true') {
		return;
	}

	before(async function() {
		global.ZDRTestingWrap = await require('zerodatawrap').ZDRWrap({
			ZDRParamLibrary: require('remotestoragejs'),
			ZDRParamScopes: [{
				ZDRScopeKey: 'App',
				ZDRScopeDirectory: 'wikiavec',
				ZDRScopeSchemas: [
					require('./os-app/_shared/KVCNote/main.js').default,
					require('./os-app/_shared/KVCSetting/main.js').default,
					require('./os-app/_shared/KVCTransport/main.js').default,
				],
			}, {
				ZDRScopeKey: 'Public',
				ZDRScopeDirectory: 'wikiavec',
				ZDRScopeIsPublic: true,
			}],
		});
	});

	beforeEach(function() {
		return ZDRTestingWrap.App.ZDRStorageDeleteFolderRecursive('');
	});

	beforeEach(function() {
		return ZDRTestingWrap.Public.ZDRStorageDeleteFolderRecursive('');
	});
})();

(function KVCMochaStubs() {
	Object.entries({

		StubNoteObject(inputData) {
			return Object.assign({
				KVCNoteBody: Math.random().toString(),
			}, inputData);
		},

		StubNoteObjectValid(inputData) {
			return Object.assign({
				KVCNoteID: Math.random().toString(),
				KVCNoteBody: Math.random().toString(),
				KVCNoteCreationDate: new Date(),
				KVCNoteModificationDate: new Date(),
			}, inputData);
		},

		StubNoteObjectPublic(inputData = {}) {
			return Object.assign(StubNoteObjectValid({
				KVCNoteIsPublic: true,
				KVCNotePublishDate: new Date(),
				KVCNotePublicID: Math.random().toString(),
			}), inputData);
		},

		StubSettingObjectValid (inputData = {}) {
			return Object.assign({
				KVCSettingKey: Math.random().toString(),
				KVCSettingValue: Math.random().toString(),
			}, inputData);
		},
		
		uSerial (inputData) {
			return inputData.reduce(async function (coll, e) {
				return e.then(Array.prototype.concat.bind(await coll));
			}, Promise.resolve([]));
		},

		uSleep (inputData) {
			let endTime = new Date().getTime();
			while (new Date().getTime() < endTime + inputData) {}
		},
	}).map(function (e) {
		return global[e.shift()]  = e.pop();
	});
})();
