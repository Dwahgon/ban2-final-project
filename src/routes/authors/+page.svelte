<script lang="ts">
	import { Banda, Musico, Autor } from '../../model/Autores';
	import Instrumento from '../../model/Instrumento';
	import Alert from '../../view/Alert.svelte';
	import DialogModal from '../../view/DialogModal.svelte';
	import FormModal from '../../view/FormModal.svelte';
	import ListField from '../../view/ListField.svelte';
	import NavTabs from '../../view/NavTabs.svelte';
	import PageToolbar from '../../view/PageToolbar.svelte';
	import CardAutor from '../../view/cards/CardAutor.svelte';
	import type { ActionData, PageData } from './$types';

	export let data: PageData;
	export let form: ActionData;
	export let selectedTab: string;

	let autores: Autor[] = [];
	let instrumentos: Instrumento[] = [];
	let formModal: FormModal;
	let autorType: string = 'm';
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
		console.log(musicos);
		const bandas = autoresGroupedByType.get('b')?.map((a) => Banda.fromJson(a, musicos)) || [];
		autores = [...musicos, ...bandas];
	}

	$: if (form?.success) formModal.close();
	$: data, updateData();

	const DEFAULT_AUTHOR = {
		nome: '',
		tipo: 'm',
		mEnderecoNumero: '',
		mEnderecoComplemento: '',
		mEnderecoRua: '',
		mEnderecoBairro: '',
		mEnderecoCidade: '',
		mEnderecoEstado: '',
		mEnderecoPais: '',
		mEnderecoTelefone: '',
		mInstrumentos: '',
		bDataFormacao: '',
		bDescricao: '',
		bEstilos: '',
		bMembros: ''
	};

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

	function promptEditAutor(autor: Autor) {
		autorType = autor instanceof Musico ? 'm' : 'b';
		formModal.promptEdit(autor.toFormData());
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
			autorType = DEFAULT_AUTHOR.tipo;
		}}
	>
		Cadastrar Autor
	</button>
</PageToolbar>
<NavTabs tabs={['Todos', 'Músicos', 'Bandas']} bind:selectedTab />
<div class="tab-content">
	<div class="tab-pane fade show active">
		<div class="d-flex flex-wrap justify-content-around">
			{#each autores as autor}
				{#if selectedTab == 'Todos' || (selectedTab == 'Músicos' && autor instanceof Musico) || (selectedTab == 'Bandas' && autor instanceof Banda)}
					<CardAutor
						{autor}
						on:edit-clicked={() => promptEditAutor(autor)}
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
<FormModal
	bind:this={formModal}
	id="authorEditor"
	title="Cadastrar Autor"
	initialValues={DEFAULT_AUTHOR}
	action="/authors"
>
	{#if form?.tipo && form?.missing} <Alert type="danger">Valor de tipo está faltando</Alert>{/if}
	{#if form?.tipo && form?.invalid} <Alert type="danger">Valor de tipo está inválido</Alert>{/if}
	{#if form?.error} <Alert type="danger">{form.error}</Alert>{/if}
	<div class="mb-3">
		<label for="nameInput" class="form-label">Nome</label>
		<input type="text" class="form-control" name="nome" id="nameInput" placeholder="João Silva" />
	</div>
	<div class="mb-3">
		<legend>Tipo de Autor</legend>
		<div class="form-check form-check-inline">
			<input
				class="form-check-input"
				type="radio"
				name="tipo"
				id="tipoInput1"
				value="m"
				group="tipo"
				on:change={() => (autorType = 'm')}
			/>
			<label class="form-check-label" for="tipoInput1">Músico</label>
		</div>
		<div class="form-check form-check-inline">
			<input
				class="form-check-input"
				type="radio"
				name="tipo"
				id="tipoInput2"
				value="b"
				group="tipo"
				on:change={() => (autorType = 'b')}
			/>
			<label class="form-check-label" for="tipoInput2">Banda</label>
		</div>
	</div>
	<div hidden={autorType != 'm'}>
		<div class="mb-3 row g-3">
			<legend>Endereço</legend>
			<div class="col-md-3">
				<label for="mNumeroInput" class="form-label">Número</label>
				<input
					type="number"
					step="1"
					class="form-control"
					id="mNumeroInput"
					name="mEnderecoNumero"
				/>
			</div>
			<div class="col-md-9">
				<label for="mComplementoInput" class="form-label">Complemento</label>
				<input
					type="text"
					class="form-control"
					id="mComplementoInput"
					name="mEnderecoComplemento"
				/>
			</div>
			<div class="col-md-6">
				<label for="mRuaInput" class="form-label">Rua</label>
				<input type="text" class="form-control" id="mRuaInput" name="mEnderecoRua" />
			</div>
			<div class="col-md-6">
				<label for="mBairroInput" class="form-label">Bairro</label>
				<input type="text" class="form-control" id="mBairroInput" name="mEnderecoBairro" />
			</div>
			<div class="col-md-5">
				<label for="mCidadeInput" class="form-label">Cidade</label>
				<input type="text" class="form-control" id="mCidadeInput" name="mEnderecoCidade" />
			</div>
			<div class="col-md-3">
				<label for="mEstadoInput" class="form-label">UF</label>
				<input type="text" class="form-control" id="mEstadoInput" name="mEnderecoEstado" />
			</div>
			<div class="col-md-4">
				<label for="mPaisInput" class="form-label">País</label>
				<input type="text" class="form-control" id="mPaisInput" name="mEnderecoPais" />
			</div>
			<div class="col-md-12">
				<label for="mTelefoneInput" class="form-label">Telefone</label>
				<input type="text" class="form-control" id="mTelefoneInput" name="mEnderecoTelefone" />
			</div>
		</div>
		<ListField
			name="mInstrumentos"
			labelText="Instrumentos"
			inputType="select"
			idLabelMap={new Map(instrumentos.map((i) => [i.idInstrumento || -1, i.nome]))}
		/>
	</div>
	<div hidden={autorType != 'b'}>
		<div class="mb-3">
			<label for="bDescricao" class="form-label">Descrição</label>
			<input type="textarea" class="form-control" id="bDescricao" name="bDescricao" />
		</div>
		<div class="mb-3">
			<label for="bDataFormacao" class="form-label">Data Formação</label>
			<input type="date" class="form-control" id="bDataFormacao" name="bDataFormacao" />
		</div>
		<div class="mb-3">
			<ListField name="bEstilos" labelText="Estilos" />
		</div>
		<div class="mb-3">
			<ListField
				name="bMembros"
				labelText="Membros"
				inputType="select"
				idLabelMap={new Map(
					autores.filter((a) => a instanceof Musico).map((a) => [a.idAutor || -1, a.nome])
				)}
			/>
		</div>
	</div>
</FormModal>

<DialogModal
	bind:this={deleteAutorModal}
	id="deleteAutorModal"
	title="Deletar autor"
	onConfirm={deleteAutor}
>
	<p>Você tem certeza que quer deletar o autor {autorToDelete?.nome}</p>
</DialogModal>
