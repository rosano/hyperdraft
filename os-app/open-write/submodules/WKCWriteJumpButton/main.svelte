<script>
export let WKCWriteJumpButtonRecipes = [];
export let WKCWriteJumpButtonDispatchComplete = null;

function interfaceButtonDidClick() {
	setTimeout(function () {
		window.Launchlet.LCHSingletonCreate({
			LCHOptionRecipes: WKCWriteJumpButtonRecipes,
			LCHOptionMode: window.Launchlet.LCHModePreview,
			LCHOptionCompletionHandler: WKCWriteJumpButtonDispatchComplete,
		});
	});
}

function interfaceDidReceiveKeydown() {
	if (event.ctrlKey && event.key === 'r' && WKCWriteJumpButtonRecipes.length) {
		return interfaceButtonDidClick();
	}
}
</script>
<svelte:window on:keydown={ interfaceDidReceiveKeydown }/>

<button on:click={ interfaceButtonDidClick  } class="WKCWriteJumpButton OLSKToolbarButton OLSKLayoutElementTappable OLSKLayoutButtonNoStyle" disabled={ !WKCWriteJumpButtonRecipes.length } accesskey="r" style="background-image: url('/panel/_shared/ui-assets/wIKWriteJump.svg')" title="Jump" tabindex="-1"></button>

<style>
</style>
