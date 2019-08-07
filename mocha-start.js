(function OLSKMochaBrowser() {
	if (process.env.OLSK_TESTING_BEHAVIOUR !== 'true') {
		return;
	}

	const Browser = require('zombie');

	Browser.localhost('loc.tests', 3000);
	
	Browser.prototype.OLSKFireKeyboardEvent = function(target, keyCode, eventName = 'keydown') {
		const event = this.window.document.createEvent('HTMLEvents');
		event.initEvent(eventName, true, true);
		event.which = event.keyCode = event.key = event.code = keyCode;

		target = typeof target === 'string' ? this.query(target) : target;

		if (!target) {
			throw new Error('no target');
		}

		target.dispatchEvent(event);
	};

	global.OLSKBrowser = Browser;
})();

let languageDictionary;
(function OLSKMochaLocalizedStrings() {
	if (process.env.OLSK_TESTING_BEHAVIOUR !== 'true') {
		return;
	}

	const pathPackage = require('path');
	const OLSKInternational = require('OLSKInternational');

	let baseDirectory = pathPackage.join(__dirname, 'os-app');
	languageDictionary = require('glob').sync('*i18n*.y*(a)ml', {
	  matchBase: true,
	  cwd: baseDirectory,
	}).filter(function(e) {
	  return OLSKInternational.OLSKInternationalInputDataIsTranslationFileBasename(pathPackage.basename(e));
	}).map(function (e) {
		return pathPackage.join(baseDirectory, e);
	}).reduce(function(coll, item) {
		let languageID = OLSKInternational.OLSKInternationalLanguageIDForTranslationFileBasename(pathPackage.basename(item));

		return (coll[languageID] = Object.assign(coll[languageID] || {}, require('js-yaml').safeLoad(require('fs').readFileSync(item, 'utf8')))) && coll;
	}, {});

	global.OLSKTestingLocalized = function(translationConstant, languageCode) {
		return OLSKInternational.OLSKInternationalLocalizedStringWithTranslationKeyAndTranslationDictionary(translationConstant, languageDictionary[languageCode]);
	};
})();

(function WKCMochaSetup() {
	let moduleSlugs = [
		'wkc_notes',
		'wkc_versions',
		'wkc_settings',
	];

	const uSerial = function (inputData) {
		return inputData.reduce(async function (coll, e) {
			return e.then(Array.prototype.concat.bind(await coll));
		}, Promise.resolve([]));
	};

	var mongodbPackage = require('mongodb');

	before(function(done) {
		mongodbPackage.MongoClient.connect(process.env.WKC_DATABASE_URL, {
			useNewUrlParser: true,
		}, function(err, client) {
			if (err) {
				throw err;
			}

			global.WKCTestingMongoClient = client;
			global.WKCTestingStorageClient = require('./os-app/_shared/WKCStorageClient/storage.js').WKCStorageClientForChangeDelegateMap(moduleSlugs.reduce(function (coll, e) {
				coll[e] = null;
				return coll;
			}, {}));

			done();
		});
	});

	after(function() {
		if (!global.WKCTestingMongoClient) {
			return;
		}

		global.WKCTestingMongoClient.close();
	});

	beforeEach(async function() {
		await uSerial(moduleSlugs.map(async function (e) {
			return await Promise.all(Object.keys(await global.WKCTestingStorageClient[e].listObjects()).map(global.WKCTestingStorageClient[e].deleteObject));
		}));

		global.WKCTestingMongoClient.db(process.env.WKC_SHARED_DATABASE_NAME).dropDatabase();
	});
})();

(function OLSKMochaErrors() {
	process.on('unhandledRejection', () => {
		// console.log('Unhandledd Rejection at:', arguments)
		// Recommended: send the information to sentry.io
		// or whatever crash reporting service you use
	});
})();

(function OLSKMochaPreprocess() {
	const fs = require('fs');
	const oldRequire = require('olsk-rollup-i18n')()._OLSKRollupI18NReplaceInternationalizationToken;
	const replaceFunctions = [
		require('OLSKTesting')._OLSKTestingMochaReplaceES6Import,
		function (inputData) {
			return (oldRequire({
				code: inputData,
			}, languageDictionary) || {
				code: inputData,
			}).code;
		},
	];

	require.extensions['.js'] = function(module, filename) {
		try {
			return module._compile(replaceFunctions.reduce(function (coll, item) {
				return item(coll);
			}, fs.readFileSync(filename, 'utf-8')), filename);
		} catch (err) {
			// console.log(code); // eslint-disable-line no-console
			throw err;
		}
	};
})();
