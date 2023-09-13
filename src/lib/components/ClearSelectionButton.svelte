<script lang="ts">
    export let visible: boolean = false
    export let clearSelection: () => void
</script>

<div class="relative">
    <button
        class={`absolute top-2 right-10 
                            font-bold z-50 text-slate-500 
                            hover:text-slate-800
                            dark:hover:text-slate-100`}
        class:hidden={!visible}
        class:visible
        on:click={clearSelection}
    >
        x
    </button>
</div>
