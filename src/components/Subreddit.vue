<template>
    <div v-if="!data" class="d-flex justify-content-center align-items-center cover-all position-absolute">
        <div class="d-flex circle md-dark p-2">
            <div class="spinner-border text-4" role="status"></div>
        </div>
    </div>
    <div v-else>
        <TopAppBarSubreddit ref="topbar" :subreddit="data.display_name_prefixed" @params_changed="params_changed" />
        <div class="d-flex flex-column p-3 pt-0">
            <div class="banner d-flex justify-content-center align-items-center position-relative mb-2">
                <img v-show="data.banner_img" :src="data.banner_img" class="cover vh-25 rounded">
                <img v-show="icon" :src="icon" class="snoovatar position-absolute">
            </div>
            <div class="d-flex flex-column align-items-center mb-2">
                <h6 class="title text-6 fw-bold">{{ data.title }}</h6>
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
                <button v-show="!followed" type="button" class="btn btn-10 text-4" @click.passive="follow">Follow</button>
                <button v-show="followed" type="button" class="btn btn-3 text-4"
                    @click.passive="unfollow">Following</button>
            </div>
        </div>
        <div class="cards">
            <Post v-for="post in posts" :post="post.data" />
        </div>
        <div v-if="!scroll_loaded" class="progress progress-alt" role="progressbar" aria-label="Basic example"
            aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar progress-bar-alt"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated, onDeactivated } from 'vue';
import { useRouter } from 'vue-router';
import { Geddit } from "/js/geddit.js";
import Post from './CompactPost.vue';
import TopAppBarSubreddit from './TopAppBarSubreddit.vue';

const router = useRouter();
const geddit = new Geddit();
const topbar = ref(null);

const posts = ref([]);
const after = ref(null);

const data = ref(null);
const icon = ref(null);
const followed = ref(false);

const scroll_loaded = ref(true);

async function params_changed() {
    posts.value = [];
    after.value = null;
    scroll_loaded.value = true;
    get_posts();
}

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
        icon_img: icon.value,
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

async function get_subreddit() {
    let response = await geddit.getSubreddit(router.currentRoute.value.params.id);
    if (!response) return;

    data.value = response;
    check_followed();
    get_sub_icon();
}

async function get_sub_icon() {
    if (data.value.icon_img) {
        icon.value = data.value.icon_img;
        return
    }

    if (data.value.community_icon) {
        icon.value = data.value.community_icon.split("?")[0];
        return
    }

    icon.value = "/images/subreddit.svg";
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

async function setup() {
    let response = await geddit.getSubmissions("hot", router.currentRoute.value.params.id, {
        t: "day"
    });
    if (!response) return;

    posts.value = response.posts;
    after.value = response.after;
}

async function get_posts() {
    let response = await geddit.getSubmissions(topbar.value.sort, router.currentRoute.value.params.id, {
        t: topbar.value.time
    });
    if (!response) return;

    posts.value = response.posts;
    after.value = response.after;
}

async function scroll() {
    scroll_loaded.value = false;

    let response = null;

    response = await geddit.getSubmissions(topbar.value.sort, router.currentRoute.value.params.id, {
        after: after.value,
        t: topbar.value.time
    });

    if (!response || !response.posts.length) {
        after.value = null;
        scroll_loaded.value = true;
        return;
    }

    posts.value.push(...response.posts);
    after.value = response.after;

    scroll_loaded.value = true;
}


function scroll_handle(el) {
    if (el.target.scrollTop + el.target.clientHeight >= el.target.scrollHeight - window.innerWidth && scroll_loaded.value && after.value) {
        scroll();
    }
}

async function handle_sort_route() {
    let changed = false;
    let time = router.currentRoute.value.query.t;
    let sort = router.currentRoute.value.params.sort;

    if (sort && sort != topbar.value.sort) {
        topbar.value.sort = sort;
        changed = true;
    }

    if (time && time != topbar.value.time) {
        topbar.value.time = time;
        changed = true;
    }

    if (!changed) return

    get_posts();
}

onBeforeMount(() => {
    if (!router.currentRoute.value.params.id) {
        router.back();
        return;
    }

    get_subreddit();
    setup();
})

onActivated(() => {
    check_followed();

    // Add the scroll event listener
    let view = document.querySelector('.content-view');
    view.addEventListener('scroll', scroll_handle)

    // Scroll to the last position
    let pages = JSON.parse(localStorage.getItem("pages"));
    let this_page = pages.find(page => page.path == window.location.pathname);
    if (this_page) {
        document.querySelector('.content-view').scrollTop = parseInt(this_page.scroll);
    }

    handle_sort_route();
})

onDeactivated(() => {
    // Disable scroll event listener
    let view = document.querySelector('.content-view');
    view.removeEventListener('scroll', scroll_handle);
})
</script>