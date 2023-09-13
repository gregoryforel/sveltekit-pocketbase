<script lang="ts">
    import { FileDropzone } from '@skeletonlabs/skeleton'
    import 'iconify-icon'
    import { superForm } from 'sveltekit-superforms/client'

    import type { PageData } from './$types'
    import { currentOrganization } from '$lib/stores/organization'
    import { getImageURL } from '$lib/utils'
    import { Collections } from '$lib/pocketbase-types'
    import ClearSelectionButton from '$lib/components/ClearSelectionButton.svelte'

    export let data: PageData

    const { colors, productTypes, product } = data

    const { constraints, enhance, errors, form } = superForm(data.form, {
        taintedMessage:
            'Quitter la page sans finaliser la création du produit?',
    })

    let previews: string[] =
        product.photos.map((fileName) => {
            return getImageURL({
                collection: Collections.Products,
                fileName,
                recordId: product.id,
            })
        }) ?? []

    function onChangeHandler(e: Event): void {
        const target = e?.target
        const files = [...(target as any)?.files]

        if (files.length > 0) {
            console.log('files', files)

            files.forEach((file: File) => {
                const src = URL.createObjectURL(file)
                previews = [...previews, src]
            })
        }
    }
</script>

<h1>{data.product.name}</h1>

<div class="flex flex-col w-full h-full p-2">
    <form
        class="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
        action="?/update"
        method="POST"
        enctype="multipart/form-data"
        use:enhance
    >
        <section class="space-y-4 max-w-2xl">
            <!-- Organization: this field is hidden to the user! -->
            <label for="organization" class="label hidden">
                <span>Organisation</span>
                <input
                    class="input"
                    type="text"
                    id="organization"
                    name="organization"
                    value={$currentOrganization?.id || ''}
                />
            </label>

            <label for="name" class="label">
                <span>Nom du produit</span>
                <input
                    class="input"
                    type="text"
                    id="name"
                    name="name"
                    title="Entrez le nom du produit"
                    placeholder="Ex: Chaussures orthopédiques..."
                    autocomplete="off"
                    {...$constraints.name}
                    bind:value={$form.name}
                />
                {#if $errors.name}
                    <p class="text-red-500">{$errors.name}</p>
                {/if}
            </label>

            <label for="description" class="label">
                <span>Description</span>
                <textarea
                    class="input"
                    rows="2"
                    id="description"
                    name="description"
                    title="Entrez la description du produit"
                    placeholder="Ex: Chaussures orthopédiques adaptées aux personnes âgées et aux personnes à mobilité réduite."
                    {...$constraints.description}
                    bind:value={$form.description}
                />
                {#if $errors.description}
                    <p class="text-red-500">{$errors.description}</p>
                {/if}
            </label>

            <!-- Group Ref, Product Code, Product Type, Color -->
            <div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <label for="reference" class="label">
                    <span>Référence</span>
                    <div
                        class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
                    >
                        <input
                            class="input"
                            type="text"
                            id="reference"
                            name="reference"
                            title="Entrez la référence du produit"
                            placeholder="Ex: ORTHO-CHAUSS-01"
                            autocomplete="off"
                            {...$constraints.reference}
                            bind:value={$form.reference}
                        />
                    </div>
                    {#if $errors.reference}
                        <p class="text-red-500">{$errors.reference}</p>
                    {/if}
                </label>

                <label for="code" class="label">
                    <span>Code Produit</span>
                    <div
                        class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
                    >
                        <input
                            class="input"
                            type="text"
                            id="code"
                            name="code"
                            title="Entrez la référence du code"
                            placeholder="Code Produit"
                            autocomplete="off"
                            {...$constraints.code}
                            bind:value={$form.code}
                        />
                    </div>
                    {#if $errors.code}
                        <p class="text-red-500">{$errors.code}</p>
                    {/if}
                </label>
            </div>

            <div class="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <label for="type" class="label">
                    <span>Type de produit</span>
                    <div class="select-group grid-cols-[auto_1fr_auto]">
                        <ClearSelectionButton
                            clearSelection={() => ($form.type = '')}
                            visible={!!$form.type}
                        />
                        <select
                            class="select"
                            bind:value={$form.type}
                            id="type"
                            name="type"
                            {...$constraints.type}
                        >
                            {#each productTypes as type}
                                <option value={type.id}>{type.name}</option>
                            {/each}
                        </select>
                    </div>

                    {#if $errors.type}
                        <p class="text-red-500">{$errors.type}</p>
                    {/if}
                </label>

                <label for="size" class="label">
                    <span>Taille</span>
                    <input
                        class="input"
                        type="text"
                        id="size"
                        name="size"
                        title="Entrez la taille du produit"
                        placeholder="Ex: 36, XL, etc."
                        autocomplete="off"
                        {...$constraints.size}
                        bind:value={$form.size}
                    />
                    {#if $errors.size}
                        <p class="text-red-500">{$errors.size}</p>
                    {/if}
                </label>

                <label for="color" class="label">
                    <span>Couleur</span>
                    <div class="select-group grid-cols-[auto_1fr_auto]">
                        <ClearSelectionButton
                            clearSelection={() => ($form.color = '')}
                            visible={!!$form.color}
                        />
                        <select
                            class="select"
                            bind:value={$form.color}
                            id="color"
                            name="color"
                            {...$constraints.color}
                        >
                            {#each colors as color (color.id)}
                                <option value={color.id}>{color.fr}</option>
                            {/each}
                        </select>
                    </div>
                    {#if $errors.color}
                        <p class="text-red-500">{$errors.color}</p>
                    {/if}
                </label>
            </div>

            <!-- Group Batch Size, etc. -->
            <div class="w-full grid grid-cols-1 md:grid-cols-4 gap-4">
                <label for="batch_size" class="label">
                    <span>Taille du lot</span>
                    <input
                        class="input"
                        type="number"
                        id="batch_size"
                        name="batch_size"
                        title="Entrez la taille du lot"
                        placeholder="1"
                        autocomplete="off"
                        {...$constraints.batch_size}
                        bind:value={$form.batch_size}
                    />
                    {#if $errors.batch_size}
                        <p class="text-red-500">{$errors.batch_size}</p>
                    {/if}
                </label>

                <label for="batch_unit_price" class="label">
                    <span>Prix lot HT</span>
                    <div
                        class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
                    >
                        <div class="input-group-shim">€</div>
                        <input
                            class="input"
                            type="number"
                            step="any"
                            id="batch_unit_price"
                            name="batch_unit_price"
                            title="Entrez la taille du lot"
                            placeholder="1"
                            autocomplete="off"
                            {...$constraints.batch_unit_price}
                            bind:value={$form.batch_unit_price}
                        />
                    </div>
                    {#if $errors.batch_unit_price}
                        <p class="text-red-500">{$errors.batch_unit_price}</p>
                    {/if}
                </label>

                <label for="vat" class="label">
                    <span>TVA</span>
                    <div
                        class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
                    >
                        <input
                            class="input"
                            type="number"
                            step="any"
                            id="vat"
                            name="vat"
                            title="Entrez la TVA"
                            placeholder="20"
                            autocomplete="off"
                            {...$constraints.vat}
                            bind:value={$form.vat}
                        />
                        <div class="input-group-shim">%</div>
                    </div>
                    {#if $errors.vat}
                        <p class="text-red-500">{$errors.vat}</p>
                    {/if}
                </label>

                <label for="commission" class="label">
                    <span>Commission</span>
                    <div
                        class="input-group input-group-divider grid-cols-[auto_1fr_auto]"
                    >
                        <input
                            class="input"
                            type="number"
                            step="any"
                            id="commission"
                            name="commission"
                            title="Entrez la commission en %"
                            placeholder="Ex: 16"
                            autocomplete="off"
                            {...$constraints.commission}
                            bind:value={$form.commission}
                        />
                        <div class="input-group-shim">%</div>
                    </div>
                    {#if $errors.commission}
                        <p class="text-red-500">{$errors.commission}</p>
                    {/if}
                </label>
            </div>

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
                    </svg></svelte:fragment
                >
                <svelte:fragment slot="message"
                    >Uploadez les photos de vos produits</svelte:fragment
                >
                <svelte:fragment slot="meta"
                    >PNG, JPG, GIF, WEBP, AVIF, JFIF jusqu'à 5MB</svelte:fragment
                >
            </FileDropzone>

            <button type="submit" class="btn variant-filled">Enregistrer</button
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
