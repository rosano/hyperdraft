/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKBehaviour = global.WKBehaviour || {})));
}(this, (function (exports) { 'use strict';

	var moi = exports;

	var sharedData = {
		WKCAppNotesSharedSelectedItem: {},
	};

	//# PROPERTIES

	//_ _propertiesSharedData

	moi._propertiesSharedData = function (inputData) {
		if (typeof inputData === 'undefined') {
			return sharedData;
		}

		sharedData = inputData;
	};

	//_ WKPropertiesAPIToken

	moi.WKPropertiesAPIToken = function (inputData) {
		if (typeof inputData === 'undefined') {
			return sharedData.WKCAppNotesSharedAPIToken;
		}

		sharedData.WKCAppNotesSharedAPIToken = inputData;
	};

	//_ WKPropertiesNoteObjects

	moi.WKPropertiesNoteObjects = function (inputData) {
		if (typeof inputData === 'undefined') {
			return d3.selectAll('.WKCAppNotesListItem').data();
		}

		moi.WKReactNoteObjects(inputData.sort(WKLogic.WKLogicListSort), sharedData);
	};

	//_ WKPropertiesSelectedNote

	moi.WKPropertiesSelectedNote = function (inputData) {
		if (typeof inputData === 'undefined') {
			return sharedData.WKCAppNotesSharedSelectedItem;
		}

		sharedData.WKCAppNotesSharedSelectedItem = inputData;

		moi.WKReactSelectedNote(sharedData);
	};

	//# DATA

	//_ WKDataNewNoteObject

	moi.WKDataNewNoteObject = function () {
		return {
			WKCNoteDateCreated: new Date(),
			WKCNoteBody: '',
		};
	};

	//# INTERFACE

	//_ interfaceEditorTextareaDidReceiveInput

	moi.interfaceEditorTextareaDidReceiveInput = function (textarea) {
		clearInterval(sharedData.WKCAppNotesSharedPersistenceTask._OLSKTaskTimerID);
		OLSKTasks.OLSKTasksTimeoutForTaskObject(sharedData.WKCAppNotesSharedPersistenceTask);

		Object.assign(sharedData.WKCAppNotesSharedSelectedItem, {
			WKCNoteBody: textarea.value,
			WKCNoteDateUpdated: new Date(),
		});

		WKBehaviour.WKReactNoteObjects(d3.selectAll('.WKCAppNotesListItem').data(), sharedData);
	};

	//# COMMANDS

	//_ WKCommandsAlertConnectionError

	moi.WKCommandsAlertConnectionError = function (error) {
		window.alert('<%= OLSKLocalized('WKCNotesErrors').WKCAppErrorServiceUnavailable %>');

		throw error;
	};

	//_ WKCommandsAlertTokenUnavailable

	moi.WKCommandsAlertTokenUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKCNotesErrors').WKCAppErrorTokenUnavailable %>');

		throw new Error('WKCAppErrorTokenUnavailable');
	};

	//_ WKCommandsAlertNotesUnavailable

	moi.WKCommandsAlertNotesUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKCNotesErrors').WKCAppErrorNotesUnavailable %>');

		throw new Error('WKCAppErrorNotesUnavailable');
	};

	//_ WKCommandsAddNote

	moi.WKCommandsAddNote = function () {
		moi.WKPropertiesNoteObjects(moi.WKPropertiesNoteObjects(undefined, sharedData).concat(WKBehaviour.WKDataNewNoteObject()), sharedData);

		moi.WKPropertiesSelectedNote(moi.WKPropertiesNoteObjects(undefined, sharedData).shift(), sharedData);
	};

	//_ WKCommandsSelectNote

	moi.WKCommandsSelectNote = function (item) {
		moi.WKPropertiesSelectedNote(item, sharedData);
	};

	//_ WKCommandsDeleteWithConfirmation

	moi.WKCommandsDeleteWithConfirmation = function () {
		var persistenceIsCued = !!sharedData.WKCAppNotesSharedPersistenceTask._OLSKTaskTimerID;

		clearInterval(sharedData.WKCAppNotesSharedPersistenceTask._OLSKTaskTimerID);

		if (!window.confirm('<%= OLSKLocalized('WKCAppNotesDeleteConfirmation') %>')) {
			if (persistenceIsCued) {
				OLSKTasks.OLSKTasksTimeoutForTaskObject(sharedData.WKCAppNotesSharedPersistenceTask);
			}

			return;
		};

		moi._WKCommandsDeleteWithoutConfirmation(sharedData);
	};

	//_ _WKCommandsDeleteWithoutConfirmation

	moi._WKCommandsDeleteWithoutConfirmation = function () {
		d3.select('#WKCAppNotesPersistenceStatus').text('<%= OLSKLocalized('WKCAppNotesPersistenceStatusDeleting') %>');

		d3.json((<%- OLSKCanonicalSubstitutionFunctionFor('WKCRouteAPINotesDelete') %>)({
			wkc_note_id: moi.WKPropertiesSelectedNote(undefined, sharedData).WKCNoteID,
		}), {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': sharedData.WKCAppNotesSharedAPIToken,
			},
		}).then(function(responseJSON) {
			moi.WKPropertiesNoteObjects(d3.selectAll('.WKCAppNotesListItem').data().filter(function(e) {
				return e !== moi.WKPropertiesSelectedNote(undefined, sharedData);
			}), sharedData);

			moi.WKCommandsSelectNote(moi.WKPropertiesNoteObjects(undefined, sharedData).shift(), sharedData);

			d3.select('#WKCAppNotesPersistenceStatus').text('<%= OLSKLocalized('WKCAppNotesPersistenceStatusDeleted') %>');

			setTimeout(function() {
				d3.select('#WKCAppNotesPersistenceStatus').text('');
			}, 1000);
		}, function(error) {
			d3.select('#WKCAppNotesPersistenceStatus').text('');
			
			moi.WKCommandsAlertUnableToDelete(error);
		});
	};

	//_ WKCommandsAlertUnableToDelete

	moi.WKCommandsAlertUnableToDelete = function (error) {
		window.alert('<%= OLSKLocalized('WKCAppNotesPersistenceStatusUnableToDelete') %>');

		throw error;
	};

	//# REACT

	//_ WKReactNoteObjects

	moi.WKReactNoteObjects = function (noteObjects) {
		var selection = d3.select('#WKCAppNotesList')
			.selectAll('.WKCAppNotesListItem').data(noteObjects);
		
		selection.enter()
			.append('div')
				.attr('class', 'WKCAppNotesListItem')
				.on('click', function(obj) {
					WKBehaviour.WKCommandsSelectNote(obj, sharedData);
				})
				.merge(selection)
					.html(function(obj) {
						return [
							'<pre>',
							(obj.WKCNoteBody || '').split('\n').slice(0, 3).join('\n'),
							'</pre>',
						].join('');
					});

		selection.exit().remove();
	};

	//_ WKReactSelectedNote

	moi.WKReactSelectedNote = function () {
		d3.select('#WKCNotesAppEditorTextarea').node().value = moi.WKPropertiesSelectedNote(undefined, sharedData) ? moi.WKPropertiesSelectedNote(undefined, sharedData).WKCNoteBody : null;
		d3.select('#WKCNotesAppEditorTextarea').attr('disabled', moi.WKPropertiesSelectedNote(undefined, sharedData) ? null : undefined);

		if (moi.WKPropertiesSelectedNote(undefined, sharedData)) {
			d3.select('#WKCNotesAppEditorTextarea').node().focus();
		}

		d3.selectAll('.WKCAppNotesListItem').classed('WKCAppNotesListItemSelected', function(d) {
			return d === moi.WKPropertiesSelectedNote(undefined, sharedData);
		});

		d3.select('#WKCAppNotesDeleteButton').attr('disabled', moi.WKPropertiesSelectedNote(undefined, sharedData) ? null : undefined);
	};

	//# SETUP

	//_ setupEverything

	moi.setupEverything = function () {
		moi.setupAPIToken();
	};

	//_ setupAPIToken

	moi.setupAPIToken = function () {
		d3.json('<%= OLSKCanonicalFor('WKCRouteAPIToken') %>', {
			method: 'GET',
		}).then(function(responseJSON) {
			if (!responseJSON.WKCAPIToken) {
				return WKBehaviour.WKCommandsAlertTokenUnavailable();
			}

			moi.WKPropertiesAPIToken(responseJSON.WKCAPIToken, sharedData);

			moi.setupNoteObjects();
		}, moi.WKCommandsAlertConnectionError);
	};

	//_ setupNoteObjects

	moi.setupNoteObjects = function () {
		d3.json('<%= OLSKCanonicalFor('WKCRouteAPINotesSearch') %>', {
			method: 'GET',
			headers: {
				'x-client-key': moi.WKPropertiesAPIToken(undefined, sharedData),
			},
		}).then(function(responseJSON) {
			if (!Array.isArray(responseJSON)) {
				return WKBehaviour.WKCommandsAlertNotesUnavailable();
			}

			d3.select('#WKCAppNotes').classed('WKCAppNotesLoading', false);

			WKBehaviour.WKPropertiesNoteObjects(responseJSON.map(function(e) {
				return Object.assign(e, {
					WKCNoteDateCreated: new Date(e.WKCNoteDateCreated),
					WKCNoteDateUpdated: new Date(e.WKCNoteDateUpdated),
				});
			}), sharedData);

			if (WKBehaviour.WKPropertiesNoteObjects(undefined, sharedData).length) {
				moi.WKPropertiesSelectedNote(moi.WKPropertiesNoteObjects(undefined, sharedData).shift(), sharedData);
			}

			moi.setupPersistenceTask();
		}, moi.WKCommandsAlertConnectionError);
	};

	//_ setupPersistenceTask

	moi.setupPersistenceTask = function () {
		sharedData.WKCAppNotesSharedPersistenceTask = {
			OLSKTaskName: 'WKCTasksEditorPersistence',
			OLSKTaskFireTimeInterval: 3,
			OLSKTaskShouldBePerformed: function() {
				return true;
			},
			OLSKTaskFireLimit: 1,
			OLSKTaskCallback: function() {
				d3.select('#WKCAppNotesPersistenceStatus').text('<%= OLSKLocalized('WKCAppNotesPersistenceStatusSaving') %>');

				return (new Promise(function(resolve, reject) {
					if (!sharedData.WKCAppNotesSharedSelectedItem.WKCNoteID) {
						return resolve(d3.json('<%= OLSKCanonicalFor('WKCRouteAPINotesCreate') %>', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'x-client-key': sharedData.WKCAppNotesSharedAPIToken,
							},
							body: JSON.stringify(sharedData.WKCAppNotesSharedSelectedItem),
						}).then(function(responseJSON) {
							Object.assign(sharedData.WKCAppNotesSharedSelectedItem, responseJSON);
						}, reject));
					}

					return resolve(d3.json((<%- OLSKCanonicalSubstitutionFunctionFor('WKCRouteAPINotesUpdate') %>)({
						wkc_note_id: sharedData.WKCAppNotesSharedSelectedItem.WKCNoteID,
					}), {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'x-client-key': sharedData.WKCAppNotesSharedAPIToken,
						},
						body: JSON.stringify(sharedData.WKCAppNotesSharedSelectedItem),
					}));
					
				})).then(function() {
					d3.select('#WKCAppNotesPersistenceStatus').text('<%= OLSKLocalized('WKCAppNotesPersistenceStatusSaved') %>');

					setTimeout(function() {
						d3.select('#WKCAppNotesPersistenceStatus').text('');
					}, 1000);
				}, function(error) {
					throw error;
				}).catch(function(error) {
					if (window.confirm('<%= OLSKLocalized('WKCNotesErrors').WKCAppErrorPersistenceSaveDidFail %>')) {
						sharedData.WKCAppNotesSharedPersistenceTask.OLSKTaskCallback();
					};

					d3.select('#WKCAppNotesPersistenceStatus').text('<%= OLSKLocalized('WKCAppNotesPersistenceStatusUnableToSave') %>');

					throw error;
				}).finally(function() {
					delete sharedData.WKCAppNotesSharedPersistenceTask._OLSKTaskTimerID;
				});
			},
		};
	};

	//# LIFECYCLE

	//_ WKLifecyclePageWillLoad

	moi.WKLifecyclePageWillLoad = function () {
		moi.setupEverything();
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
