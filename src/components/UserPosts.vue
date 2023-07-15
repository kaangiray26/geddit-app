<template>
    <ul v-show="posts.length" class="list-group border-0 pt-0 mt-3">
        <CompactPost v-for="post in posts" :post="post.data" />
    </ul>
    <div v-show="!scroll_loaded" class="progress " role="progressbar" aria-label="Basic example" aria-valuenow="0"
        aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { Geddit } from "/js/geddit.js";
import CompactPost from './CompactPost.vue';

const router = useRouter();
const geddit = new Geddit();

const posts = ref([]);
const after = ref(null);
const scroll_loaded = ref(true);

async function get_posts() {
    if (!scroll_loaded.value) return;
    scroll_loaded.value = false;

    posts.value = [];
    after.value = null;

    let response = await geddit.getUserSubmissions(router.currentRoute.value.params.id);
    if (!response) {
        scroll_loaded.value = true;
    }

    posts.value = response.items;
    after.value = response.after;

    scroll_loaded.value = true;
}

async function scroll() {
    scroll_loaded.value = false;

    // Get content
    let response = await geddit.getUserSubmissions(router.currentRoute.value.params.id, {
        after: after.value
    });

    if (!response || !response.items) {
        after.value = null;
        scroll_loaded.value = true;
        return;
    }

    posts.value.push(...response.items);
    after.value = response.after;

    scroll_loaded.value = true;
}

onBeforeMount(() => {
    get_posts();
})

defineExpose({
    scroll,
    scroll_loaded,
    after
})
</script>