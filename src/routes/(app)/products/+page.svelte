<script lang="ts">
    import { Paginator } from '@skeletonlabs/skeleton'
    import { afterUpdate } from 'svelte'
    import { superForm } from 'sveltekit-superforms/client'

    import { goto } from '$app/navigation'

    export let data

    $: products = data?.products
    $: page = data?.page
    $: perPage = data?.perPage
    $: totalItems = data?.totalItems
    // $: totalPages = data?.totalPages
    $: paginator = {
        offset: page - 1,
        limit: perPage,
        size: totalItems, // source.length,
        amounts: [10, 25, 50],
    }

    // Sets the page to the current page
    // Warning: we might need to update this once Skeleton v2 is released
    afterUpdate(() => {
        paginator.offset = page - 1
    })

    const handleOnProductClick = (productId: string) => {
        goto(`/products/${productId}`)
    }

    const eurFormattedPrice = new Intl.NumberFormat('fr-fr', {
        style: 'currency',
        currency: 'EUR',
    })

    function onPageChange(e: CustomEvent): void {
        page = e.detail + 1
        goto(`/products?page=${page}&perPage=${perPage}`)
    }

    function onAmountChange(e: CustomEvent): void {
        perPage = e.detail
        goto(`/products?page=${page}&perPage=${perPage}`)
    }

    const handleOnSearch = (search: string) => {
        goto(`/products?page=${page}&perPage=${perPage}&search=${search}`)
    }

    const { enhance } = superForm(data.form)
</script>

<h1>Products</h1>

<a href="/products/new" class="btn variant-filled">Create a new product</a>

<!-- .table-container makes the table responsive -->
<div class="flex flex-col h-full">
    <div class="table-container overflow-y-auto">
        <!-- Native Table Element -->
        <table class="table table-hover table-compact">
            <thead>
                <tr>
                    <th colspan="2">
                        <form
                            class="flex flex-1"
                            action="?/search"
                            method="POST"
                            use:enhance
                        >
                            <label for="search" class="label relative w-full">
                                <svg
                                    class="z-10 pointer-events-none absolute inset-y-0 left-3 top-0.5 w-5 h-full text-slate-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                                <input
                                    class="input w-full pl-11 pr-4 sm:text-sm"
                                    type="search"
                                    id="search"
                                    name="search"
                                    placeholder="Cherchez un produit..."
                                    autocomplete="off"
                                />
                            </label>
                        </form>
                    </th>
                    <th colspan="3">
                        <Paginator
                            bind:settings={paginator}
                            showFirstLastButtons={true}
                            showPreviousNextButtons={true}
                            showNumerals
                            on:page={onPageChange}
                            on:amount={onAmountChange}
                        />
                    </th>
                </tr>
                <tr>
                    <th>Nom</th>
                    <!-- <th>Description</th>
                    <th class="h-">Type</th>
                    <th class="text-right">Quantité par Lot</th>
                    <th class="text-right">Prix Lot Unitaire HT</th> -->
                </tr>
            </thead>
            <tbody>
                {#each products as product (product.id)}
                    <tr on:click={() => handleOnProductClick(product.id)}>
                        <td class="truncate !whitespace-nowrap max-w-xs"
                            >{product.name}</td
                        >
                        <!-- <td class="truncate !whitespace-nowrap max-w-xs"
                            >{product.description}</td
                        >
                        <td>{product.expand?.type?.name || ''}</td>
                        <td class="text-right">{product.batch_size}</td>
                        <td class="text-right"
                            >{eurFormattedPrice.format(
                                product.batch_unit_price
                            )}</td
                        > -->
                    </tr>
                {/each}
            </tbody>
            <tfoot>
                <!-- <tr>
                    <th colspan="5">
                        <Paginator
                            bind:settings={paginator}
                            showFirstLastButtons={false}
                            showPreviousNextButtons={true}
                            showNumerals
                            on:page={onPageChange}
                            on:amount={onAmountChange}
                        />
                    </th>
                </tr> -->
            </tfoot>
        </table>
    </div>
</div>
