<script lang="ts">
    import { applyAction, enhance } from '$app/forms'
    import { page } from '$app/stores'
    import { pb } from '$lib/pocketbase'

    $: redirectTo = $page.url.searchParams.get('redirectTo') ?? ''
</script>

<article class="flex flex-col items-center">
    {#if redirectTo !== '/' && redirectTo !== ''}
        <div class="alert alert-error mb-4">
            You must be signed in to access the products page.
        </div>
    {/if}
    <h1 class="text-2xl mb-8 w-fit">User Sign in</h1>
    <form
        method="POST"
        class="w-fit grid grid-cols-1 gap-4"
        use:enhance={() => {
            return async ({ result }) => {
                pb.authStore.loadFromCookie(document.cookie)
                await applyAction(result)
            }
        }}
    >
        <section class="space-y-4 max-w-sm">
            <input
                class="input input-bordered"
                type="email"
                name="email"
                placeholder="Email"
            />
            <input
                class="input input-bordered"
                type="password"
                name="password"
                placeholder="Password"
            />
            <button type="submit" class="btn variant-filled">
                Sign in
            </button>
        </section>
    </form>
</article>
