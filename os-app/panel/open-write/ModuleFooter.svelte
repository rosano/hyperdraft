<script>
export let WIKWriteFooterStorageStatus = '';

import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';
import OLSKServiceWorker from '../../_shared/__external/OLSKServiceWorker/main.svelte';

import {
	OLSKLocalized,
	_WIKIsTestingBehaviour,
} from '../../_shared/common/global.js';

import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

const mod = {

	// INTERFACE

	InterfaceStorageButtonDidClick () {
		dispatch('WIKWriteFooterDispatchStorage')
	},

};
</script>

<footer>
	<OLSKToolbar OLSKToolbarJustify={ true }>
		<OLSKToolbarElementGroup>
			<button on:click={ () => window.location.reload() } class="OLSKToolbarButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" title={ OLSKLocalized('WKCWriteFooterToolbarReloadButtonText') } style="background-image: url('/panel/_shared/ui-assets/wIKSharedReload.svg')" id="WKCWriteReloadButton"></button>
		</OLSKToolbarElementGroup>

		<div>
			<div class="WIKWriteFooterStorageStatus">{ WIKWriteFooterStorageStatus }</div>
			<button class="WIKWriteFooterStorageButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable" title={ OLSKLocalized('WIKWriteFooterStorageButtonText') } on:click={ mod.InterfaceStorageButtonDidClick } class:OSWIconVisible={ false }>
				<img src="/open-compose/submodules/WIKWriteFooter/ui-images/WIKWriteFooterStorageButton.svg">
			</button>
		</div>
	</OLSKToolbar>
</footer>

{#if !_WIKIsTestingBehaviour()}
	<OLSKServiceWorker OLSKLocalized={ OLSKLocalized } registrationRoute={ window.OLSKCanonicalFor('WKCServiceWorkerRoute') } />
{/if}

<style>
footer {
	border-top: var(--WIKBorderStyle);
}
</style>
