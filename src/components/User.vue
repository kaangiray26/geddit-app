<template>
    <div v-if="!data" class="d-flex justify-content-center align-items-center cover-all position-absolute">
        <div class="d-flex circle md-dark p-2">
            <div class="spinner-border text-4" role="status"></div>
        </div>
    </div>
    <div v-else>
        <div class="d-flex flex-column foreground p-3">
            <div class="banner d-flex justify-content-center align-items-center position-relative mb-2">
                <img :src="banner_img" class="cover vh-25 rounded">
                <img :src="icon_img" class="snoovatar position-absolute">
            </div>
            <div class="d-flex flex-column mb-2">
                <h6 class="title text-6 fw-bold m-0">{{ data.name }}</h6>
                <div class="d-flex align-items-center">
                    <small class="text-4">{{ format_karma() }} karma</small>
                    <small class="text-4 mx-2">·</small>
                    <small class="text-4">{{ format_date() }}</small>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <button class="btn btn-touch px-0 me-3" @click.passive="switch_to_overview">
                    <span class="text-4" :class="{ 'border-bottom': type == 'UserOverview' }">Overview</span>
                </button>
                <button class="btn btn-touch px-0 me-3" @click.passive="switch_to_posts">
                    <span class="text-4" :class="{ 'border-bottom': type == 'UserPosts' }">Posts</span>
                </button>
                <button class="btn btn-touch px-0" @click.passive="switch_to_comments">
                    <span class="text-4" :class="{ 'border-bottom': type == 'UserComments' }">Comments</span>
                </button>
            </div>
        </div>
        <keep-alive>
            <component ref="component" :is="types[type]"></component>
        </keep-alive>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated, onDeactivated } from 'vue';
import { useRouter } from 'vue-router';
import { Geddit } from "/js/geddit.js";
import UserOverview from './UserOverview.vue';
import UserPosts from './UserPosts.vue';
import UserComments from './UserComments.vue';

const component = ref(null);
const type = ref("UserOverview");
const types = {
    UserOverview,
    UserPosts,
    UserComments
}

const router = useRouter();
const geddit = new Geddit();

const data = ref(null);

const icon_img = ref(null);
const banner_img = ref(null);

async function switch_to_overview() {
    type.value = 'UserOverview';
}

async function switch_to_posts() {
    type.value = 'UserPosts';
}

async function switch_to_comments() {
    type.value = 'UserComments';
}

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

function scroll_handle(el) {
    if (el.target.scrollTop + el.target.clientHeight >= el.target.scrollHeight - window.innerWidth && component.value.scroll_loaded && component.value.after) {
        component.value.scroll();
    }
}

async function handle_page_route(page) {
    if (page == 'submitted') {
        type.value = 'UserPosts'
    } else if (page == 'comments') {
        type.value = 'UserComments'
    }
}

onBeforeMount(() => {
    if (!router.currentRoute.value.params.id) {
        router.back();
        return;
    }

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

    if (router.currentRoute.value.params.page) {
        handle_page_route(router.currentRoute.value.params.page);
    }
})

onDeactivated(() => {
    // Disable scroll event listener
    let view = document.querySelector('.content-view');
    view.removeEventListener('scroll', scroll_handle);
})
</script>