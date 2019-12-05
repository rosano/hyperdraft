const mod = {

	WKCSharedDonateLinkGuard (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('WKCErrorInputNotValid');
		}

		if (!(inputData.WKC_SHARED_DONATE_URL || '').trim()) {
			return new Error('WKC_SHARED_DONATE_URL not defined');
		}
	},

	WKCSharedGitHubLinkGuard (inputData) {
		if (typeof inputData !== 'object' || inputData === null) {
			throw new Error('WKCErrorInputNotValid');
		}

		if (!(inputData.WKC_SHARED_GITHUB_URL || '').trim()) {
			return new Error('WKC_SHARED_GITHUB_URL not defined');
		}
	},

};

Object.assign(exports, mod);
