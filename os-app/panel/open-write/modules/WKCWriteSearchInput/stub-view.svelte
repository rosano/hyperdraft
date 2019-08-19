<script>
export let TestSearchInputText = '';

import Module from './main.svelte';
import { OLSKLocalized } from './../../../../_shared/common/global.js'

import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();
function SearchInputDispatchClear() {
	dispatch('SearchInputDispatchClear');
}
</script>

<Module SearchInputText={ TestSearchInputText } OLSKLocalized={ OLSKLocalized } on:SearchInputDispatchClear={ SearchInputDispatchClear } />
