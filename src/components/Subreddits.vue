<template>
    <div class="search-container sticky-top md-background mb-0">
        <div class="search-leading-icon-container" @touchstart.prevent="go_back">
            <span class="material-icons">arrow_back</span>
        </div>
        <div class="search-input">
            <input v-model="text" type="text" class="body-large" placeholder="Search Subreddits" @input="search">
        </div>
        <div class="search-trailing-icon-container" @touchstart.prevent="clear_input">
            <span class="material-icons">clear</span>
        </div>
    </div>
    <div class="display-flex justify-content-center p-3" v-show="!subreddits.length">
        <span class="title-medium text-4">Explore and follow some subreddits!</span>
    </div>
    <div v-show="subreddits.length" class="cards mt-3">
        <CompactSubreddit v-for="subreddit in subreddits" :post="subreddit" />
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import CompactSubreddit from './CompactSubreddit.vue';
import Fuse from 'fuse.js';

const router = useRouter();

const subreddits = ref([]);
const _subreddits = ref([]);

const text = ref("")
const fuse = ref(null);

async function search() {
    let query = text.value;
    if (query.length == 0) {
        subreddits.value = _subreddits.value;
        return;
    }

    subreddits.value = fuse.value.search(query).map(item => item.item);
}

async function go_back() {
    // clear text
    text.value = "";
    router.back();
}

async function get_subreddits() {
    subreddits.value = JSON.parse(localStorage.getItem("subreddits"));
    _subreddits.value = subreddits.value;
}

async function open_subreddit(sub) {
    router.push("/r/" + sub.display_name)
}

onBeforeMount(() => {
    fuse.value = new Fuse(subreddits.value, {
        threshold: 0.3,
        keys: ['display_name'],
    });
})

onActivated(() => {
    get_subreddits();
})
</script>