P<script lang="ts">schema
    import { FileDropzone } from '@skeletonlabs/skeleton'
    import 'iconify-icon'
    import { superForm } from 'sveltekit-superforms/client'

    import type { PageData } from './$types'
    import { getImageURL } from '$lib/utils'
    import { Collections } from '$lib/pocketbase-types'
    import ClearSelectionButton from '$lib/components/ClearSelectionButton.svelte'

    export let data: PageData

    const { colors, schemaTypes, schema } = data

    const { constraints, enhance, errors, form } = superForm(data.form, {
        taintedMessage:
            'Leave without finalizing schema creation?',
    })

</script>

<h1>{data.schema.name}</h1>

<div class="flex flex-col w-full h-full p-2">
    <form
        class="w-full grid grid-cols-1 md:grid-cols-1 gap-4"
        action="?/update"
        method="POST"
        enctype="multipart/form-data"
        use:enhance
    >
        <section class="space-y-4 max-w-2xl">
            <label for="name" class="label">
                <span>Schema Name</span>
                <input
                    class="input"
                    type="text"
                    id="name"
                    name="name"
                    title="Schema name"
                    placeholder="Ex: shoes..."
                    autocomplete="off"
                    {...$constraints.name}
                    bind:value={$form.name}
                />
                {#if $errors.name}
                    <p class="text-red-500">{$errors.name}</p>
                {/if}
            </label>

    
            <button type="submit" class="btn variant-filled">Save</button
            >
        </section>

        <section class="grid grid-cols-1 md:grid-cols-3 gap-2">
            {#each previews as preview (preview)}
                <img
                    class="h-auto max-w-full rounded-lg"
                    alt=""
                    src={preview}
                />
            {/each}
        </section>
    </form>
</div>
