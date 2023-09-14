<script lang="ts">
    import { FileDropzone } from '@skeletonlabs/skeleton'
    import 'iconify-icon'
    import { superForm } from 'sveltekit-superforms/client'

    import type { PageData } from './$types'
    import { currentUser } from '$lib/stores/user'
    import ClearSelectionButton from '$lib/components/ClearSelectionButton.svelte'

    export let data: PageData
    const { colors, productTypes } = data

    const { constraints, enhance, errors, form } = superForm(data.form, {
        taintedMessage:
            'Quitter la page sans finaliser la création du produit?',
    })

    let previews: string[] = []

    function onChangeHandler(e: Event): void {
        const target = e?.target
        const files = [...(target as any)?.files]

        if (files.length > 0) {
            files.forEach((file: File) => {
                const src = URL.createObjectURL(file)
                previews = [...previews, src]
            })
        }
    }
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
            <label for="user_id" class="label hidden">
                <span>Organisation</span>
                <input
                    class="input"
                    type="text"
                    id="user_id"
                    name="user_id"
                    value={$currentUser.id || ''}
                />
            </label>

            <label for="name" class="label">
                <span>Product Name</span>
                <input
                    class="input"
                    type="text"
                    id="name"
                    name="name"
                    title="Entrez le nom du produit"
                    placeholder="Ex: Shoes..."
                    autocomplete="off"
                    {...$constraints.name}
                    bind:value={$form.name}
                />
                {#if $errors.name}
                    <p class="text-red-500">{$errors.name}</p>
                {/if}
            </label>

            <FileDropzone
                id="photos"
                name="photos"
                multiple
                accept="image/*"
                class="max-h-36"
                bind:files={$form.photos}
                on:change={onChangeHandler}
            >
                <svelte:fragment slot="lead"
                    ><svg
                        class="mx-auto h-12 w-12 dark:text-slate-300 text-slate-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </svelte:fragment>
                <svelte:fragment slot="message"
                    >Upload product pics</svelte:fragment
                >
                <svelte:fragment slot="meta"
                    >PNG, JPG, GIF up to 5MB</svelte:fragment
                >
            </FileDropzone>

            <button type="submit" class="btn variant-filled">Create</button>
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
