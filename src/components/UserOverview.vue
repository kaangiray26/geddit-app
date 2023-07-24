<template>
    <div class="cards">
        <component v-for="post in posts" :post="post.data" :is="types[post.kind]" />
    </div>
    <div v-show="!scroll_loaded" class="md-progress-container">
        <div class="md-progress">
            <div class="md-progress-indicator"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { Geddit } from "/js/geddit.js";
import CompactPost from './CompactPost.vue';
import CompactComment from './CompactComment.vue';

const router = useRouter();
const geddit = new Geddit();

const posts = ref([]);
const after = ref(null);
const scroll_loaded = ref(true);

const types = {
    t1: CompactComment,
    t3: CompactPost
}

async function get_overview() {
    if (!scroll_loaded.value) return;
    scroll_loaded.value = false;
    posts.value = [];
    after.value = null;

    let response = await geddit.getUserOverview(router.currentRoute.value.params.id);
    if (!response) {
        scroll_loaded.value = true;
        return
    }

    posts.value = response.items;
    after.value = response.after;

    scroll_loaded.value = true;
}

async function scroll() {
    scroll_loaded.value = false;

    // Get content
    let response = await geddit.getUserOverview(router.currentRoute.value.params.id, {
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
    get_overview();
})

defineExpose({
    scroll,
    scroll_loaded,
    after
})
</script>