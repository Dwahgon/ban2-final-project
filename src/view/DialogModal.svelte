<script lang="ts">
	import type { Modal } from 'bootstrap';
	import type { BootstrapColors } from '../utils/types';
	import { onMount } from 'svelte';

	export let id: string;
	export let title: string;

	export let confirmText: string = 'Confirmar';
	export let confirmColor: BootstrapColors = 'success';
	export let cancelText: string = 'Cancelar';
	export let cancelColor: BootstrapColors = 'secondary';
	export let onConfirm: () => void = () => 0;
	export let onNotConfirm: (canceled: boolean) => void = () => 0;

	let modalElement: HTMLDivElement;
	let modal: Modal;

	onMount(() => {
		import('bootstrap').then(({ Modal }) => {
			modal = new Modal(modalElement);
		});
	});

	export function show() {
		modal.show();
	}
</script>

<div
	class="modal fade"
	{id}
	tabindex="-1"
	aria-labelledby="{id}Label"
	aria-hidden="true"
	bind:this={modalElement}
>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="{id}Label">{title}</h1>
				<button
					type="button"
					class="btn-close"
					data-bs-dismiss="modal"
					aria-label="Close"
					on:click={() => onNotConfirm(false)}
				/>
			</div>
			<div class="modal-body">
				<slot />
			</div>
			<div class="modal-footer">
				<button
					type="button"
					class="btn btn-{cancelColor}"
					data-bs-dismiss="modal"
					on:click={() => onNotConfirm(true)}>{cancelText}</button
				>
				<button
					type="submit"
					class="btn btn-{confirmColor}"
					data-bs-dismiss="modal"
					on:click={onConfirm}>{confirmText}</button
				>
			</div>
		</div>
	</div>
</div>
