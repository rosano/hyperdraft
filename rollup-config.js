export default require('OLSKRollupScaffold').OLSKRollupScaffoldScanStart(__dirname, {
	OLSKRollupPluginSwapTokens: Object.assign(require('OLSKUIAssets').OLSKUIAssetsSwapTokens(), {
		OLSK_APROPOS_FEEDBACK_EMAIL_SWAP_TOKEN: Buffer.from(`mailto:${ process.env.OLSK_APROPOS_FEEDBACK_EMAIL }`).toString('base64'),
	}),
});
