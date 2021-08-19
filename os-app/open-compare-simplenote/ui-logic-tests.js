const { throws, deepEqual } = require('assert');

const mod = require('./ui-logic.js');

describe('KVCCompareSimplenoteFeatures', function test_KVCCompareSimplenoteFeatures() {

	it('returns object', function() {
		deepEqual(mod.KVCCompareSimplenoteFeatures(), {
			KVCCompareSimplenoteFeaturePlaintext: [true, true],
			KVCCompareSimplenoteFeatureFirstLink: [true, true],
			KVCCompareSimplenoteFeatureMarkdown: [true, true],
			KVCCompareSimplenoteFeatureSync: [true, true],
			KVCCompareSimplenoteFeatureOpenSource: [true, true],
			KVCCompareSimplenoteFeatureOffline: [true, true],
			KVCCompareSimplenoteFeatureMobile: [true, true],
			KVCCompareSimplenoteFeatureShortcuts: [true, true],
			KVCCompareSimplenoteFeatureCollaborate: [false, true],
			KVCCompareSimplenoteFeatureClick: [true, true],
			KVCCompareSimplenoteFeaturePublish: [true, true],
			KVCCompareSimplenoteFeatureHomepage: [true, false],
			KVCCompareSimplenoteFeatureDomain: [true, false],
			KVCCompareSimplenoteFeatureDoorless: [true, false],
			KVCCompareSimplenoteFeatureNotational: [true, false],
			KVCCompareSimplenoteFeatureSyntax: [true, false],
			KVCCompareSimplenoteFeatureArchive: [true, false],
			KVCCompareSimplenoteFeatureZeroData: [true, false],
		});
	});

});
