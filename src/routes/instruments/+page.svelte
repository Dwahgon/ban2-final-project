<script lang="ts">
	import Instrumento from '../../model/Instrumento';
	import Alert from '../../view/Alert.svelte';
	import DialogModal from '../../view/DialogModal.svelte';
	import PageToolbar from '../../view/PageToolbar.svelte';
	import CardInstrumento from '../../view/cards/CardInstrumento.svelte';
	import InstrumentoFormModal from '../../view/form-modals/InstrumentoFormModal.svelte';
	import type { ActionData, PageData } from './$types';

	// Data
	export let data: PageData;
	export let form: ActionData;

	// Instrumento List
	let instrumentos: Instrumento[];
	$: instrumentos = data.instrumentos.map((i: unknown) => Instrumento.fromJson(i));

	// Form
	let formModal: InstrumentoFormModal;

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
	{#each instrumentos.sort((i1, i2) => i1.nome.localeCompare(i2.nome)) as instrumento}
		<CardInstrumento
			{instrumento}
			on:edit-clicked={() => formModal.promptEdit(instrumento)}
			on:delete-clicked={() => promptDelete(instrumento)}
		/>
	{:else}
		<h1 class="m-4">Nenhum instrumento cadastrado</h1>
	{/each}
</div>

<InstrumentoFormModal bind:this={formModal} formActionData={form} />
<DialogModal
	bind:this={deleteModal}
	id="deleteModal"
	title="Deletar Instrumento"
	onConfirm={deleteInstrumento}
>
	<p>Você tem certeza que quer deletar o instrumento {instrumentoToDelete?.nome}</p>
</DialogModal>
