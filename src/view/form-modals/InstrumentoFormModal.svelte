<script lang="ts">
	import type Instrumento from '../../model/Instrumento';
	import type { ActionData } from '../../routes/instruments/$types';
	import Alert from '../Alert.svelte';
	import FormModal from './FormModal.svelte';

	export let formActionData: ActionData;
	$: if (formActionData?.success) formModal.close();

	let formModal: FormModal;

	const DEFAULT_INSTRUMENTO = {
		nome: '',
		tipo: '',
		marca: ''
	};

	export function promptInsert() {
		formModal.promptInsert();
	}

	export function promptEdit(instrumento: Instrumento) {
		formModal.promptEdit(instrumento.toFormData());
	}
</script>

<FormModal
	bind:this={formModal}
	id="instrumentForm"
	title="Cadastrar Instrumento"
	initialValues={DEFAULT_INSTRUMENTO}
	action="/instruments"
>
	{#if formActionData?.error} <Alert type="danger">{formActionData.error}</Alert>{/if}
	<div class="mb-3">
		<label for="nameInput" class="form-label">Nome</label>
		<input type="text" class="form-control" name="nome" id="nameInput" placeholder="Guitarra" />
	</div>
	<div class="mb-3">
		<label for="typeInput" class="form-label">Tipo</label>
		<input type="text" class="form-control" name="tipo" id="typeInput" placeholder="Corda" />
	</div>
	<div class="mb-3">
		<label for="brandInput" class="form-label">Marca</label>
		<input type="text" class="form-control" name="marca" id="brandInput" placeholder="Gibson" />
	</div>
</FormModal>
