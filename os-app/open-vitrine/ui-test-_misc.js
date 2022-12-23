const kDefaultRoute = require('./controller.js').OLSKControllerRoutes().shift();

describe('KVCVitrine_Misc', function () {

	before(function () {
		return browser.visit(kDefaultRoute.OLSKRoutePath);
	});

	it('sets manifest', function () {
		browser.assert.attribute('link[rel="manifest"]', 'href', require('../tech-manifest/controller.js').OLSKControllerRoutes().shift().OLSKRoutePath);
	});

	describe('KVCVitrine', function () {
		
		it('classes OLSKDecor', function () {
			browser.assert.hasClass(KVCVitrine, 'OLSKDecor');
		});

		it('classes OLSKDecorCapped', function () {
			browser.assert.hasClass(KVCVitrine, 'OLSKDecorCapped');
		});

		it('classes OLSKDecorNoTopPad', function () {
			browser.assert.hasClass(KVCVitrine, 'OLSKDecorNoTopPad');
		});
	
	});

	describe('OLSKCrown', function test_OLSKCrown () {

		it('sets OLSKCrownCardImageURL', function () {
			browser.assert.attribute('.OLSKCrownCardImage', 'src', '/_shared/KVCRootLink/ui-assets/identity.svg');
		});
	
	});

	context('OLSKAppFeaturesList', function test_OLSKAppFeaturesList () {

		it('shows OLSKAppFeatureOpenSource', function () {
			browser.assert.attribute('.OLSKAppFeatureListItemOpenSource a', 'href', process.env.OLSK_REPO_URL);
		});
	
	});

	context('KVCVitrineGuideButton', function test_KVCVitrineGuideButton () {

		it('classes OLSKDecorPress', function () {
			browser.assert.hasClass(KVCVitrineGuideButton, 'OLSKDecorPress');
		});
		
		it('classes OLSKDecorPressCall', function () {
			browser.assert.hasClass(KVCVitrineGuideButton, 'OLSKDecorPressCall');
		});
		
		it('sets href', function () {
			browser.assert.attribute(KVCVitrineGuideButton, 'href', OLSKTestingCanonical(require('../open-guide/controller.js').OLSKControllerRoutes().shift()));
		});
	
	});

	describe('KVCVitrineGlossary', function test_KVCVitrineGlossary () {

		it('classes OLSKDecorGlossary', function () {
			browser.assert.hasClass(KVCVitrineGlossary, 'OLSKDecorGlossary');
		});
		
	});

	describe('KVCVitrineGlossaryWritingUsingLink', function test_KVCVitrineGlossaryWritingUsingLink () {

		it('sets href', function () {
			browser.assert.attribute(KVCVitrineGlossaryWritingUsingLink, 'href', process.env.KVC_VITRINE_GLOSSARY_WRITING_USING_URL);
		});

	});

	describe('KVCVitrineGlossaryWritingAnswerLink', function test_KVCVitrineGlossaryWritingAnswerLink () {

		it('sets href', function () {
			browser.assert.attribute(KVCVitrineGlossaryWritingAnswerLink, 'href', process.env.KVC_VITRINE_GLOSSARY_WRITING_ANSWER_URL);
		});

	});

	describe('KVCVitrineGlossaryWritingListsLink', function test_KVCVitrineGlossaryWritingListsLink () {

		it('sets href', function () {
			browser.assert.attribute(KVCVitrineGlossaryWritingListsLink, 'href', process.env.KVC_VITRINE_GLOSSARY_WRITING_LISTS_URL);
		});

	});

	describe('KVCVitrineGlossaryWritingDiscussionLink', function test_KVCVitrineGlossaryWritingDiscussionLink () {

		it('sets href', function () {
			browser.assert.attribute(KVCVitrineGlossaryWritingDiscussionLink, 'href', process.env.KVC_VITRINE_GLOSSARY_WRITING_DISCUSSION_URL);
		});

	});

	describe('KVCVitrineGlossaryWritingMagicLink', function test_KVCVitrineGlossaryWritingMagicLink () {

		it('sets href', function () {
			browser.assert.attribute(KVCVitrineGlossaryWritingMagicLink, 'href', process.env.KVC_VITRINE_GLOSSARY_WRITING_MAGIC_URL);
		});

	});

	describe('KVCVitrineGlossaryPublicRefLink', function test_KVCVitrineGlossaryPublicRefLink () {

		it('sets href', function () {
			browser.assert.attribute(KVCVitrineGlossaryPublicRefLink, 'href', process.env.KVC_VITRINE_GLOSSARY_PUBLIC_REF_URL);
		});

	});

	describe('KVCVitrineGlossaryPublicGardensLink', function test_KVCVitrineGlossaryPublicGardensLink () {

		it('sets href', function () {
			browser.assert.attribute(KVCVitrineGlossaryPublicGardensLink, 'href', process.env.KVC_VITRINE_GLOSSARY_PUBLIC_GARDENS_URL);
		});

	});

	describe('KVCVitrineVideo1', function () {

		it('classes OLSKCommonVideoListItemMobile', function () {
			browser.assert.hasClass('.KVCVitrineVideo1', 'OLSKCommonVideoListItemMobile');
		});

		it('sets src', function () {
			browser.assert.attribute(KVCVitrineVideo1, 'src', process.env.KVC_VITRINE_VIDEO_URL_1);
		});

		it('sets allowfullscreen', function () {
			browser.assert.attribute(KVCVitrineVideo1, 'allowfullscreen', '');
		});

	});

	describe('KVCVitrineVideo2', function () {

		it('sets src', function () {
			browser.assert.attribute(KVCVitrineVideo2, 'src', process.env.KVC_VITRINE_VIDEO_URL_2);
		});

		it('sets allowfullscreen', function () {
			browser.assert.attribute(KVCVitrineVideo1, 'allowfullscreen', '');
		});

	});

	describe('ROCOGazette', function test_ROCOGazette () {

		it('sets ROCOBulletinProject', function () {
			browser.assert.attribute('.ROCOBulletinProjectField', 'value', process.env.ROCO_SHARED_PROJECT_ID);
		});

	});

	describe('OLSKEdit', function test_OLSKEdit () {

		it('sets OLSKEditURL', function () {
			browser.assert.attribute('.OLSKEdit', 'href', process.env.OLSK_REPO_URL);
		});

	});

});
