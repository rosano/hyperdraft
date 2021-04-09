<script>
export let KVCWriteInputItem;
export let KVCWriteInputKey;
export let KVCWriteInputDispatchHeaderTokens;
export let KVCWriteInputDispatchUpdate;
export let KVCWriteInputDispatchOpen;
export let KVCWriteInputDispatchReady;

export const modPublic = {

	_KVCWriteInputTriggerUpdate () {
		mod.ControlConfigureEditor(function (inputData) {
			inputData.setValue(KVCWriteInputItem[KVCWriteInputKey]);
		});
	},

	KVCWriteInputFocus () {
		mod.ControlConfigureEditor(function (inputData) {
			inputData.focus();
		});
	},

	KVCWriteInputSetCursor (param1, param2) {
		mod.ControlConfigureEditor(function (inputData) {
			inputData.setCursor(CodeMirror.Pos(param1, param2));
		});
	},

	KVCWriteInputScrollIntoView (param1, param2) {
		mod.ControlConfigureEditor(function (inputData) {
			inputData.scrollIntoView(CodeMirror.Pos(param1, param2), 300);
		});
	},

	KVCWriteInputSetSelection (param1, param2, param3, param4) {
		mod.ControlConfigureEditor(function (inputData) {
			inputData.setSelection(CodeMirror.Pos(param1, param2), CodeMirror.Pos(param3, param4));
		});
	},

};

import { OLSK_SPEC_UI } from 'OLSKSpec';
import KVCWriteInputLogic from './ui-logic.js';

