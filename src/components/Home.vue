<template>
    <div>
        <ul class="list-group border-0 pt-0 mt-3">
            <Post v-for="post in posts" :data="post" />
        </ul>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { Geddit } from "/js/geddit.js";
import Post from './CompactPost.vue';

const router = useRouter();
const geddit = new Geddit();
const posts = ref([]);

async function setup() {
    let response = await geddit.getHot("all");
    if (!response) return;

    posts.value = response.posts;
}

onBeforeMount(() => {
    setup()
})
</script>