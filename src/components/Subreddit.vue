<template>
    <div v-if="!data" class="d-flex justify-content-center align-items-center cover-all position-absolute">
        <div class="d-flex circle bg-6 p-2">
            <div class="spinner-border text-0" role="status"></div>
        </div>
    </div>
    <div v-else>
        <div class="d-flex flex-column foreground p-3">
            <div class="banner d-flex justify-content-center align-items-center position-relative mb-2">
                <img :src="data.banner_img" class="cover vh-25 rounded">
                <img :src="data.icon_img" class="snoovatar position-absolute">
            </div>
            <div class="d-flex flex-column align-items-center mb-2">
                <h6 class="text-6 fw-bold">{{ data.title }}</h6>
                <span class="text-5 mb-2">{{ data.display_name_prefixed }}</span>
                <hr class="text-4 w-100 m-0 mb-2">
                <small class="text-4">{{ get_description() }}</small>
            </div>
            <div class="d-flex flex-column mb-2">
                <div class="d-flex justify-content-center mb-2">
                    <small class="text-5">{{ format_subscribers() }}</small>
                    <small class="text-4 mx-2">·</small>
                    <small class="text-4">{{ format_active() }}</small>
                </div>
                <button v-show="!followed" type="button" class="btn btn-10 text-4" @click="follow">Follow</button>
                <button v-show="followed" type="button" class="btn btn-3 text-4" @click="unfollow">Following</button>
            </div>
        </div>
        <ul class="list-group border-0 pt-0 mt-3">
            <Post v-for="post in posts" :post="post.data" />
        </ul>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { Geddit } from "/js/geddit.js";
import Post from './CompactPost.vue';

const router = useRouter();
const geddit = new Geddit();

const data = ref(null);
const posts = ref([]);
const after = ref(null);
const scroll_loaded = ref(true);
const followed = ref(false);

async function check_followed() {
    if (!data.value) return;
    let subs = JSON.parse(localStorage.getItem("subreddits"));
    if (subs.find(sub => sub.display_name == data.value.display_name)) {
        followed.value = true;
    }
}

async function follow() {
    let subs = JSON.parse(localStorage.getItem("subreddits"));
    subs.push({
        display_name: data.value.display_name,
        icon_img: data.value.icon_img,
    });
    localStorage.setItem("subreddits", JSON.stringify(subs));
    followed.value = true;
}

async function unfollow() {
    let subs = JSON.parse(localStorage.getItem("subreddits"));
    subs = subs.filter(sub => sub.display_name != data.value.display_name);
    localStorage.setItem("subreddits", JSON.stringify(subs));
    followed.value = false;
}

async function setup() {
    let response = await geddit.getSubreddit(router.currentRoute.value.params.id);
    if (!response) return;

    data.value = response;
    check_followed();
}

function format_subscribers() {
    if (!data.value.subscribers) {
        return "private";
    }

    return data.value.subscribers.toLocaleString() + " members";
}

function format_active() {
    if (data.value.active_user_count) {
        return data.value.active_user_count.toLocaleString() + " online";
    }
    return "private";
}

function get_description() {
    let txt = document.createElement('textarea');
    txt.innerHTML = data.value.public_description;
    return txt.value;
}

async function get_hot() {
    let response = await geddit.getHot(router.currentRoute.value.params.id);
    if (!response) return;

    posts.value = response.posts;
    after.value = response.after;
}

async function scroll() {
    scroll_loaded.value = false;

    let response = null;

    response = await geddit.getHot(router.currentRoute.value.params.id, {
        after: after.value
    });

    if (!response) return;
    if (!response.posts.length) {
        after.value = null;
        return;
    }

    posts.value.push(...response.posts);
    after.value = response.after;

    scroll_loaded.value = true;
}

onBeforeMount(() => {
    if (!router.currentRoute.value.params.id) {
        router.back();
        return;
    }

    setup();
    get_hot();

    // Add the scroll event listener
    let view = document.querySelector('.content-view');
    view.addEventListener('scroll', () => {
        if (view.scrollTop + view.clientHeight >= view.scrollHeight - window.innerWidth && scroll_loaded.value && after.value && router.currentRoute.value.name == 'subreddit') {
            scroll();
        }
    })
})

onActivated(() => {
    check_followed();
    let pages = JSON.parse(localStorage.getItem("pages"));
    let this_page = pages.find(page => page.path == window.location.pathname);
    if (this_page) {
        document.querySelector('.content-view').scrollTop = parseInt(this_page.scroll);
    }
})
</script>