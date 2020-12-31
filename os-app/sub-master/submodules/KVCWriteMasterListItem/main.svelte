<script>
export let KVCWriteMasterListItemObject;
export let KVCWriteMasterListItemDispatchTitle;
export let KVCWriteMasterListItemDispatchSnippet;

import KVCWriteLogic from '../../../open-write/ui-logic.js';
</script>

<div class="KVCWriteMasterListItem OLSKCommonEdgeBottom" class:KVCWriteMasterListItemArchived={ KVCWriteMasterListItemObject.KVCNoteIsArchived }>


{#if KVCWriteMasterListItemObject.KVCNoteIsPublic }
	<span class="KVCWriteMasterListItemIsPublic" aria-hidden="true">{ KVCWriteLogic.KVCWriteLogicPublicSymbol() }</span>
{/if}
<strong class="KVCWriteMasterListItemTitle" aria-hidden="true">{ KVCWriteMasterListItemDispatchTitle(KVCWriteMasterListItemObject.KVCNoteBody) }</strong>
<span class="KVCWriteMasterListItemSnippet" aria-hidden="true">{ KVCWriteMasterListItemDispatchSnippet(KVCWriteMasterListItemObject.KVCNoteBody) }</span>

</div>

<style>
.KVCWriteMasterListItem {
	min-height: 46px;
	padding: 10px;

	overflow: hidden;
	text-overflow: ellipsis;

	/* prevent breaking from long urls */
	overflow-wrap: break-word;
	word-wrap: break-word;
	word-break: break-word;
	hyphens: auto;
}

.KVCWriteMasterListItemArchived {
	border-left: 10px solid #cccccc;
	opacity: 0.8;
}

.KVCWriteMasterListItemTitle {
	display: inline-block;
}

.KVCWriteMasterListItemSnippet {
	display: block;
	margin-top: 5px;
}
</style>
