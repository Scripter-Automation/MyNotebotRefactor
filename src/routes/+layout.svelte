<script lang="ts">
	import '../app.css';
	let { children } = $props();
	import {firebaseStore} from "../store";
</script>

{@render children()}
