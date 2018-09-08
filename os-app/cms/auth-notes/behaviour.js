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

	var WKBehaviourPropertyAPIToken;
	var WKBehaviourPropertySelectedNote;
	var WKBehaviourPropertyPersistenceTask;

	//# PROPERTIES

	//_ propertiesAPIToken

	moi.propertiesAPIToken = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKBehaviourPropertyAPIToken;
		}

		WKBehaviourPropertyAPIToken = inputData;
	};

	//_ propertiesNoteObjects

	moi.propertiesNoteObjects = function (inputData) {
		if (typeof inputData === 'undefined') {
			return d3.selectAll('.WKCAppNotesListItem').data();
		}

		moi.reactNoteObjects(inputData.sort(WKLogic.WKLogicListSort));
	};

	//_ propertiesSelectedNote

	moi.propertiesSelectedNote = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKBehaviourPropertySelectedNote;
		}

		WKBehaviourPropertySelectedNote = inputData;

		moi.reactSelectedNote();
	};

	//_ propertiesPersistenceTask

	moi.propertiesPersistenceTask = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKBehaviourPropertyPersistenceTask;
		}

		WKBehaviourPropertyPersistenceTask = inputData;
	};

	//# DATA

	//_ dataNewNoteObject

	moi.dataNewNoteObject = function () {
		return {
			WKCNoteDateCreated: new Date(),
			WKCNoteBody: '',
		};
	};

	//# INTERFACE

	//_ interfaceAddButtonDidClick

	moi.interfaceAddButtonDidClick = function () {
		moi.commandsAddNote();
	};

	//_ interfaceDeleteButtonDidClick

	moi.interfaceDeleteButtonDidClick = function () {
		moi.commandsDeleteWithConfirmation();
	};

	//_ interfacePublishButtonDidClick

	moi.interfacePublishButtonDidClick = function () {
		d3.select('#WKCAppNotesPublishStatus').text('<%= OLSKLocalized('WKCAppNotesPublishStatusPublishing') %>');;
	};

	//_ interfaceEditorTextareaDidReceiveInput

	moi.interfaceEditorTextareaDidReceiveInput = function () {
		moi.commandsUpdateText(this.value);
	};

	//# COMMANDS

	//_ commandsAlertConnectionError

	moi.commandsAlertConnectionError = function (error) {
		window.alert('<%= OLSKLocalized('WKCNotesErrors').WKCAppErrorServiceUnavailable %>');

		throw error;
	};

	//_ commandsAlertTokenUnavailable

	moi.commandsAlertTokenUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKCNotesErrors').WKCAppErrorTokenUnavailable %>');

		throw new Error('WKCAppErrorTokenUnavailable');
	};

	//_ commandsAlertNotesUnavailable

	moi.commandsAlertNotesUnavailable = function () {
		window.alert('<%= OLSKLocalized('WKCNotesErrors').WKCAppErrorNotesUnavailable %>');

		throw new Error('WKCAppErrorNotesUnavailable');
	};

	//_ commandsAddNote

	moi.commandsAddNote = function () {
		moi.propertiesNoteObjects(moi.propertiesNoteObjects().concat(moi.dataNewNoteObject()));

		moi.propertiesSelectedNote(moi.propertiesNoteObjects().shift());
	};

	//_ commandsSelectNote

	moi.commandsSelectNote = function (item) {
		moi.propertiesSelectedNote(item);
	};

	//_ commandsUpdateText

	moi.commandsUpdateText = function (inputData) {
		clearInterval(moi.propertiesPersistenceTask()._OLSKTaskTimerID);
		OLSKTasks.OLSKTasksTimeoutForTaskObject(moi.propertiesPersistenceTask());

		Object.assign(moi.propertiesSelectedNote(), {
			WKCNoteBody: inputData,
			WKCNoteDateUpdated: new Date(),
		});

		moi.reactNoteObjects(moi.propertiesNoteObjects());
	};

	//_ commandsDeleteWithConfirmation

	moi.commandsDeleteWithConfirmation = function () {
		var persistenceIsCued = !!moi.propertiesPersistenceTask()._OLSKTaskTimerID;

		clearInterval(moi.propertiesPersistenceTask()._OLSKTaskTimerID);

		if (!window.confirm('<%= OLSKLocalized('WKCAppNotesDeleteConfirmation') %>')) {
			if (persistenceIsCued) {
				OLSKTasks.OLSKTasksTimeoutForTaskObject(moi.propertiesPersistenceTask());
			}

			return;
		};

		moi._commandsDeleteWithoutConfirmation();
	};

	//_ _commandsDeleteWithoutConfirmation

	moi._commandsDeleteWithoutConfirmation = function () {
		d3.select('#WKCAppNotesPersistenceStatus').text('<%= OLSKLocalized('WKCAppNotesPersistenceStatusDeleting') %>');

		d3.json((<%- OLSKCanonicalSubstitutionFunctionFor('WKCRouteAPINotesDelete') %>)({
			wkc_note_id: moi.propertiesSelectedNote().WKCNoteID,
		}), {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
		}).then(function(responseJSON) {
			moi.propertiesNoteObjects(d3.selectAll('.WKCAppNotesListItem').data().filter(function(e) {
				return e !== moi.propertiesSelectedNote();
			}));

			moi.commandsSelectNote(moi.propertiesNoteObjects().shift());

			d3.select('#WKCAppNotesPersistenceStatus').text('<%= OLSKLocalized('WKCAppNotesPersistenceStatusDeleted') %>');

			setTimeout(function() {
				d3.select('#WKCAppNotesPersistenceStatus').text('');
			}, 1000);
		}, function(error) {
			d3.select('#WKCAppNotesPersistenceStatus').text('');
			
			moi.commandsAlertUnableToDelete(error);
		});
	};

	//_ commandsAlertUnableToDelete

	moi.commandsAlertUnableToDelete = function (error) {
		window.alert('<%= OLSKLocalized('WKCAppNotesPersistenceStatusUnableToDelete') %>');

		throw error;
	};

	//# REACT

	//_ reactNoteObjects

	moi.reactNoteObjects = function (noteObjects) {
		var selection = d3.select('#WKCAppNotesList')
			.selectAll('.WKCAppNotesListItem').data(noteObjects);
		
		selection.enter()
			.append('div')
				.attr('class', 'WKCAppNotesListItem')
				.on('click', function(obj) {
					moi.commandsSelectNote(obj);
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

	//_ reactSelectedNote

	moi.reactSelectedNote = function () {
		d3.select('#WKCNotesAppEditorTextarea').node().value = moi.propertiesSelectedNote() ? moi.propertiesSelectedNote().WKCNoteBody : null;
		d3.select('#WKCNotesAppEditorTextarea').attr('disabled', moi.propertiesSelectedNote() ? null : undefined);

		if (moi.propertiesSelectedNote()) {
			d3.select('#WKCNotesAppEditorTextarea').node().focus();
		}

		d3.selectAll('.WKCAppNotesListItem').classed('WKCAppNotesListItemSelected', function(d) {
			return d === moi.propertiesSelectedNote();
		});

		d3.select('#WKCAppNotesDeleteButton').attr('disabled', moi.propertiesSelectedNote() ? null : undefined);
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
				return moi.commandsAlertTokenUnavailable();
			}

			moi.propertiesAPIToken(responseJSON.WKCAPIToken);

			moi.setupNoteObjects();
		}, moi.commandsAlertConnectionError);
	};

	//_ setupNoteObjects

	moi.setupNoteObjects = function () {
		d3.json('<%= OLSKCanonicalFor('WKCRouteAPINotesSearch') %>', {
			method: 'GET',
			headers: {
				'x-client-key': moi.propertiesAPIToken(),
			},
		}).then(function(responseJSON) {
			if (!Array.isArray(responseJSON)) {
				return moi.commandsAlertNotesUnavailable();
			}

			d3.select('#WKCAppNotes').classed('WKCAppNotesLoading', false);

			moi.propertiesNoteObjects(responseJSON.map(function(e) {
				return Object.assign(e, {
					WKCNoteDateCreated: new Date(e.WKCNoteDateCreated),
					WKCNoteDateUpdated: new Date(e.WKCNoteDateUpdated),
				});
			}));

			if (moi.propertiesNoteObjects().length) {
				moi.propertiesSelectedNote(moi.propertiesNoteObjects().shift());
			}

			moi.setupPersistenceTask();
		}, moi.commandsAlertConnectionError);
	};

	//_ setupPersistenceTask

	moi.setupPersistenceTask = function () {
		moi.propertiesPersistenceTask({
			OLSKTaskName: 'WKCTasksEditorPersistence',
			OLSKTaskFireTimeInterval: 3,
			OLSKTaskShouldBePerformed: function() {
				return true;
			},
			OLSKTaskFireLimit: 1,
			OLSKTaskCallback: function() {
				d3.select('#WKCAppNotesPersistenceStatus').text('<%= OLSKLocalized('WKCAppNotesPersistenceStatusSaving') %>');

				return (new Promise(function(resolve, reject) {
					if (!moi.propertiesSelectedNote().WKCNoteID) {
						return resolve(d3.json('<%= OLSKCanonicalFor('WKCRouteAPINotesCreate') %>', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'x-client-key': moi.propertiesAPIToken(),
							},
							body: JSON.stringify(moi.propertiesSelectedNote()),
						}).then(function(responseJSON) {
							Object.assign(moi.propertiesSelectedNote(), responseJSON);
						}, reject));
					}

					return resolve(d3.json((<%- OLSKCanonicalSubstitutionFunctionFor('WKCRouteAPINotesUpdate') %>)({
						wkc_note_id: moi.propertiesSelectedNote().WKCNoteID,
					}), {
						method: 'PUT',
						headers: {
							'Content-Type': 'application/json',
							'x-client-key': moi.propertiesAPIToken(),
						},
						body: JSON.stringify(moi.propertiesSelectedNote()),
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
						moi.propertiesPersistenceTask().OLSKTaskCallback();
					};

					d3.select('#WKCAppNotesPersistenceStatus').text('<%= OLSKLocalized('WKCAppNotesPersistenceStatusUnableToSave') %>');

					throw error;
				}).finally(function() {
					delete moi.propertiesPersistenceTask()._OLSKTaskTimerID;
				});
			},
		});
	};

	//# LIFECYCLE

	//_ lifecyclePageWillLoad

	moi.lifecyclePageWillLoad = function () {
		moi.setupEverything();
	};

	Object.defineProperty(exports, '__esModule', { value: true });

})));
