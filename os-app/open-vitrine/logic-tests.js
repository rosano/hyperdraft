const { throws, deepEqual } = require('assert');

const mainModule = require('./logic.js');

describe('KVCVitrineRouteGuard', function test_KVCVitrineRouteGuard() {

	const StubEnvValid = function () {
		return {
			KVC_VITRINE_NV_URL: 'alfa',
			KVC_VITRINE_VIDEO_URL: 'bravo',
		};
	};

	it('throws if not object', function() {
		throws(function() {
			mainModule.KVCVitrineRouteGuard(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns error if no KVC_VITRINE_NV_URL', function () {
		deepEqual(mainModule.KVCVitrineRouteGuard(Object.assign(StubEnvValid(), {
			KVC_VITRINE_NV_URL: null,
		})), new Error('KVC_VITRINE_NV_URL not defined'));
	});

	it('returns error if KVC_VITRINE_NV_URL blank', function () {
		deepEqual(mainModule.KVCVitrineRouteGuard(Object.assign(StubEnvValid(), {
			KVC_VITRINE_NV_URL: ' ',
		})), new Error('KVC_VITRINE_NV_URL not defined'));
	});

	it('returns error if no KVC_VITRINE_VIDEO_URL', function () {
		deepEqual(mainModule.KVCVitrineRouteGuard(Object.assign(StubEnvValid(), {
			KVC_VITRINE_VIDEO_URL: null,
		})), new Error('KVC_VITRINE_VIDEO_URL not defined'));
	});

	it('returns error if KVC_VITRINE_VIDEO_URL blank', function () {
		deepEqual(mainModule.KVCVitrineRouteGuard(Object.assign(StubEnvValid(), {
			KVC_VITRINE_VIDEO_URL: ' ',
		})), new Error('KVC_VITRINE_VIDEO_URL not defined'));
	});

});
