<template>
    <ul class="list-group border-0 pt-0 mt-3">
        <Post v-for="post in posts" :data="post" />
    </ul>
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { Geddit } from "/js/geddit.js";
import Post from './CompactPost.vue';

const router = useRouter();
const geddit = new Geddit();

const posts = ref([]);
const after = ref(null);

const scroll_loaded = ref(true);
const finished = ref(false);

async function setup() {
    let response = await geddit.getHot("all");
    if (!response) return;

    posts.value = response.posts;
    after.value = response.after;
}

async function scroll() {
    scroll_loaded.value = false;
    let response = await geddit.getHot("all", {
        after: after.value
    });
    if (!response) return;

    if (!response.posts.length) {
        finished.value = true;
        return;
    }

    posts.value.push(...response.posts);
    after.value = response.after;
    scroll_loaded.value = true;
}

onBeforeMount(() => {
    setup();

    // Add the scroll event listener
    let view = document.querySelector('.content-view');
    view.addEventListener('scroll', () => {
        if (view.scrollTop + view.clientHeight >= view.scrollHeight - window.innerWidth && scroll_loaded.value && !finished.value) {
            scroll();
        }
    })
})
</script>