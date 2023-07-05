<template>
    <div v-if="!data" class="progress " role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0"
        aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
    <div v-else>
        <div class="d-flex flex-column foreground p-3">
            <div class="d-flex flex-column">
                <h6 class="text-11 m-0">{{ data.display_name }}</h6>
                <div class="d-flex mb-2">
                    <small class="text-4">{{ format_subscribers() }}</small>
                    <small class="text-4 mx-2">·</small>
                    <small class="text-4">{{ format_active() }}</small>
                </div>
                <small class="text-4">{{ get_description() }}</small>
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
const scroll_loaded = ref(true);

async function setup() {
    let response = await geddit.getSubreddit(router.currentRoute.value.params.id);
    if (!response) return;

    data.value = response;
}

function format_subscribers() {
    if (data.value.subscribers) {
        return data.value.subscribers.toLocaleString() + " members";
    }
    return "private";
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