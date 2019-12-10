const { throws, deepEqual } = require('assert');

const mainModule = require('./logic.js');

describe('KVCSharedDonateLinkGuard', function testKVCSharedDonateLinkGuard() {

	const StubEnvValid = function () {
		return {
			WKC_SHARED_DONATE_URL: 'alfa',
		};
	};

	it('throws if not object', function() {
		throws(function() {
			mainModule.KVCSharedDonateLinkGuard(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns error if no WKC_SHARED_DONATE_URL', function () {
		deepEqual(mainModule.KVCSharedDonateLinkGuard(Object.assign(StubEnvValid(), {
			WKC_SHARED_DONATE_URL: null,
		})), new Error('WKC_SHARED_DONATE_URL not defined'));
	});

	it('returns error if WKC_SHARED_DONATE_URL blank', function () {
		deepEqual(mainModule.KVCSharedDonateLinkGuard(Object.assign(StubEnvValid(), {
			WKC_SHARED_DONATE_URL: ' ',
		})), new Error('WKC_SHARED_DONATE_URL not defined'));
	});

});

describe('KVCSharedGitHubLinkGuard', function testKVCSharedGitHubLinkGuard() {

	const StubEnvValid = function () {
		return {
			WKC_SHARED_GITHUB_URL: 'alfa',
		};
	};

	it('throws if not object', function() {
		throws(function() {
			mainModule.KVCSharedGitHubLinkGuard(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns error if no WKC_SHARED_GITHUB_URL', function () {
		deepEqual(mainModule.KVCSharedGitHubLinkGuard(Object.assign(StubEnvValid(), {
			WKC_SHARED_GITHUB_URL: null,
		})), new Error('WKC_SHARED_GITHUB_URL not defined'));
	});

	it('returns error if WKC_SHARED_GITHUB_URL blank', function () {
		deepEqual(mainModule.KVCSharedGitHubLinkGuard(Object.assign(StubEnvValid(), {
			WKC_SHARED_GITHUB_URL: ' ',
		})), new Error('WKC_SHARED_GITHUB_URL not defined'));
	});

});
