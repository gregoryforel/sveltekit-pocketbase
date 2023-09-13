<script lang="ts">
    import { applyAction, enhance } from '$app/forms'
    import { pb } from '$lib/pocketbase'
</script>

<article class="flex flex-col items-center">
    <form
        method="POST"
        class="card p-4 w-fit grid grid-cols-1 gap-4"
        use:enhance={() => {
            return async ({ result }) => {
                pb.authStore.loadFromCookie(document.cookie)
                await applyAction(result)
            }
        }}
    >
        <h1 class="text-2xl mb-8">Create an account</h1>
        <section class="space-y-4 max-w-sm">
            <input
                type="email"
                name="email"
                placeholder="Email"
                class="input input-bordered"
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                class="input input-bordered"
            />
            <input
                type="password"
                name="passwordConfirm"
                placeholder="Confirm password"
                class="input input-bordered"
            />
            <button type="submit" class="btn variant-filled">Register</button>
        </section>
    </form>
</article>