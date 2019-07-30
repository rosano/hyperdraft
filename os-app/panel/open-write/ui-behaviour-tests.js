const Browser = require('zombie');

Browser.localhost(process.env.ZOMBIE_HOST, 3000);

const kTesting = {
	WKCWriteCreateButton: '#WKCWriteCreateButton',
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
