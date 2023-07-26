<template>
    <div v-if="!data" class="d-flex justify-content-center align-items-center cover-all position-absolute">
        <div class="d-flex circle md-background p-2">
            <div class="spinner-border text-4" role="status"></div>
        </div>
    </div>
    <div v-else class="d-flex flex-column p-3">
        <div class="banner d-flex justify-content-center align-items-center position-relative mb-3">
            <img :src="banner_img" class="cover md-rounded-12">
            <img :src="icon_img" class="snoovatar position-absolute">
        </div>
        <div class="d-flex flex-column text-4 dpb-16">
            <span class="title-large">{{ data.name }}</span>
            <div class="d-flex align-items-center text-4">
                <span class="label-medium">{{ format_karma() }} karma</span>
                <span class="label-medium dmx-4">-</span>
                <span class="label-medium">{{ format_date() }}</span>
            </div>
        </div>
        <div class="tabs">
            <div class="tabs-container tabs-3" @click.passive="switch_to_overview">
                <span class="material-icons">face</span>
                <div class="d-flex flex-column align-items-center">
                    <span class="title-small">Overview</span>
                    <div class="tab-active" :class="{ 'visibility-hidden': type != 'UserOverview' }"></div>
                </div>
            </div>
            <div class="tabs-container tabs-3" @click.passive="switch_to_posts">
                <span class="material-icons">feed</span>
                <div class="d-flex flex-column align-items-center">
                    <span class="title-small">Posts</span>
                    <div class="tab-active" :class="{ 'visibility-hidden': type != 'UserPosts' }"></div>
                </div>
            </div>
            <div class="tabs-container tabs-3" @click.passive="switch_to_comments">
                <span class="material-icons">comment</span>
                <div class="d-flex flex-column align-items-center">
                    <span class="title-small">Comments</span>
                    <div class="tab-active" :class="{ 'visibility-hidden': type != 'UserComments' }"></div>
                </div>
            </div>
        </div>
    </div>
    <keep-alive>
        <component ref="component" :is="types[type]"></component>
    </keep-alive>
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

    banner_img.value = response.subreddit.banner_img ? response.subreddit.banner_img.split("?")[0] : "/images/logo_background.jpg"
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
    if (!component.value) return;
    if (el.target.scrollTop + el.target.clientHeight >= el.target.scrollHeight - window.innerWidth && component.value.scroll_loaded && component.value.after) {
        component.value.scroll();
    }
}

async function handle_page_route(page) {
    if (page == 'submitted') {
        type.value = 'UserPosts'
        return
    }
    if (page == 'comments') {
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