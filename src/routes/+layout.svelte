<script lang="ts">
    import { applyAction, enhance } from '$app/forms'
    import Navigation from '$lib/components/Navigation.svelte'
    import { pb } from '$lib/pocketbase'
    import { currentUser } from '$lib/stores/user'
    import {
        AppShell,
        AppBar,
        LightSwitch,
        Drawer,
        drawerStore,
        Avatar,
    } from '@skeletonlabs/skeleton'

    // The ordering of these imports is critical to your app working properly
    /* eslint-disable */
    // import '@skeletonlabs/skeleton/themes/theme-skeleton.css'
    import '@skeletonlabs/skeleton/styles/all.css'
    import '../app.postcss'
    import '../theme.postcss'

    import { currentOrganization } from '$lib/stores/organization'
    /* eslint-enable */

    function drawerOpen(): void {
        drawerStore.open({})
    }

    // Reactive Properties
    $: classesSidebarLeft = 'w-0 lg:w-64'
</script>

<!-- Drawer -->
<Drawer>
    <h2 class="p-4">Navigation</h2>
    <hr />
    <Navigation />
</Drawer>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 {classesSidebarLeft}">
    <svelte:fragment slot="header">
        <!-- App Bar -->
        <AppBar>
            <svelte:fragment slot="lead">
                <div class="flex items-center">
                    <button
                        class="lg:hidden btn btn-sm mr-4"
                        on:click={drawerOpen}
                    >
                        <span>
                            <svg
                                viewBox="0 0 100 80"
                                class="fill-token w-4 h-4"
                            >
                                <rect width="100" height="20" />
                                <rect y="30" width="100" height="20" />
                                <rect y="60" width="100" height="20" />
                            </svg>
                        </span>
                    </button>
                    <strong class="text-xl uppercase">VRP Next</strong>
                    {#if $currentOrganization}
                        <strong class="text-xl uppercase ml-2">
                            | {$currentOrganization?.name}</strong
                        >
                    {/if}
                </div>
            </svelte:fragment>
            <svelte:fragment slot="trail">
                <ul class="flex flex-h gap-2">
                    <li><LightSwitch /></li>
                    {#if $currentUser}
                        <Avatar
                            src="http://127.0.0.1:8090/api/files/users/{$currentUser.id}/{$currentUser.avatar}"
                            width="w-12"
                            rounded="rounded-full"
                            border="border-2 border-surface-500"
                        />
                        <li>
                            <form
                                method="POST"
                                action="/logout"
                                use:enhance={() => {
                                    return async ({ result }) => {
                                        pb.authStore.clear()
                                        await applyAction(result)
                                    }
                                }}
                            >
                                <button>Déconnexion</button>
                            </form>
                        </li>
                    {:else}
                        <li><a href="/login">Se connecter</a></li>
                        <li><a href="/register">Créer un compte</a></li>
                    {/if}
                </ul>
            </svelte:fragment>
        </AppBar>
    </svelte:fragment>

    <!-- Left Sidebar Slot -->
    <svelte:fragment slot="sidebarLeft">
        <Navigation />
    </svelte:fragment>

    <!-- Page Route Content -->
    <div class="container p-10 space-y-4">
        <slot />
    </div>
</AppShell>
