<script>
export let WIKWriteFooterStorageStatus = '';

import OLSKToolbar from 'OLSKToolbar';
import OLSKToolbarElementGroup from 'OLSKToolbarElementGroup';
import OLSKServiceWorker from '../_shared/__external/OLSKServiceWorker/main.svelte';

import {
	OLSKLocalized,
	_WIKIsTestingBehaviour,
} from '../_shared/common/global.js';

import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

const mod = {

	// INTERFACE

	InterfaceStorageButtonDidClick () {
		dispatch('WIKWriteFooterDispatchStorage')
	},

	InterfaceExportButtonDidClick () {
		dispatch('FooterDispatchExport');
	},

	InterfaceImportButtonDidClick (event) {
		let inputElement = event.target;
		let reader = new FileReader();
		
		reader.onload = function (event) {
			dispatch('FooterDispatchImport', event.target.result);
			
			inputElement.value = null;
		};

		reader.readAsText(event.target.files.item(0));
	},

};
</script>

<footer>
	<OLSKToolbar OLSKToolbarJustify={ true }>
		<OLSKToolbarElementGroup>
			<button on:click={ () => window.location.reload() } class="OLSKToolbarButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" title={ OLSKLocalized('WKCWriteFooterToolbarReloadButtonText') } style="background-image: url('/panel/_shared/ui-assets/wIKSharedReload.svg')" id="WKCWriteReloadButton"></button>

			<!-- <button on:click={ mod.InterfaceExportButtonDidClick }>Export</button> -->

			<!-- <input type="file" accept=".json" on:change={ mod.InterfaceImportButtonDidClick } /> -->
		</OLSKToolbarElementGroup>

		<div>
			<div class="WIKWriteFooterStorageStatus">{ WIKWriteFooterStorageStatus }</div>
			<button class="WIKWriteFooterStorageButton OLSKLayoutButtonNoStyle OLSKLayoutElementTappable" title={ OLSKLocalized('WIKWriteFooterStorageButtonText') } on:click={ mod.InterfaceStorageButtonDidClick } class:OSWIconVisible={ false }>
				<img src="/panel/open-write/submodules/WIKWriteFooter/ui-images/WIKWriteFooterStorageButton.svg">
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

footer :global(.OLSKToolbar) {
	flex-grow: 1;
}

footer :global(.OLSKToolbar > div) {
	display: flex;
	align-items: center;
}

.WIKWriteFooterStorageButton {
	padding: 0 5px;
}

.WIKWriteFooterStorageButton :global(svg,img) {
	width: 20px;
	height: 20px;
}

.WIKWriteFooterStorageButton :global(path) {
	fill: black;
}

.WIKWriteFooterStorageButton.OSWIconVisible img {
	display: none;
}
</style>
