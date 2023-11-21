<script lang="ts">
    import {onMount} from 'svelte'
    import {login, logout, restore, session} from './wharf'

    onMount(restore)
</script>

<header>
    <div class="grid">
        <div>
            <hgroup>
                <h1>TODO!</h1>
                <h1>A Todo app using for Wharf + Svelte + Vite + Pico.css</h1>
            </hgroup>
        </div>
        <div>
            {#if $session}
                <button on:click={logout}>Logout ({$session.actor})</button>
            {:else}
                <button on:click={login}>Login</button>
            {/if}
        </div>
    </div>
</header>

<style>
    .grid button {
        width: auto;
        float: right;
    }
</style>
