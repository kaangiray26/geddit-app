<template>
    <div v-if="!posts.length" class="d-flex justify-content-center align-items-center cover-all position-absolute">
        <div class="d-flex circle bg-6 p-2">
            <div class="spinner-border text-0" role="status"></div>
        </div>
    </div>
    <div class="d-flex justify-content-between align-items-center foreground">
        <div class="d-flex ms-3">
            <h6 class="fw-bold text-6 text-capitalize me-2 mb-0">Popular</h6>
            <span class="badge bg-10">{{ sort }}</span>
        </div>
        <div class="d-flex">
            <div>
                <button type="button" class="btn btn-lg btn-touch bi bi-filter-left" @click="open_sort_options"></button>
            </div>
            <div>
                <button type="button" class="btn btn-lg btn-touch bi bi-three-dots-vertical"></button>
            </div>
        </div>
    </div>
    <ul class="list-group border-0 pt-0 mt-3">
        <Post v-for="post in posts" :post="post.data" />
    </ul>
    <div v-if="!scroll_loaded" class="progress " role="progressbar" aria-label="Basic example" aria-valuenow="0"
        aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
    <Sort ref="sort_modal" @sort_changed="sort_changed" @time_changed="time_changed"></Sort>
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { Geddit } from "/js/geddit.js";

import Post from './CompactPost.vue';
import Sort from './Sort.vue'

const router = useRouter();
const geddit = new Geddit();

const posts = ref([]);
const after = ref(null);

const sort = ref("hot");
const time = ref("day");
const sort_modal = ref(null);

const scroll_loaded = ref(true);

async function setup() {
    let response = await geddit.getSubmissions(sort.value, "popular", {
        t: time.value
    });
    if (!response || !response.posts.length) return;

    posts.value = response.posts;
    after.value = response.after;
}

async function scroll() {
    scroll_loaded.value = false;

    let response = await geddit.getSubmissions(sort.value, "popular", {
        after: after.value
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

async function open_sort_options() {
    sort_modal.value.show();
}

async function sort_changed(sort_value) {
    sort.value = sort_value;

    if (sort_value == 'top' || sort_value == 'controversial') {
        return
    }

    posts.value = [];
    after.value = null;
    scroll_loaded.value = true;
    setup();
}

async function time_changed(time_value) {
    time.value = time_value;

    posts.value = [];
    after.value = null;
    scroll_loaded.value = true;
    setup();
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