<template>
    <div v-if="!posts.length" class="d-flex justify-content-center align-items-center cover-all position-absolute">
        <div class="d-flex circle bg-6 p-2">
            <div class="spinner-border text-0" role="status"></div>
        </div>
    </div>
    <TopBar ref="topbar" subreddit="Popular" @params_changed="params_changed" />
    <ul class="list-group border-0 pt-0 mt-3">
        <Post v-for="post in posts" :post="post.data" />
    </ul>
    <div v-if="!scroll_loaded" class="progress " role="progressbar" aria-label="Basic example" aria-valuenow="0"
        aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { Geddit } from "/js/geddit.js";
import Post from './CompactPost.vue';
import TopBar from './TopBar.vue';

const router = useRouter();
const geddit = new Geddit();
const topbar = ref(null);

const posts = ref([]);
const after = ref(null);

const scroll_loaded = ref(true);

async function setup() {
    let response = await geddit.getSubmissions("hot", "popular", {
        t: "day"
    });
    if (!response) return;

    posts.value = response.posts;
    after.value = response.after;
}

async function get_posts() {
    let response = await geddit.getSubmissions(topbar.value.sort, "popular", {
        t: topbar.value.time
    });
    if (!response) return;

    posts.value = response.posts;
    after.value = response.after;
}

async function scroll() {
    scroll_loaded.value = false;

    let response = await geddit.getSubmissions(topbar.value.sort, "popular", {
        after: after.value,
        t: topbar.value.time
    });
    if (!response || !response.posts.length) {
        after.value = null;
        scroll_loaded.value = true;
        return
    }

    posts.value.push(...response.posts);
    after.value = response.after;

    scroll_loaded.value = true;
}

async function params_changed() {
    posts.value = [];
    after.value = null;
    scroll_loaded.value = true;
    get_posts();
}

onBeforeMount(() => {
    setup();

    // Add the scroll event listener
    let view = document.querySelector('.content-view');
    view.addEventListener('scroll', () => {
        if (view.scrollTop + view.clientHeight >= view.scrollHeight - window.innerWidth && scroll_loaded.value && after.value && router.currentRoute.value.name == 'home') {
            scroll();
        }
    })
})

onActivated(() => {
    let pages = JSON.parse(localStorage.getItem("pages"));
    let this_page = pages.find(page => page.path == window.location.pathname);
    if (this_page) {
        document.querySelector('.content-view').scrollTop = parseInt(this_page.scroll);
    }
})
</script>