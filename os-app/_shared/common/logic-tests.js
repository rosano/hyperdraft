const { throws, deepEqual } = require('assert');

const mainModule = require('./logic.js');

describe('KVCSharedDropboxAppKeyGuard', function testKVCSharedDropboxAppKeyGuard() {

	const StubEnvValid = function () {
		return {
			KVC_DROPBOX_APP_KEY: 'alfa',
		};
	};

	it('throws if not object', function() {
		throws(function() {
			mainModule.KVCSharedDropboxAppKeyGuard(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns error if no KVC_DROPBOX_APP_KEY', function () {
		deepEqual(mainModule.KVCSharedDropboxAppKeyGuard(Object.assign(StubEnvValid(), {
			KVC_DROPBOX_APP_KEY: null,
		})), new Error('KVC_DROPBOX_APP_KEY not defined'));
	});

	it('returns error if KVC_DROPBOX_APP_KEY blank', function () {
		deepEqual(mainModule.KVCSharedDropboxAppKeyGuard(Object.assign(StubEnvValid(), {
			KVC_DROPBOX_APP_KEY: ' ',
		})), new Error('KVC_DROPBOX_APP_KEY not defined'));
	});

	it('returns undefined', function () {
		deepEqual(typeof mainModule.KVCSharedDropboxAppKeyGuard(StubEnvValid()), 'undefined');
	});

});

describe('KVCSharedDonateLinkGuard', function testKVCSharedDonateLinkGuard() {

	const StubEnvValid = function () {
		return {
			KVC_SHARED_DONATE_URL: 'alfa',
		};
	};

	it('throws if not object', function() {
		throws(function() {
			mainModule.KVCSharedDonateLinkGuard(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns error if no KVC_SHARED_DONATE_URL', function () {
		deepEqual(mainModule.KVCSharedDonateLinkGuard(Object.assign(StubEnvValid(), {
			KVC_SHARED_DONATE_URL: null,
		})), new Error('KVC_SHARED_DONATE_URL not defined'));
	});

	it('returns error if KVC_SHARED_DONATE_URL blank', function () {
		deepEqual(mainModule.KVCSharedDonateLinkGuard(Object.assign(StubEnvValid(), {
			KVC_SHARED_DONATE_URL: ' ',
		})), new Error('KVC_SHARED_DONATE_URL not defined'));
	});

});

describe('KVCSharedGitHubLinkGuard', function testKVCSharedGitHubLinkGuard() {

	const StubEnvValid = function () {
		return {
			KVC_SHARED_GITHUB_URL: 'alfa',
		};
	};

	it('throws if not object', function() {
		throws(function() {
			mainModule.KVCSharedGitHubLinkGuard(null);
		}, /KVCErrorInputNotValid/);
	});

	it('returns error if no KVC_SHARED_GITHUB_URL', function () {
		deepEqual(mainModule.KVCSharedGitHubLinkGuard(Object.assign(StubEnvValid(), {
			KVC_SHARED_GITHUB_URL: null,
		})), new Error('KVC_SHARED_GITHUB_URL not defined'));
	});

	it('returns error if KVC_SHARED_GITHUB_URL blank', function () {
		deepEqual(mainModule.KVCSharedGitHubLinkGuard(Object.assign(StubEnvValid(), {
			KVC_SHARED_GITHUB_URL: ' ',
		})), new Error('KVC_SHARED_GITHUB_URL not defined'));
	});

});
