<template>
    <div class="dropdown">
        <button type="button" class="btn btn-lg btn-touch bi bi-three-dots-vertical dropdown-toggle"
            data-bs-toggle="dropdown" aria-expanded="false"></button>
        <ul class="dropdown-menu foreground theme-shadow">
            <li>
                <h6 class="dropdown-header">Options</h6>
            </li>
            <li>
                <button class="btn btn-touch dropdown-item text-4" @click.passive="refresh">Refresh</button>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const emit = defineEmits(["show", "hide", "refresh"]);

async function refresh() {
    router.go();
}
</script>