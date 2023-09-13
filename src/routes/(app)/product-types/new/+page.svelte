<script lang="ts">
    export let data
    $: productTypes = data?.productTypes
</script>

<ul>
    <li>
        {#each productTypes as productType (productType.id)}
            <div class="flex flex-row">
                <span>{productType.name} {productType.id}</span>
            </div>
        {/each}
    </li>
</ul>

<!-- <form action="?/batch" method="POST" use:enhance>
    <button type="submit">Create!!</button>
</form> -->
