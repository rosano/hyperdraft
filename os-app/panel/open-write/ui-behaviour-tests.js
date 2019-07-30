import { throws, deepEqual } from 'assert';

const Browser = require('zombie');

Browser.localhost(process.env.ZOMBIE_HOST, 3000);

const kTesting = {
	WKCWriteCreateButton: '#WKCWriteCreateButton',
	WKCWriteListItem: '.ListItem',
};

describe('WKCWriteBehaviourVisibility', function() {

  const browser = new Browser();

  before(function() {
    return browser.visit('/panel/write');
  });

  it('contains create button', function() {
    browser.assert.element(kTesting.WKCWriteCreateButton);
  });

});

describe('WKCWriteBehaviourLocalizationEN', function() {

  const browser = new Browser();

  before(function() {
    return browser.visit('/panel/write');
  });

  it('localizes interface', function() {
    deepEqual(browser.query(kTesting.WKCWriteCreateButton).title, 'Add note');
  });

});

describe('WKCWriteBehaviourInteraction', function() {

  const browser = new Browser();

  before(function() {
    return browser.visit('/panel/write');
  });

  it('has no items', async function() {
    browser.assert.elements(kTesting.WKCWriteListItem, 0);
  });

  it('creates item', async function() {
    browser.pressButton(kTesting.WKCWriteCreateButton);
    await browser.wait({ element: kTesting.WKCWriteListItem });
    browser.assert.elements(kTesting.WKCWriteListItem, 1);
  });

});
