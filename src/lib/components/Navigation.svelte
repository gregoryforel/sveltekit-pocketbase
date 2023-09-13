<script lang="ts">
    import { drawerStore } from '@skeletonlabs/skeleton'

    function drawerClose(): void {
        drawerStore.close()
    }
</script>

<nav class="list-nav p-4">
    <ul>
        <li><a href="/" on:click={drawerClose}>Accueil</a></li>
        <li><a href="/products" on:click={drawerClose}>Produits</a></li>
    </ul>
</nav>
