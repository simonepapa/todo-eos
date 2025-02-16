<script lang="ts">
    import type {Session} from '@wharfkit/session'
    import {Contract, Types} from './contract'
    import {onMount} from 'svelte'
    import {type Writable, writable} from 'svelte/store'

    export let session: Session

    const contract = new Contract({client: session.client})

    let loading = false

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
        const result = await session.transact({action})

        // If the transaction provided return values, add each of them to the list of tasks
        if (result.returns) {
            for (const returnValue of result.returns) {
                tasks.update((current) => {
                    current.push(returnValue.data)
                    return current
                })
            }
        }

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
        loading = true
        tasks.set(await contract.table('todos', session.actor).all())
        loading = false
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
    {#if $tasks.length === 0 && loading}
        <span class="loader"></span>
    {:else}
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
    {/if}
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
    .loader {
        width: 48px;
        height: 48px;
        border: 5px solid #1095C1;
        border-bottom-color: transparent;
        border-radius: 50%;
        display: block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        margin: 0 auto;
    }

    @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    } 
</style>
