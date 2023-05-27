<script lang="ts">
	import NavItem from './NavItem.svelte';
</script>

<nav class="navbar navbar-expand-lg bg-body-tertiary">
	<div class="container-fluid">
		<a class="navbar-brand material-icons" href="/">headphones</a>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbarSupportedContent"
			aria-controls="navbarSupportedContent"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse" id="navbarSupportedContent">
			<ul class="navbar-nav me-auto mb-2 mb-lg-0">
				<NavItem pathName="/">Home</NavItem>
				<NavItem pathName="/authors">Autores</NavItem>
				<NavItem pathName="/instruments">Instrumentos</NavItem>
				<NavItem pathName="/discs" disabled={true}>Discos</NavItem>
				<NavItem pathName="/musics" disabled={true}>Músicas</NavItem>
				<NavItem pathName="/documentation">Documentação</NavItem>
			</ul>
			<!-- <form class="d-flex" role="search">
				<input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
				<button class="btn btn-outline-success" type="submit">Search</button>
			</form> -->
		</div>
	</div>
</nav>
