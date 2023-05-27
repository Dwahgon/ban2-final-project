<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Modal } from 'bootstrap';
	import { onMount } from 'svelte';
	import { setFormValues } from '../../utils/utils';

	export let id: string;
	export let title: string;
	export let initialValues: any;
	export let action: string;
	let modalElement: HTMLDivElement;
	let modal: Modal;
	let editingId: string = '';
	let formElement: HTMLFormElement;

	onMount(() => {
		import('bootstrap').then(({ Modal }) => {
			modal = new Modal(modalElement);
		});
	});

	function resetForm() {
		formElement.reset();
		setFormValues(initialValues, formElement);
	}

	export function close() {
		resetForm();
		modal.hide();
	}

	export function promptInsert() {
		resetForm();
		editingId = '';
		modal.show();
	}

	export function promptEdit(values: any) {
		setFormValues(values, formElement);
		editingId = values.id;
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
				<button type="button" class="btn-close" on:click={() => modal.hide()} aria-label="Close" />
			</div>
			<div class="modal-body">
				<form
					id="{id}-form"
					bind:this={formElement}
					use:enhance
					on:submit={() => modalElement.scrollTo({ top: 0, behavior: 'smooth' })}
					method="POST"
					{action}
				>
					<input type="hidden" name="id" value={editingId} />
					<slot />
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" on:click={() => modal.hide()}>Fechar</button
				>
				<button type="submit" class="btn btn-primary" form="{id}-form">Salvar</button>
			</div>
		</div>
	</div>
</div>
