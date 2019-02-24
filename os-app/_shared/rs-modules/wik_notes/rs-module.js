(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.RSPModuleProtocol_wik_notes = global.RSPModuleProtocol_wik_notes || {})));
}(this, (function (exports) { 'use strict';

	const RSNotesModel = typeof require === 'undefined' ? window.RSNotesModel : require('./model.js');

	exports.RSPModuleProtocolModuleForChangeDelegate = function (changeDelegate) {
		return {
			name: 'wik_notes',
			builder: function(privateClient, publicClient) {
				privateClient.declareType('rs_note', RSNotesModel.OLSKTypeJSONSchemaForErrors(RSNotesModel.RSNotesModelErrorsFor({})));

				!changeDelegate ? null : privateClient.on('change', function (event) {
					if (typeof event.oldValue === 'undefined') {
						return typeof changeDelegate.RSChangeDelegateAdd === 'function' ? changeDelegate.RSChangeDelegateAdd(RSNotesModel.RSNotesModelPostJSONParse(event.newValue)) : console.warn('RSChangeDelegateAdd not function');
					}

					if (typeof event.newValue === 'undefined') {
						return typeof changeDelegate.RSChangeDelegateRemove === 'function' ? changeDelegate.RSChangeDelegateRemove(event.oldValue) : console.warn('RSChangeDelegateRemove not function');
					}

					if (JSON.stringify(event.oldValue) !== JSON.stringify(event.newValue)) {
						return typeof changeDelegate.RSChangeDelegateUpdate === 'function' ? changeDelegate.RSChangeDelegateUpdate(event.newValue) : console.warn('RSChangeDelegateUpdate not function');
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
							await privateClient.storeObject('rs_note', param1, RSNotesModel.RSNotesModelPreJSONSchemaValidate(param2));
							return RSNotesModel.RSNotesModelPostJSONParse(param2);
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
