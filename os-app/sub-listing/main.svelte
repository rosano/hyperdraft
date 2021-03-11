<script>
export let KVCWriteListItemObject;

import KVCWriteLogic from '../open-write/ui-logic.js';
import KVCTemplate from '../_shared/KVCTemplate/main.js';
import OLSKString from 'OLSKString';
</script>

<div class="KVCWriteListItem OLSKCommonEdgeBottom" class:KVCWriteListItemArchived={ KVCWriteListItemObject.KVCNoteIsArchived }>

{#if KVCWriteListItemObject.KVCNoteIsPublic }
	<span class="KVCWriteListItemIsPublic" aria-hidden="true">{ KVCWriteLogic.KVCWriteLogicPublicSymbol() }</span>
{/if}

<strong class="KVCWriteListItemTitle" aria-hidden="true">{ KVCTemplate.KVCTemplateTruncated(KVCTemplate.KVCTemplatePlaintextTitle(KVCWriteListItemObject.KVCNoteBody)) }</strong>
<span class="KVCWriteListItemSnippet" aria-hidden="true">{ OLSKString.OLSKStringSnippet(KVCTemplate.KVCTemplatePlaintextBody(KVCWriteListItemObject.KVCNoteBody)) }</span>

</div>

<style>
.KVCWriteListItem {
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

.KVCWriteListItemArchived {
	border-left: 10px solid #cccccc;
	opacity: 0.8;
}

.KVCWriteListItemTitle {
	display: inline-block;
}

.KVCWriteListItemSnippet {
	display: block;
	margin-top: 5px;
}
</style>
