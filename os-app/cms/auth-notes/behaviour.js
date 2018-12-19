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
	var WKBehaviourPropertyUnsavedNotes;

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

		WKBehaviourPropertySelectedNote = inputData === null ? undefined : inputData;

		moi.reactSelectedNote();
	};

	//_ propertiesUnsavedNotes

	moi.propertiesUnsavedNotes = function (inputData) {
		if (typeof inputData === 'undefined') {
			return WKBehaviourPropertyUnsavedNotes;
		}

		WKBehaviourPropertyUnsavedNotes = inputData === null ? undefined : inputData;
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
		moi.commandsDeleteNoteWithConfirmation(moi.propertiesSelectedNote());
	};

	//_ interfacePublishButtonDidClick

	moi.interfacePublishButtonDidClick = function () {
		moi.commandsPublishNote(moi.propertiesSelectedNote());
	};

	//_ interfaceEditorTextareaDidReceiveInput

	moi.interfaceEditorTextareaDidReceiveInput = function () {
		moi.commandsUpdateText(this.value);
	};

	//# COMMANDS

	//_ commandsAlertConnectionError

	moi.commandsAlertConnectionError = function (error) {
		window.alert(OLSKLocalized('WKSharedErrorServiceUnavailable'));

		throw error;
	};

	//_ commandsAlertTokenUnavailable

	moi.commandsAlertTokenUnavailable = function () {
		window.alert(OLSKLocalized('WKSharedErrorTokenUnavailable'));

		throw new Error('WKCAppErrorTokenUnavailable');
	};

	//_ commandsAlertNotesUnavailable

	moi.commandsAlertNotesUnavailable = function () {
		window.alert(OLSKLocalized('WKCAppNotesErrorNotesUnavailable'));

		throw new Error('WKCAppNotesErrorNotesUnavailable');
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
		moi.commandsPersistenceTaskStop();
		moi.commandsPersistenceTaskStart();

		Object.assign(moi.propertiesSelectedNote(), {
			WKCNoteBody: inputData,
			WKCNoteDateUpdated: new Date(),
		});

		if (moi.propertiesUnsavedNotes().indexOf(moi.propertiesSelectedNote()) == -1) {
			moi.propertiesUnsavedNotes().push(moi.propertiesSelectedNote());
		}

		moi.reactNoteObjects(moi.propertiesNoteObjects());
	};

	//_ commandsPersistenceTaskStop

	moi.commandsPersistenceTaskStop = function () {
		clearInterval(moi.propertiesPersistenceTask()._OLSKTaskTimerID);
	};

	//_ commandsPersistenceTaskStart

	moi.commandsPersistenceTaskStart = function () {
		OLSKTasks.OLSKTasksTimeoutForTaskObject(moi.propertiesPersistenceTask());
	};

	//_ commandsPersistUnsavedNotes

	moi.commandsPersistUnsavedNotes = function () {
		moi.propertiesUnsavedNotes().forEach(function(obj) {
			moi.commandsPersistNote(obj);
		});
	};

	//_ commandsPersistNote

	moi.commandsPersistNote = function (inputData) {
		(new Promise(function(resolve, reject) {
			if (inputData === moi.propertiesSelectedNote()) {
				moi.reactPersistenceStatus(OLSKLocalized('WKCAppNotesPersistenceStatusSaving'));
			}

			if (!inputData.WKCNoteID) {
				return moi._commandsPersistNoteCreate(inputData, resolve, reject);
			}

			return moi._commandsPersistNoteUpdate(inputData, resolve, reject);
			
		})).then(function() {
			if (inputData === moi.propertiesSelectedNote()) {
				moi.reactPersistenceStatus(OLSKLocalized('WKCAppNotesPersistenceStatusSaved'), true);
			}

			moi.propertiesUnsavedNotes().splice(moi.propertiesUnsavedNotes().indexOf(inputData), 1);
		}, function(error) {
			if (window.confirm(OLSKLocalized('WKCAppNotesErrorPersistenceSaveDidFail'))) {
				return moi.commandsPersistNote(inputData);
			};

			if (inputData === moi.propertiesSelectedNote()) {
				moi.reactPersistenceStatus(OLSKLocalized('WKCAppNotesPersistenceStatusUnableToSave'));
			}

			throw error;
		});
	};

	//_ _commandsPersistNoteCreate

	moi._commandsPersistNoteCreate = function (inputData, resolve, reject) {
		return resolve(d3.json('<%= OLSKCanonicalFor('WKCRouteAPINotesCreate') %>', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify(inputData),
		}).then(function(responseJSON) {
			Object.assign(inputData, responseJSON);
		}, reject));
	};

	//_ _commandsPersistNoteUpdate

	moi._commandsPersistNoteUpdate = function (inputData, resolve, reject) {
		return resolve(d3.json((<%- OLSKCanonicalSubstitutionFunctionFor('WKCRouteAPINotesUpdate') %>)({
			wkc_note_id: inputData.WKCNoteID,
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify(inputData),
		}));
	};

	//_ commandsPublishNote

	moi.commandsPublishNote = function (inputData) {
		d3.select('#WKCAppNotesPublishStatus').text(OLSKLocalized('WKCAppNotesPublishStatusPublishing'));

		d3.json((<%- OLSKCanonicalSubstitutionFunctionFor('WKCRouteAPINotesPublish') %>)({
			wkc_note_id: inputData.WKCNoteID,
		}), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
			body: JSON.stringify({
				WKCNotePublishStatusIsPublished: true,
			}),
		}).then(function(responseJSON) {
			moi.reactPublishStatus();
		}, function(error) {
			if (window.confirm(OLSKLocalized('WKCAppNotesErrorPublishDidFail'))) {
				return moi.commandsPublishNote(inputData);
			};

			d3.select('#WKCAppNotesPublishStatus').text(OLSKLocalized('WKCAppNotesPublishStatusUnableToPublish'));

			throw error;
		});
	};

	//_ commandsDeleteNoteWithConfirmation

	moi.commandsDeleteNoteWithConfirmation = function (inputData) {
		var persistenceIsCued = !!moi.propertiesPersistenceTask()._OLSKTaskTimerID;

		moi.commandsPersistenceTaskStop();

		if (!window.confirm(OLSKLocalized('WKCAppNotesDeleteConfirmation'))) {
			if (persistenceIsCued) {
				moi.commandsPersistenceTaskStart();
			}

			return;
		};

		moi._commandsDeleteNoteWithoutConfirmation(inputData);
	};

	//_ _commandsDeleteNoteWithoutConfirmation

	moi._commandsDeleteNoteWithoutConfirmation = function (inputData) {
		var persistenceIsCued = !!moi.propertiesPersistenceTask()._OLSKTaskTimerID;

		moi.reactPersistenceStatus(OLSKLocalized('WKCAppNotesPersistenceStatusDeleting'));

		d3.json((<%- OLSKCanonicalSubstitutionFunctionFor('WKCRouteAPINotesDelete') %>)({
			wkc_note_id: inputData.WKCNoteID,
		}), {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'x-client-key': moi.propertiesAPIToken(),
			},
		}).then(function(responseJSON) {
			moi.propertiesNoteObjects(moi.propertiesNoteObjects().filter(function(e) {
				return e !== inputData;
			}));

			moi.propertiesUnsavedNotes(moi.propertiesUnsavedNotes().filter(function(e) {
				return e !== inputData;
			}));

			moi.commandsSelectNote(null);

			moi.reactPersistenceStatus(OLSKLocalized('WKCAppNotesPersistenceStatusDeleted'), true);
		}, function(error) {
			if (window.confirm(OLSKLocalized('WKCAppNotesErrorPersistenceDeleteDidFail'))) {
				return moi._commandsDeleteNoteWithoutConfirmation(inputData);
			};

			moi.reactPersistenceStatus(OLSKLocalized('WKCAppNotesPersistenceStatusUnableToDelete'));

			throw error;
		}).finally(function() {
			if (persistenceIsCued) {
				moi.commandsPersistenceTaskStart();
			}
		});
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
		d3.select('#WKCNotesAppEditorTextarea').attr('disabled', moi.propertiesSelectedNote() ? null : true);

		if (moi.propertiesSelectedNote()) {
			d3.select('#WKCNotesAppEditorTextarea').node().focus();
		}

		d3.selectAll('.WKCAppNotesListItem').classed('WKCAppNotesListItemSelected', function(d) {
			return d === moi.propertiesSelectedNote();
		});

		d3.select('#WKCAppNotesDeleteButton').attr('disabled', moi.propertiesSelectedNote() ? null : undefined);
		d3.select('#WKCAppNotesPublishButton').attr('disabled', moi.propertiesSelectedNote() ? null : undefined);

		if (!moi.propertiesSelectedNote()) {
			return;
		}

		moi.reactPublishStatus();
	};

	//_ reactPublishStatus

	moi.reactPublishStatus = function () {
		d3.select('#WKCAppNotesPublishStatus').html(moi.propertiesSelectedNote().WKCNoteIsPublished ? OLSKLocalized('WKCAppNotesPublishStatusPublished') + '<a href="/' + moi.propertiesSelectedNote().WKCNotePublicID + '" target="_blank">/' + moi.propertiesSelectedNote().WKCNotePublicID + '</a>': nullg);
	};

	//_ reactPersistenceStatus

	moi.reactPersistenceStatus = function (inputData, shouldClear) {
			d3.select('#WKCAppNotesPersistenceStatus').text(inputData);

			if (!shouldClear) {
				return;
			}

			setTimeout(function() {
				d3.select('#WKCAppNotesPersistenceStatus').text(null);
			}, 1000);
	};

	//# SETUP

	//_ setupEverything

	moi.setupEverything = function () {
		moi.setupAPIToken(function () {
			moi.setupNoteObjects(function() {
				moi.setupPersistenceTask();

				d3.select('#WKCAppNotes').classed('WKCAppNotesLoading', false);
			});
		});
	};

	//_ setupAPIToken

	moi.setupAPIToken = function (completionHandler) {
		d3.json('<%= OLSKCanonicalFor('WKCRouteAPIToken') %>', {
			method: 'GET',
		}).then(function(responseJSON) {
			if (!responseJSON.WKCAPIToken) {
				return moi.commandsAlertTokenUnavailable();
			}

			moi.propertiesAPIToken(responseJSON.WKCAPIToken);

			completionHandler();
		}, moi.commandsAlertConnectionError);
	};

	//_ setupNoteObjects

	moi.setupNoteObjects = function (completionHandler) {
		d3.json('<%= OLSKCanonicalFor('WKCRouteAPINotesSearch') %>', {
			method: 'GET',
			headers: {
				'x-client-key': moi.propertiesAPIToken(),
			},
		}).then(function(responseJSON) {
			if (!Array.isArray(responseJSON)) {
				return moi.commandsAlertNotesUnavailable();
			}

			moi.propertiesNoteObjects(responseJSON.map(function(e) {
				return Object.assign(e, {
					WKCNoteDateCreated: new Date(e.WKCNoteDateCreated),
					WKCNoteDateUpdated: new Date(e.WKCNoteDateUpdated),
				});
			}));

			completionHandler();
		}, moi.commandsAlertConnectionError);
	};

	//_ setupPersistenceTask

	moi.setupPersistenceTask = function () {
		moi.propertiesUnsavedNotes([]);

		moi.propertiesPersistenceTask({
			OLSKTaskName: 'WKCTasksEditorPersistence',
			OLSKTaskFireTimeInterval: 3,
			OLSKTaskShouldBePerformed: function() {
				return true;
			},
			OLSKTaskFireLimit: 1,
			OLSKTaskCallback: function () {
				moi.commandsPersistUnsavedNotes();

				delete moi.propertiesPersistenceTask()._OLSKTaskTimerID;
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
