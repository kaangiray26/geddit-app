<template>
    <div class="search-container sticky-top md-background mb-0">
        <div class="search-leading-icon-container" @touchstart.prevent="go_back">
            <span class="material-icons">arrow_back</span>
        </div>
        <div class="search-input">
            <input ref="search_field" type="text" class="body-large" placeholder="Search Reddit" @input="search"
                @keyup.enter="search">
        </div>
        <div class="search-trailing-icon-container" @touchstart.prevent="clear_input">
            <span class="material-icons">clear</span>
        </div>
    </div>
    <div v-show="results.length" class="cards dpy-16">
        <component v-for="result in results" :post="result.data" :is="types[result.kind]" />
    </div>
    <div v-show="!scroll_loaded" class="md-progress-container">
        <div class="md-progress">
            <div class="md-progress-indicator"></div>
        </div>
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

function debounce(func, timeout = 750) {
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

async function clear_input() {
    search_field.value.value = "";
    search_field.value.focus();
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