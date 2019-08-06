<script>
export let inputData = [];

function interfaceButtonDidClick() {
	setTimeout(function () {
		window.Launchlet.instanceCreate(inputData, {
			runMode: window.Launchlet.kRunModeJump,
		});
	});
}

function interfaceDidReceiveKeydown() {
	if (event.ctrlKey && event.key === 'r' && inputData.length) {
		return interfaceButtonDidClick();
	}
}
</script>
<svelte:window on:keydown={ interfaceDidReceiveKeydown }/>

<button on:click={ interfaceButtonDidClick  } class="WKCWriteJumpButton WKCSharedToolbarButton WKCSharedElementTappable WKCSharedButtonNoStyle" disabled={ !inputData.length } accesskey="r" style="background-image: url('/panel/_shared/ui-assets/wIKWriteJump.svg')" title="Jump" tabindex="-1"></button>

<style>
</style>
