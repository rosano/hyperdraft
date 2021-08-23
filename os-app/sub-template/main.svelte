<script>
export let KVCWriteTemplateData;
export let KVCWriteTemplateDispatchUpdate;

import { OLSKLocalized } from 'OLSKInternational';

const mod = {

	// INTERFACE

	InterfaceUpdateButtonDidClick () {
		KVCWriteTemplateDispatchUpdate(KVCWriteTemplateData);
	},

};
</script>

<div class="KVCWriteTemplate OLSKDecor OLSKDecorBigForm">

<p>
	<textarea class="KVCWriteTemplateDataField" placeholder={ OLSKLocalized('KVCWriteTemplateDataFieldText') } bind:value={ KVCWriteTemplateData }></textarea>
</p>

<p>
	<button class="KVCWriteTemplateUpdateButton" on:click={ mod.InterfaceUpdateButtonDidClick }>{ OLSKLocalized('KVCWriteTemplateUpdateButtonText') }</button>
</p>

</div>

<style>
</style>
