<script>
export let WKCEditorInitialValue;
export let WKCEditorDispatchUpdate;

export const WKCEditorSetDocument = function (inputData) {
	mod._ValueEditorInstance.setValue(inputData);
	mod._ValueEditorInstance.getDoc().clearHistory();
}

export const WKCEditorConfigure = function (e) {
	// console.log(mod._ValueEditorInstance ? 'run' : 'queue', e);
	return mod._ValueEditorInstance ? e(mod._ValueEditorInstance) : mod._ValueEditorPostInitializeQueue.push(e);
};

import { OLSK_TESTING_BEHAVIOUR } from 'OLSKTesting';

const mod = {

	// VALUE

	_ValueEditorElement: undefined,

	_ValueEditorInstance: undefined,

	_ValueEditorPostInitializeQueue: [],

	// INTERFACE

	InterfaceEditorFieldDebugDidInput () {
		WKCEditorDispatchUpdate(this.value);
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
			  'Cmd-Enter': openCursorObject,
			  'Ctrl-Enter': openCursorObject,
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

		// console.log(mod._ValueEditorPostInitializeQueue);
		
		mod._ValueEditorPostInitializeQueue.splice(0, mod._ValueEditorPostInitializeQueue.length).forEach(function(e) {
			return e(mod._ValueEditorInstance);
		});
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
