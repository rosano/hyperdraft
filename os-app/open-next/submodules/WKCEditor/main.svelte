<script>
export let WKCEditorInitialValue;
export let WKCEditorDispatchUpdate;
export let WKCEditorDispatchOpen;
export let WKCEditorDispatchReady;

export const WKCEditorFocus = function () {
	mod.CommandConfigureEditor(function (inputData) {
		inputData.focus();
	});
};

export const WKCEditorSetDocument = function (inputData) {
	mod._ValueEditorInstance.setValue(inputData);
	mod._ValueEditorInstance.getDoc().clearHistory();
};

export const WKCEditorSetCursor = function (param1, param2) {
	mod.CommandConfigureEditor(function (inputData) {
		inputData.setCursor(CodeMirror.Pos(param1, param2));
	});
};

import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting';
import WKCEditorLogic from './ui-logic.js';

const mod = {

	// VALUE

	_ValueEditorElement: undefined,

	_ValueEditorInstance: undefined,

	_ValueEditorPostInitializeQueue: [],

	// INTERFACE

	InterfaceEditorFieldDebugDidInput () {
		WKCEditorDispatchUpdate(this.value);
	},

	// COMMAND

	CommandConfigureEditor (inputData) {
		if (mod._ValueEditorInstance) {
			return inputData(mod._ValueEditorInstance);
		};

		mod._ValueEditorPostInitializeQueue.push(inputData);
	},

	CommandOpenCursorObject (inputData) {
		let cursor = mod._ValueEditorInstance.getCursor();

		let currentObject = WKCEditorLogic.WKCEditorLineObjectsFor(mod._ValueEditorInstance.getLineTokens(cursor.line)).filter(function (e) {
			return Math.max(e.start, Math.min(e.end, cursor.ch)) === cursor.ch;
		}).shift();

		if (!currentObject.type.match('link')) {
			return;
		}

		mod.CommandOpenTextObject(currentObject.string);
	},

	CommandOpenTextObject (inputData) {
		if (URLParse(inputData, {}).protocol) {
			return window.open(inputData, '_blank');
		}

		let match = inputData.match(/\[\[(.*)\]\]/).pop();
		if (!match) {
			return;
		}

		event.stopPropagation();

		WKCEditorDispatchOpen(match);
	},

	// SETUP

	SetupEverything () {
		mod.SetupEditor();
	},

	SetupEditor () {
		if (OLSK_TESTING_BEHAVIOUR()) {
			return;
		}

		mod._ValueEditorInstance = CodeMirror.fromTextArea(mod._ValueEditorElement, {
			mode: {
			  name: 'gfm',
			  gitHubSpice: false,
			  emoji: false,
			},
			
			lineNumbers: false,
			lineWrapping: true,

			extraKeys: {
			  Enter: 'newlineAndIndentContinueMarkdownList',
			  'Cmd-Enter': mod.CommandOpenCursorObject,
			  'Ctrl-Enter': mod.CommandOpenCursorObject,
			  'Cmd-H' (event) {
			  	return event.preventDefault();
			  },
			  Esc () {}, // overwrite to control via other binding
			  Tab: false,
			},

			theme: 'wkc',

			keyMap: 'sublime',
		});

		mod._ValueEditorInstance.setValue(WKCEditorInitialValue);

		mod._ValueEditorInstance.on('change', function (instance, changeObject) {
			if (changeObject.origin === 'setValue') {
				return;
			}

			WKCEditorDispatchUpdate(instance.getValue());
		});

		mod._ValueEditorPostInitializeQueue.splice(0, mod._ValueEditorPostInitializeQueue.length).forEach(function(e) {
			return e(mod._ValueEditorInstance);
		});

		WKCEditorDispatchReady();
	},

	// LIFECYCLE

	LifecycleComponentDidMount () {
		mod.SetupEverything();
	},

};

import { onMount } from 'svelte';
onMount(mod.LifecycleComponentDidMount);
</script>

<div class="WKCEditor">
	{#if OLSK_TESTING_BEHAVIOUR()}
		<textarea class="WKCEditorFieldDebug" on:input={ mod.InterfaceEditorFieldDebugDidInput }>{ WKCEditorInitialValue }</textarea>
	{/if}
	
	<textarea bind:this={ mod._ValueEditorElement }></textarea>
</div>
