<script lang="ts">
	import Instrumento from '../../model/Instrumento';
	import FormModal from '../../view/FormModal.svelte';
	import PageToolbar from '../../view/PageToolbar.svelte';
	import CardInstrumento from '../../view/cards/CardInstrumento.svelte';
	import Alert from '../../view/Alert.svelte';
	import type { ActionData, PageData } from './$types';
	import DialogModal from '../../view/DialogModal.svelte';

	// Data
	export let data: PageData;
	export let form: ActionData;

	// Instrumento List
	let instrumentos: Instrumento[];
	$: instrumentos = data.instrumentos.map((i: unknown) => Instrumento.fromJson(i));

	// Form
	let formModal: FormModal;
	$: if (form?.success) formModal.close();
	const DEFAULT_INSTRUMENTO = {
		nome: '',
		tipo: '',
		marca: ''
	};

	// Delete
	let deleteModal: DialogModal;
	let instrumentoToDelete: Instrumento | undefined = undefined;
	let deleteResponse: { success: any; message: any } | undefined = undefined;
	async function deleteInstrumento() {
		if (!instrumentoToDelete) throw Error('instrumentoToDelete not set');
		deleteResponse = await fetch(`/instruments/${instrumentoToDelete.idInstrumento}`, {
			method: 'DELETE'
		})
			.then((response) => response.json())
			.then((response) => {
				instrumentos = instrumentos.filter((i) => i != instrumentoToDelete);
				return response;
			})
			.catch((response) => response.json());
	}

	// Prompt events
	function promptEdit(instrumento: Instrumento) {
		formModal.promptEdit(instrumento.toFormData());
	}

	function promptDelete(instrumento: Instrumento) {
		instrumentoToDelete = instrumento;
		deleteModal.show();
	}
</script>

{#if form?.success}
	<Alert type="success">Instrumento {form?.edited ? 'alterado' : 'cadastrado'} com sucesso</Alert>
{/if}
{#if deleteResponse?.success}
	<Alert type="success">Instrumento apagado com sucesso</Alert>
{:else if deleteResponse?.message}
	<Alert type="danger">Erro ao apagar instrumento: {deleteResponse.message}</Alert>
{/if}
<PageToolbar>
	<button
		type="button"
		class="btn btn-success"
		on:click={() => {
			formModal.promptInsert();
		}}
	>
		Cadastrar Instrumento
	</button>
</PageToolbar>
<div class="d-flex flex-wrap justify-content-around">
	{#each instrumentos as instrumento}
		<CardInstrumento
			{instrumento}
			on:edit-clicked={() => promptEdit(instrumento)}
			on:delete-clicked={() => promptDelete(instrumento)}
		/>
	{:else}
		<h1 class="m-4">Nenhum instrumento cadastrado</h1>
	{/each}
</div>

<FormModal
	bind:this={formModal}
	id="instrumentForm"
	title="Cadastrar Instruento"
	initialValues={DEFAULT_INSTRUMENTO}
	action="/instruments"
>
	{#if form?.error} <Alert type="danger">{form.error}</Alert>{/if}
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

<DialogModal
	bind:this={deleteModal}
	id="deleteModal"
	title="Deletar Instrumento"
	onConfirm={deleteInstrumento}
>
	<p>Você tem certeza que quer deletar o instrumento {instrumentoToDelete?.nome}</p>
</DialogModal>
