/*!
 * wikiavec
 * Copyright(c) 2018 Rosano Coutinho
 * MIT Licensed
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.WKControl = global.WKControl || {})));
}(this, (function (exports) { 'use strict';

	var moi = exports;

	//# PROPERTIES

	//_ WKPropertiesNoteObjects

	moi.WKPropertiesNoteObjects = function (inputData, sharedData) {
		if (typeof inputData === 'undefined') {
			return d3.selectAll('.WKCAppNotesListItem').data();
		}

		moi.WKReactNoteObjects(inputData.sort(WKLogic.WKLogicListSort), sharedData);
	};

	//_ WKPropertiesSelectedNote

	moi.WKPropertiesSelectedNote = function (inputData, sharedData) {
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

	//# COMMANDS

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

	moi.WKCommandsAddNote = function (sharedData) {
		moi.WKPropertiesNoteObjects(moi.WKPropertiesNoteObjects(undefined, sharedData).concat(WKControl.WKDataNewNoteObject()), sharedData);

		moi.WKPropertiesSelectedNote(moi.WKPropertiesNoteObjects(undefined, sharedData).shift(), sharedData);
	};

	//_ WKCommandsSelectNote

	moi.WKCommandsSelectNote = function (item, sharedData) {
		moi.WKPropertiesSelectedNote(item, sharedData);
	};

	//_ WKCommandsDeleteWithConfirmation

	moi.WKCommandsDeleteWithConfirmation = function (sharedData) {
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

	moi._WKCommandsDeleteWithoutConfirmation = function (sharedData) {
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

	moi.WKReactNoteObjects = function (noteObjects, sharedData) {
		var selection = d3.select('#WKCAppNotesList')
			.selectAll('.WKCAppNotesListItem').data(noteObjects);
		
		selection.enter()
			.append('div')
				.attr('class', 'WKCAppNotesListItem')
				.on('click', function(obj) {
					WKControl.WKCommandsSelectNote(obj, sharedData);
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

	moi.WKReactSelectedNote = function (sharedData) {
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

	Object.defineProperty(exports, '__esModule', { value: true });

})));
