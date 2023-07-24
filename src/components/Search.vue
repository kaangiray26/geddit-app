<template>
    <div class="d-flex flex-column foreground p-3">
        <div class="d-flex align-items-center mb-3">
            <div class="input-group flex-fill">
                <button id="button-addon1" type="button" class="btn btn-outline-4 text-4" @click.passive="go_back">
                    <span class="bi bi-arrow-left"></span>
                </button>
                <input ref="search_field" type="text" class="search-bar form-control" placeholder="Search Reddit"
                    aria-label="Search" @input="search" aria-describedby="button-addon1" @keyup.enter="search">
            </div>
        </div>
        <div class="d-flex flex-column">
            <button class="d-flex align-items-center btn btn-touch flex-fill text-start text-4 p-0 mb-2"
                @click.passive="search_posts">
                <div class="d-flex icon bg-1 justify-content-center align-items-center me-2">
                    <span class="bi bi-postcard-fill"></span>
                </div>
                <span>Search for posts</span>
            </button>
            <button class="d-flex align-items-center btn btn-touch flex-fill text-start text-4 p-0 mb-2"
                @click.passive="search_users">
                <div class="d-flex icon bg-1 justify-content-center align-items-center me-2">
                    <span class="bi bi-person-fill"></span>
                </div>
                <span>Search for users</span>
            </button>
            <button class="d-flex align-items-center btn btn-touch flex-fill text-start text-4 p-0"
                @click.passive="search_communities">
                <div class="d-flex icon bg-1 justify-content-center align-items-center me-2">
                    <span class="bi bi-houses-fill"></span>
                </div>
                <span>Search for communities</span>
            </button>
        </div>
    </div>
    <ul v-show="results.length" class="list-group border-0 pt-0 mt-3">
        <component v-for="result in results" :post="result.data" :is="types[result.kind]" />
    </ul>
    <div v-if="!scroll_loaded" class="progress progress-alt" role="progressbar" aria-label="Basic example" aria-valuenow="0"
        aria-valuemin="0" aria-valuemax="100">
        <div class="progress-bar progress-bar-alt"></div>
    </div>
</template>

<script setup>
import { ref, onActivated, onDeactivated } from 'vue'
import { useRouter } from 'vue-router';
import { Geddit } from "/js/geddit.js";
import CompactComment from './CompactComment.vue'
import CompactUser from './CompactUser.vue';
import CompactPost from './CompactPost.vue';
import CompactSubreddit from './CompactSubreddit.vue';

const types = {
    t1: CompactComment,
    t2: CompactUser,
    t3: CompactPost,
    t5: CompactSubreddit
}

const router = useRouter();
const geddit = new Geddit();

const results = ref([]);
const after = ref(null);

const section = ref('all');
const search_field = ref(null);
const scroll_loaded = ref(true);

function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

const search = debounce(async (event) => {
    event.preventDefault();
    if (!search_field.value.value.length) {
        results.value = [];
        after.value = null;
        search_field.value.focus();
        return;
    }
    get_results();
});

async function get_results() {
    if (!scroll_loaded.value) return;
    scroll_loaded.value = false;

    results.value = [];
    after.value = null;

    let response = await geddit.searchAll(search_field.value.value);
    if (!response) {
        scroll_loaded.value = true;
        return;
    }

    results.value = response.items;
    after.value = response.after;

    scroll_loaded.value = true;
}

async function scroll() {
    scroll_loaded.value = false;

    let response = null;
    if (section.value == 'all') {
        response = await geddit.searchAll(search_field.value.value, null, {
            after: after.value
        });
    }

    else if (section.value == 'posts') {
        response = await geddit.searchSubmissions(search_field.value.value, {
            after: after.value
        });
    }

    else if (section.value == 'users') {
        response = await geddit.searchUsers(search_field.value.value, {
            after: after.value
        });
    }

    else if (section.value == 'communities') {
        response = await geddit.searchSubreddits(search_field.value.value, {
            after: after.value
        });
    }

    if (!response) {
        scroll_loaded.value = true;
        return;
    }

    results.value.push(...response.items);
    after.value = response.after;

    scroll_loaded.value = true;
}

async function go_back() {
    search_field.value.value = "";
    results.value = [];
    after.value = null;
    router.back();
}

async function search_posts() {
    results.value = [];
    after.value = null;
    section.value = 'posts';

    scroll_loaded.value = false;

    let response = await geddit.searchSubmissions(search_field.value.value);
    if (!response) {
        scroll_loaded.value = true;
        return;
    }

    results.value = response.items;
    after.value = response.after;

    scroll_loaded.value = true;
}

async function search_users() {
    results.value = [];
    after.value = null;
    section.value = 'users';

    scroll_loaded.value = false;

    let response = await geddit.searchUsers(search_field.value.value);
    if (!response) {
        scroll_loaded.value = true;
        return;
    }

    results.value = response.items;
    after.value = response.after;

    scroll_loaded.value = true;
}

async function search_communities() {
    results.value = [];
    after.value = null;
    section.value = 'communities';

    scroll_loaded.value = false;

    let response = await geddit.searchSubreddits(search_field.value.value);
    if (!response) {
        scroll_loaded.value = true;
        return;
    }

    results.value = response.items;
    after.value = response.after;

    scroll_loaded.value = true;
}

function scroll_handle(el) {
    if (el.target.scrollTop + el.target.clientHeight >= el.target.scrollHeight - window.innerWidth && scroll_loaded.value && after.value) {
        scroll();
    }
}

onActivated(() => {
    // Add the scroll event listener
    let view = document.querySelector('.content-view');
    view.addEventListener('scroll', scroll_handle)

    // If the search field is empty, focus it
    if (!search_field.value.value) {
        search_field.value.focus()
        return
    }

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