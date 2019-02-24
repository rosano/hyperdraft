(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.RSModuleProtocol_wkc_notes = global.RSModuleProtocol_wkc_notes || {})));
}(this, (function (exports) { 'use strict';

	const WKCNotesModel = typeof require === 'undefined' ? window.WKCNotesModel : require('./model.js');

	exports.RSModuleProtocolModuleForChangeDelegate = function (changeDelegate) {
		return {
			name: 'wkc_notes',
			builder: function(privateClient, publicClient) {
				privateClient.declareType('wkc_note', WKCNotesModel.OLSKTypeJSONSchemaForErrors(WKCNotesModel.WKCNotesModelErrorsFor({})));

				!changeDelegate ? null : privateClient.on('change', function (event) {
					if (typeof event.oldValue === 'undefined') {
						return typeof changeDelegate.OLSKChangeDelegateAdd === 'function' ? changeDelegate.OLSKChangeDelegateAdd(WKCNotesModel.WKCNotesModelPostJSONParse(event.newValue)) : console.warn('OLSKChangeDelegateAdd not function');
					}

					if (typeof event.newValue === 'undefined') {
						return typeof changeDelegate.OLSKChangeDelegateRemove === 'function' ? changeDelegate.OLSKChangeDelegateRemove(event.oldValue) : console.warn('OLSKChangeDelegateRemove not function');
					}

					if (JSON.stringify(event.oldValue) !== JSON.stringify(event.newValue)) {
						return typeof changeDelegate.OLSKChangeDelegateUpdate === 'function' ? changeDelegate.OLSKChangeDelegateUpdate(WKCNotesModel.WKCNotesModelPostJSONParse(event.newValue)) : console.warn('OLSKChangeDelegateUpdate not function');
					}

					console.log(event);
				});

				return {
					exports: {
						init: function () {
							return privateClient.cache('');
						},
						listObjects: function () {
							return privateClient.getAll('');
						},
						writeObject: async function (param1, param2) {
							await privateClient.storeObject('wkc_note', param1, WKCNotesModel.WKCNotesModelPreJSONSchemaValidate(param2));
							return WKCNotesModel.WKCNotesModelPostJSONParse(param2);
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
