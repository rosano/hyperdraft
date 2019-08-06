<script>
export let inputData = '';

import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
function interfaceButtonDidClick() {
	dispatch('WKCWriteSearchInputClearButtonDidClick', 'detail value');
}
</script>

<div class="Container">

<input bind:value={ inputData } placeholder="Filter or create" accesskey="f" class="WKCWriteSearchInput" autofocus />

{#if inputData}
	<button on:click={ interfaceButtonDidClick } class="WKCWriteSearchInputClearButton WKCSharedElementTappable WKCSharedButtonNoStyle" style="background-image: url('/panel/_shared/ui-assets/wIKFilterClear.svg')" title="Clear text"></button>
{/if}

</div>

<style>
.Container {
	display: inline-block;

	/* @ContainerStation:Parent */
	position: relative;
}

input {
	padding: 4px;
	margin: 0;
	border: 1px solid #e6e6e6;
	border-radius: 5px;

	text-indent: 2px;
	line-height: 1.4;

	/* WKCSharedToolbarFlexboxChild */
	flex-grow: 1;
}

.WKCWriteSearchInputClearButton {
	--WKCWriteSearchInputClearButtonSize: 24px;

	width: var(--WKCWriteSearchInputClearButtonSize);
	height: var(--WKCWriteSearchInputClearButtonSize);

	background-size: cover;

	/* @ContainerStation:Child */
	position: absolute;
	right: 4px;
	top: 50%;
	margin-top: calc(-1 * var(--WKCWriteSearchInputClearButtonSize) / 2);
}

@media screen and (max-width: 760px) {

input {
	height: 30px;

	font-size: 14px;

	/* MobileSafariRemoveDefaultInputStyle */
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
}

}

</style>
