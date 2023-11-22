<script lang="ts">
    import type {Session} from '@wharfkit/session'
    import {Contract} from './contract'

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
    }
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
</main>

<style>
</style>
