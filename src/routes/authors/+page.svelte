<script lang="ts">
	import { Autor, Banda, Musico } from '../../model/Autores';
	import Instrumento from '../../model/Instrumento';
	import Alert from '../../view/Alert.svelte';
	import DialogModal from '../../view/DialogModal.svelte';
	import NavTabs from '../../view/NavTabs.svelte';
	import PageToolbar from '../../view/PageToolbar.svelte';
	import CardAutor from '../../view/cards/CardAutor.svelte';
	import AutorFormModal from '../../view/form-modals/AutorFormModal.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	export let selectedTab: string;

	let autores: Autor[] = [];
	let instrumentos: Instrumento[] = [];
	let formModal: AutorFormModal;
	let autorToDelete: Autor | undefined = undefined;
	let deleteResponse: { success: any; message: any } | undefined = undefined;
	let deleteAutorModal: DialogModal;

	function updateData() {
		const autoresGroupedByType = data.autores.reduce<Map<'m' | 'b', Autor[]>>(
			(map, autor) => {
				map.get(autor._tipo)?.push(autor);
				return map;
			},
			new Map([
				['m', []],
				['b', []]
			])
		);
		instrumentos = data.instrumentos.map((i) => Instrumento.fromJson(i));
		const musicos =
			autoresGroupedByType.get('m')?.map((a) => Musico.fromJson(a, [], instrumentos)) || [];
		const bandas = autoresGroupedByType.get('b')?.map((a) => Banda.fromJson(a, musicos)) || [];
		autores = [...musicos, ...bandas];
	}

	$: data, updateData();

	async function deleteAutor() {
		if (!autorToDelete) throw Error('autorToDelete not set');
		deleteResponse = await fetch(`/authors/${autorToDelete.idAutor}`, {
			method: 'DELETE'
		})
			.then((response) => response.json())
			.then((response) => {
				autores = autores.filter((a) => a != autorToDelete);
				return response;
			})
			.catch((response) => response.json());
	}

	function promptDeleteAutor(autor: Autor) {
		autorToDelete = autor;
		deleteAutorModal.show();
	}
</script>

{#if form?.success}
	<Alert type="success">Autor {form?.edited ? 'alterado' : 'cadastrado'} com sucesso</Alert>
{/if}
{#if deleteResponse?.success}
	<Alert type="success">Autor apagado com sucesso</Alert>
{:else if deleteResponse?.message}
	<Alert type="danger">Erro ao apagar autor: {deleteResponse.message}</Alert>
{/if}
<PageToolbar>
	<button
		type="button"
		class="btn btn-success"
		on:click={() => {
			formModal.promptInsert();
		}}
	>
		Cadastrar Autor
	</button>
</PageToolbar>
<NavTabs tabs={['Todos', 'Músicos', 'Bandas']} bind:selectedTab />
<div class="tab-content">
	<div class="tab-pane fade show active">
		<div class="d-flex flex-wrap justify-content-around align-items-baseline">
			{#each autores.sort((a1, a2) => a1.nome.localeCompare(a2.nome)) as autor}
				{#if selectedTab == 'Todos' || (selectedTab == 'Músicos' && autor instanceof Musico) || (selectedTab == 'Bandas' && autor instanceof Banda)}
					<CardAutor
						{autor}
						on:edit-clicked={() => formModal.promptEditAutor(autor)}
						on:delete-clicked={() => promptDeleteAutor(autor)}
					/>
				{/if}
			{:else}
				<h1 class="m-4">
					{selectedTab == 'Músicos'
						? 'Nenhum músico cadastrado'
						: selectedTab == 'Bandas'
						? 'Nenhuma banda cadastrada'
						: 'Nenhum autor cadastrado'}
				</h1>
			{/each}
		</div>
	</div>
</div>

<!-- Form Modal -->
<AutorFormModal bind:this={formModal} {instrumentos} {autores} formActionData={form} />

<DialogModal
	bind:this={deleteAutorModal}
	id="deleteAutorModal"
	title="Deletar autor"
	onConfirm={deleteAutor}
>
	<p>Você tem certeza que quer deletar o autor {autorToDelete?.nome}</p>
</DialogModal>
