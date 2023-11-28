<script lang="ts">
    import type {Session} from '@wharfkit/session'
    import {Contract, Types} from './contract'
    import {onMount} from 'svelte'
    import {type Writable, writable} from 'svelte/store'

    export let session: Session

    const contract = new Contract({client: session.client})

    async function addTask(event: Event) {
        const form = event.target as HTMLFormElement

        // Retrieve the form data from the event
        const data = new FormData(form)

        // Get the data for the task from the form
        const task = data.get('task')

        // If no data was returned, abort
        if (!event.target || !task) return

        // Assemble the smart contract action to add the task
        const action = contract.action('add', {
            author: session.actor,
            description: String(task),
        })

        // Perform the transaction
        await session.transact({action})

        // Reset the form inputs
        form.reset()

        // Reload the tasks from the smart contract after a short delay
        setTimeout(getTasks, 500)
    }

    async function setTaskComplete(id: number, complete: boolean) {
        // Assemble the smart contract action to complete the task
        const action = contract.action('setcomplete', {
            author: session.actor,
            id: id,
            complete,
        })

        // Perform the transaction
        await session.transact({action})

        // Reload the tasks from the smart contract after a short delay
        setTimeout(getTasks, 500)
    }

    async function deleteTask(id: number) {
        // Assemble the smart contract action to delete the task
        const action = contract.action('erase', {
            author: session.actor,
            id,
        })

        // Perform the transaction
        await session.transact({action})

        // Reload the tasks from the smart contract after a short delay
        setTimeout(getTasks, 500)
    }

    const tasks: Writable<Types.todo_row[]> = writable([])

    async function getTasks() {
        tasks.set(await contract.table('todos', session.actor).all())
    }

    onMount(getTasks)
</script>

<main>
    <form on:submit|preventDefault={addTask}>
        <input
            type="text"
            name="task"
            placeholder="Describe a task and press enter to save"
            required
        />
    </form>
    {#each $tasks as task}
        <div class="grid">
            <div class="details">
                <div class="status">
                    {#if task.completed.equals(1)}
                        ✅
                    {:else}
                        ⌛
                    {/if}
                </div>
                <div class="headings">
                    <h5>{task.description}</h5>
                    <h6>{new Date(task.timestamp.toMilliseconds()).toDateString()}</h6>
                </div>
            </div>
            <div />
            <div class="controls">
                {#if task.completed.equals(1)}
                    <button class="secondary" on:click={() => setTaskComplete(task.id, false)}>
                        Mark incomplete
                    </button>
                {:else}
                    <button class="primary" on:click={() => setTaskComplete(task.id, true)}>
                        Mark complete
                    </button>
                {/if}
                <button class="tertiary" on:click={() => deleteTask(task.id)}> Delete task </button>
            </div>
        </div>
    {:else}
        <hgroup>
            <h3>No tasks</h3>
            <h4>Create your first task using the textbox above.</h4>
        </hgroup>
    {/each}
</main>

<style>
    .status {
        float: left;
        font-size: 2em;
        padding: 0.1em 0.5em;
    }
    .controls button {
        width: auto;
        display: inline;
    }
    main hgroup {
        text-align: center;
    }
</style>
