<script>
export let TestSearchInputText = '';
export let TestSearchInputPlaceholder = '';

import Module from './main.svelte';
import { OLSKLocalized } from './../../../../_shared/common/global.js'

import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
function SearchInputDispatchClear() {
	dispatch('SearchInputDispatchClear');
}
</script>

<Module SearchInputText={ TestSearchInputText } SearchInputPlaceholder={ TestSearchInputPlaceholder } OLSKLocalized={ OLSKLocalized } on:SearchInputDispatchClear={ SearchInputDispatchClear } />
