<script lang="ts">
    import { enhance } from '$app/forms'
</script>

<form action="?/upload" method="POST" use:enhance>
    <button type="submit">Upload</button>
</form>
