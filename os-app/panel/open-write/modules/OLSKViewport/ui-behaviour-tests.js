import { throws, deepEqual } from 'assert';

const browser = new OLSKBrowser();
const kDefaultRoutePath = '/modules/OLSKViewport';
const OLSKViewport = '.OLSKViewport';

describe('OLSKViewportDiscovery', function testOLSKViewportDiscovery() {

	before(function() {
		return browser.visit(kDefaultRoutePath);
	});

});
