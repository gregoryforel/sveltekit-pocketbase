<script lang="ts">
    import { FileDropzone } from '@skeletonlabs/skeleton'
    import 'iconify-icon'
    import { superForm } from 'sveltekit-superforms/client'

    import type { PageData } from './$types'
    import { currentUser } from '$lib/stores/user'
    import ClearSelectionButton from '$lib/components/ClearSelectionButton.svelte'

    export let data: PageData
    const { name } = data

    const { constraints, enhance, errors, form } = superForm(data.form, {
        taintedMessage:
            'Quitter la page sans finaliser la création du produit?',
    })
</script>

<h1>New Product</h1>

<div class="flex flex-col w-full h-full p-2">
    <form
        class="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
        action="?/create"
        method="POST"
        enctype="multipart/form-data"
        use:enhance
    >
        <section class="space-y-4 max-w-2xl ">
            <!-- Organization: this field is hidden to the user! -->
            <label for="user_id" class="label">
                <span>User ID</span>
                <input
                    class="input"
                    type="text"
                    id="user_id"
                    name="user_id"
                    value={$currentUser.id || ''}
                />
            </label>

            <label for="name" class="label">
                <span>Name</span>
                <input
                    class="input"
                    type="text"
                    id="name"
                    name="name"
                    title="Entrez le nom du schéma"
                    placeholder="Ex: Product Management"
                    autocomplete="off"
                    {...$constraints.name}
                    bind:value={$form.name}
                />
                {#if $errors.name}
                    <p class="text-red-500">{$errors.name}</p>
                {/if}
            </label>            

            <button type="submit" class="btn variant-filled">Create</button>
        </section>
    </form>
</div>
