<template>
    <div v-if="!posts.length" class="d-flex justify-content-center align-items-center cover-all position-absolute">
        <div class="d-flex circle bg-6 p-2">
            <div class="spinner-border text-0" role="status"></div>
        </div>
    </div>
    <TopBar ref="topbar" subreddit="Popular" @params_changed="params_changed" />
    <ul class="list-group border-0 pt-0 mt-3">
        <Post v-for="post in posts" :post="post.data" :hidden="globalHiddenPosts.includes(post.data.permalink)"
            @hide_post="hide_post" />
    </ul>
    <div v-if="!scroll_loaded" class="progress " role="progressbar" aria-label="Basic example" aria-valuenow="0"
        aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated, onDeactivated } from 'vue';
import { Geddit } from "/js/geddit.js";
import Post from './CompactPost.vue';
import TopBar from './TopBar.vue';

const geddit = new Geddit();
const topbar = ref(null);

const posts = ref([]);
const after = ref(null);

const scroll_loaded = ref(true);

const globalHiddenPosts = ref(JSON.parse(localStorage.getItem("hidden_posts")) ?? []);

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

function scroll_handle(el) {
    if (el.target.scrollTop + el.target.clientHeight >= el.target.scrollHeight - window.innerWidth && scroll_loaded.value && after.value) {
        scroll();
    }
}

async function hide_post(postPermalink) {
    // this may cause performance issues, need to test on a daily basis and then move this to a parent container
    let hiddenPosts = JSON.parse(localStorage.getItem("hidden_posts"));
    // init hiddenPosts as an empty array if it doesn't exist
    if (!hiddenPosts) {
        hiddenPosts = [];
    }
    // add post to hiddenPosts array if it doesn't exist
    if (!hiddenPosts.includes(postPermalink)) {
        hiddenPosts.push(postPermalink);
        localStorage.setItem("hidden_posts", JSON.stringify(hiddenPosts));
        // hide post
    } else {
        // remove post from hiddenPosts array
        hiddenPosts = hiddenPosts.filter((post) => post !== postPermalink);
        localStorage.setItem("hidden_posts", JSON.stringify(hiddenPosts));
        // unhide post
    }
    globalHiddenPosts.value = hiddenPosts;
}

onBeforeMount(() => {
    setup();
})

onActivated(() => {
    // Add the scroll event listener
    let view = document.querySelector('.content-view');
    view.addEventListener('scroll', scroll_handle)

    // Scroll to the last position
    let pages = JSON.parse(localStorage.getItem("pages"));
    let this_page = pages.find(page => page.path == window.location.pathname);
    if (this_page) {
        document.querySelector('.content-view').scrollTop = parseInt(this_page.scroll);
    }
})

onDeactivated(() => {
    // Disable scroll event listener
    let view = document.querySelector('.content-view');
    view.removeEventListener('scroll', scroll_handle);
})
</script>