const mod = {

	// VALUE

	_ValueEditorElement: undefined,

	_ValueEditorInstance: undefined,

	_ValueEditorPostInitializeQueue: [],
	
	// INTERFACE

	InterfaceWindowDidKeydown (event) {
		if (event.key !== 'Escape') {
			return;
		}

		if (window.Launchlet.LCHSingletonExists()) {
			return;
		}

		if (!mod._ValueEditorInstance) {
			return;
		}

		if (mod._ValueEditorInstance.getDoc().listSelections().length <= 1) {
			return;
		}

		mod._ValueEditorInstance.setSelections(mod._ValueEditorInstance.getDoc().listSelections().slice(0, 1));
	},

	InterfaceEditorDidTouchDown (instance, event) {
		if (!event.target.className.match('cm-link'))  {
			return;
		}

		event.preventDefault();

		mod._ValueEditorInstance.setCursor(CodeMirror.posFromMouse(mod._ValueEditorInstance, event));

	},

	InterfaceEditorDidTouchUp (event) {
		if (!event.target.className.match('cm-link'))  {
			return;
		}

		mod.ControlOpenCursorObject();
	},

	InterfaceEditorFieldDebugDidInput () {
		mod.ReactValueInput(this.value)
	},

	// CONTROL

	ControlConfigureEditor (inputData) {
		if (OLSK_SPEC_UI()) {
			return;
		}
		
		if (mod._ValueEditorInstance) {
			return inputData(mod._ValueEditorInstance);
		};

		mod._ValueEditorPostInitializeQueue.push(inputData);
	},

	ControlOpenCursorObject () {
		const cursor = mod._ValueEditorInstance.getCursor();

		const lineObjects = KVCWriteInputLogic.KVCWriteInputLineObjectsFor(mod._ValueEditorInstance.getLineTokens(cursor.line)).filter(function (e) {
			return Math.max(e.start, Math.min(e.end, cursor.ch)) >= cursor.ch;
		});

		const currentObject = lineObjects.shift();

		if (!currentObject || !currentObject.type || !currentObject.type.match('link')) {
			return;
		}

		mod.ControlOpenTextObject(currentObject.string, (lineObjects.shift() || {}).string);
	},

	ControlOpenTextObject (inputData, indirect = '') {
		const url = [inputData, indirect.slice(1, -1)].filter(function (e) {
			try {
				return (new URL('', e)).hostname;
			} catch (err) {
				return false;
			}
			
		}).shift();

		if (url) {
			return window.open(url, '_blank');
		}

		const match = [
			(indirect.match(/^\((.*)\)/) || []).pop(),
			(inputData.match(/\[\[(.*)\]\]/) || []).pop(),
			].filter(function (e) {
			return !!e;
		}).shift();

		if (!match) {
			return;
		}

		// event.stopPropagation();

		KVCWriteInputDispatchOpen(match);
	},

	// SETUP

	SetupEverything () {
		mod.SetupEditor();
	},

	SetupEditor () {
		if (OLSK_SPEC_UI()) {
 			return mod.ReactValueSet(KVCWriteInputItem[KVCWriteInputKey]);
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
			  'Cmd-Enter': mod.ControlOpenCursorObject,
			  'Ctrl-Enter': mod.ControlOpenCursorObject,
			  'Cmd-H' (event) {
			  	return event.preventDefault();
			  },
			  Esc () {}, // overwrite to control via other binding
			  Tab: false,
			},

			theme: 'wkc',

			keyMap: 'sublime',
		});

		if (window.OLSK_DEMO && !window.OLSKDemoEditor) {
			window.OLSKDemoEditor = mod._ValueEditorInstance;
		}

		mod._ValueEditorInstance.on('change', function (instance, changeObject) {
			if (changeObject.origin === 'setValue' && !window.OLSK_DEMO) {
				return mod.ReactValueSet(instance.getValue());
			}

			mod.ReactValueInput(KVCWriteInputItem[KVCWriteInputKey] = instance.getValue());
		});

		mod._ValueEditorPostInitializeQueue.splice(0, mod._ValueEditorPostInitializeQueue.length).forEach(function(e) {
			return e(mod._ValueEditorInstance);
		});

		mod._ValueEditorInstance.setValue(KVCWriteInputItem[KVCWriteInputKey]);

		mod._ValueEditorInstance.on('keydown', function (instance, event) {
			if (!navigator.platform.match(/mac/i)) {
				return;
			}

			if (!navigator.userAgent.match(/^((?!chrome|android).)*safari/i)) {
				return;
			}

			if (!event.altKey || !event.ctrlKey) {
				return;
			}

			let elements = document.querySelectorAll('[accesskey]');

			if (!elements.length) {
				return;
			}

			let match = [].slice.call(elements).filter(function (e) {
				return e.getAttribute('accesskey') === event.key;
			}).shift();

			if (!match) {
				return;
			}

			event.preventDefault();

			setTimeout(function () {
				match.focus();
			});
		});

		mod._ValueEditorInstance.on('mousedown', mod.InterfaceEditorDidTouchDown);

		mod._ValueEditorInstance.on('touchstart', mod.InterfaceEditorDidTouchDown);

		document.querySelector('.CodeMirror').addEventListener('mouseup', mod.InterfaceEditorDidTouchUp);

		document.querySelector('.CodeMirror').addEventListener('touchend', mod.InterfaceEditorDidTouchUp);

		KVCWriteInputDispatchReady();
	},

	// REACT

	ReactValueSet (inputData) {
		mod._ReactValueHeaderTokens(inputData);
	},

	ReactValueInput (inputData) {
		KVCWriteInputDispatchUpdate();

		mod._ReactValueHeaderTokens(inputData);
	},

	_ReactValueHeaderTokens (inputData) {
		KVCWriteInputDispatchHeaderTokens(KVCWriteInputLogic.KVCWriteInputHeaderTokensFrom(inputData.split('\n').map(function (e, i) {
			return KVCWriteInputLogic.KVCWriteInputLineObjectsFor(OLSK_SPEC_UI() ? KVCWriteInputLogic.uStubLineTokensFor(e) : mod._ValueEditorInstance.getLineTokens(i));
		})));
	},

	// LIFECYCLE

	LifecycleComponentDidMount () {
		mod.SetupEverything();
	},

};

let __PreviousItem;
const __MessageItemDidChange = function (inputData) {
	if (!mod._ValueEditorInstance) {
		__PreviousItem = inputData;

		return;
	}

	if (__PreviousItem === inputData) {
		return;
	}

	__PreviousItem = inputData;

	mod._ValueEditorInstance.setValue(KVCWriteInputItem[KVCWriteInputKey]);
	mod._ValueEditorInstance.getDoc().clearHistory();
};

$: {
	__MessageItemDidChange(KVCWriteInputItem)
};

import { onMount } from 'svelte';
onMount(mod.LifecycleComponentDidMount);
</script>
<svelte:window on:keydown={ mod.InterfaceWindowDidKeydown } />
<svelte:options accessors />

<div class="KVCWriteInput">
	{#if OLSK_SPEC_UI()}
		<textarea class="KVCWriteInputFieldDebug" bind:value={ KVCWriteInputItem[KVCWriteInputKey] } on:input={ mod.InterfaceEditorFieldDebugDidInput }></textarea>
	{/if}
	
	{#if !OLSK_SPEC_UI()}
		<textarea bind:this={ mod._ValueEditorElement }></textarea>
	{/if}
</div>
