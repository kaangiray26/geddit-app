<template>
    <div v-if="!data" class="progress " role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0"
        aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
    <div v-else>
        <div class="d-flex flex-column foreground p-3">
            <div class="banner d-flex justify-content-center align-items-center position-relative mb-2">
                <img :src="banner_img" class="cover vh-25 rounded">
                <img :src="icon_img" class="snoovatar position-absolute">
            </div>
            <div class="d-flex flex-column mb-2">
                <h6 class="text-6 fw-bold m-0">{{ data.name }}</h6>
                <div class="d-flex align-items-center">
                    <small class="text-4">{{ format_karma() }} karma</small>
                    <small class="text-4 mx-2">·</small>
                    <small class="text-4">{{ format_date() }}</small>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-touch px-0 me-3" @click="get_overview">
                    <span class="text-4" :class="{ 'border-bottom': section == 'overview' }">Overview</span>
                </button>
                <button class="btn btn-touch px-0 me-3" @click="get_posts">
                    <span class="text-4" :class="{ 'border-bottom': section == 'posts' }">Posts</span>
                </button>
                <button class="btn btn-touch px-0" @click="get_comments">
                    <span class="text-4" :class="{ 'border-bottom': section == 'comments' }">Comments</span>
                </button>
            </div>
        </div>
        <ul class="list-group border-0 pt-0 mt-3">
            <Item v-for="post in posts" :data="post" />
        </ul>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import { Geddit } from "/js/geddit.js";
import Item from '../types/Item.vue';

const router = useRouter();
const geddit = new Geddit();

const data = ref(null);
const posts = ref([]);
const after = ref(null);

const section = ref('overview');
const scroll_loaded = ref(true);

const icon_img = ref(null);
const banner_img = ref(null);

async function setup() {
    let response = await geddit.getUser(router.currentRoute.value.params.id);
    if (!response) return;

    banner_img.value = response.subreddit.banner_img.split("?")[0];
    icon_img.value = response.icon_img.split("?")[0];
    data.value = response;
}

function format_karma() {
    return data.value.total_karma.toLocaleString();
}

function format_date() {
    return new Date(data.value.created_utc * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function get_overview() {
    section.value = 'overview';
    posts.value = [];
    after.value = null;

    let response = await geddit.getUserOverview(router.currentRoute.value.params.id);
    if (!response) return;

    console.log(response);

    posts.value = response.items;
    after.value = response.after;
}

async function get_posts() {
    section.value = 'posts';
    posts.value = [];
    after.value = null;

    let response = await geddit.getUserSubmissions(router.currentRoute.value.params.id);
    if (!response) return;

    posts.value = response.items;
    after.value = response.after;
}

async function get_comments() {
    section.value = 'comments';
    posts.value = [];
    after.value = null;

    let response = await geddit.getUserComments(router.currentRoute.value.params.id);
    if (!response) return;


    posts.value = response.items;
    after.value = response.after;
}

async function scroll() {
    scroll_loaded.value = false;

    // Get content based on the section
    let response = null;
    if (section.value == 'overview') {
        response = await geddit.getUserOverview(router.currentRoute.value.params.id, {
            after: after.value
        });
    }

    else if (section.value == 'posts') {
        response = await geddit.getUserSubmissions(router.currentRoute.value.params.id, {
            after: after.value
        });
    }

    else if (section.value == 'comments') {
        response = await geddit.getUserComments(router.currentRoute.value.params.id, {
            after: after.value
        });
    }

    if (!response) return;
    if (!response.items.length) {
        after.value = null;
        return;
    }

    posts.value.push(...response.items);
    after.value = response.after;

    scroll_loaded.value = true;
}

onBeforeMount(() => {
    if (!router.currentRoute.value.params.id) {
        router.back();
        return;
    }

    setup();
    get_overview();

    // Add the scroll event listener
    let view = document.querySelector('.content-view');
    view.addEventListener('scroll', () => {
        if (view.scrollTop + view.clientHeight >= view.scrollHeight - window.innerWidth && scroll_loaded.value && after.value) {
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