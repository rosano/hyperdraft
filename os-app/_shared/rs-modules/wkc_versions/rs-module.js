(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.RSModuleProtocol_wkc_versions = global.RSModuleProtocol_wkc_versions || {})));
}(this, (function (exports) { 'use strict';

	const RSModuleShared = typeof require === 'undefined' ? window.RSModuleShared : require('../_shared/main.js');
	const WKCVersionsModel = typeof require === 'undefined' ? window.WKCVersionsModel : require('./model.js');

	exports.RSModuleProtocolModuleForChangeDelegate = function () {
		return {
			name: 'wkc_versions',
			builder: function(privateClient, publicClient) {
				privateClient.declareType('wkc_version', RSModuleShared.RSModulesSharedJSONSchemaForErrors(WKCVersionsModel.WKCVersionsModelErrorsFor({})));

				return {
					exports: {
						init: function () {
							return privateClient.cache('');
						},
						listObjects: function () {
							return privateClient.getAll('');
						},
						writeObject: async function (param1, param2) {
							await privateClient.storeObject('wkc_version', param1, WKCVersionsModel.WKCVersionsModelPreJSONSchemaValidate(param2));
							return WKCVersionsModel.WKCVersionsModelPostJSONParse(param2);
						},
						readObject: function (inputData) {
							return privateClient.getObject(inputData);
						},
						deleteObject: function (inputData) {
							return privateClient.remove(inputData);
						},
					},
				};
			},
		};

	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
