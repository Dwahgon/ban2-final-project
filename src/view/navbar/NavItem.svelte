<script lang="ts">
	import { page } from '$app/stores';
	export let pathName: string;
	export let disabled: boolean = false;
</script>

<li class="nav-item">
	<a
		class="nav-link {disabled ? 'disabled' : $page.url.pathname == pathName ? 'active' : ''}"
		aria-current="page"
		href={pathName}
	>
		<slot />
	</a>
</li>
