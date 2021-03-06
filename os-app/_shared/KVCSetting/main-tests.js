const { rejects, throws, deepEqual } = require('assert');

const mod = require('./main.js').default;

describe('KVCSettingErrors', function test_KVCSettingErrors() {

	it('throws error if not object', function() {
		throws(function() {
			mod.KVCSettingErrors(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns object if KVCSettingKey not string', function() {
		deepEqual(mod.KVCSettingErrors(StubSettingObjectValid({
			KVCSettingKey: null,
		})), {
			KVCSettingKey: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns object if KVCSettingKey not filled', function() {
		deepEqual(mod.KVCSettingErrors(StubSettingObjectValid({
			KVCSettingKey: ' ',
		})), {
			KVCSettingKey: [
				'KVCErrorNotFilled',
			],
		});
	});

	it('returns object if KVCSettingValue not string', function() {
		deepEqual(mod.KVCSettingErrors(StubSettingObjectValid({
			KVCSettingValue: null,
		})), {
			KVCSettingValue: [
				'KVCErrorNotString',
			],
		});
	});

	it('returns null', function() {
		deepEqual(mod.KVCSettingErrors(StubSettingObjectValid()), null);
	});

});

describe('KVCSettingDirectory', function test_KVCSettingDirectory() {

	it('returns string', function() {
		deepEqual(mod.KVCSettingDirectory(), 'kvc_settings');
	});

});

describe('KVCSettingPath', function test_KVCSettingPath() {

	it('returns string', function() {
		const KVCSettingKey = Math.random().toString();
		deepEqual(mod.KVCSettingPath({
			KVCSettingKey,
		}), mod.KVCSettingDirectory() + '/' + KVCSettingKey);
	});

});

describe('KVCSettingStub', function test_KVCSettingStub() {

	it('returns string', function() {
		const KVCSettingKey = Math.random().toString();
		deepEqual(mod.KVCSettingStub(`${ mod.KVCSettingDirectory() }/${ KVCSettingKey }`), {
			KVCSettingKey,
		});
	});

});

describe('KVCSettingList', function test_KVCSettingActList() {

	it('returns array', async function() {
		deepEqual(await ZDRTestingWrap.App.KVCSetting.KVCSettingList(), []);
	});

	it('returns array with existing items', async function() {
		
		const item = await ZDRTestingWrap.App.KVCSetting.ZDRModelWriteObject(StubSettingObjectValid());
		deepEqual(await ZDRTestingWrap.App.KVCSetting.KVCSettingList(), [item]);
	});

});

describe('ZDRSchemaDispatchValidate', function () {

	it('returns function', function () {
		deepEqual(mod.ZDRSchemaDispatchValidate, mod.KVCSettingErrors);
	});

});

describe('ZDRSchemaPath', function () {

	it('returns function', function() {
		deepEqual(mod.ZDRSchemaPath, mod.KVCSettingPath);
	});

});


describe('ZDRSchemaStub', function () {

	it('returns function', function() {
		deepEqual(mod.ZDRSchemaStub, mod.KVCSettingStub);
	});

});
	