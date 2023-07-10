<template>
    <div class="d-flex flex-column foreground p-3">
        <div class="d-flex align-items-center mb-2">
            <div class="input-group flex-fill">
                <button id="button-addon1" type="button" class="btn btn-outline-4 text-4" @click.passive="go_back">
                    <span class="bi bi-arrow-left"></span>
                </button>
                <input v-model="text" type="text" class="search-bar form-control" placeholder="Search Subreddits"
                    aria-label="Search" @input="search" aria-describedby="button-addon1">
            </div>
        </div>
    </div>
    <ul class="list-group border-0 pt-0 mt-3">
        <li v-show="!subreddits.length" class="list-group-item background border-0 rounded m-3 mt-0 p-0">
            <div class="d-flex justify-content-center align-items-center p-3">
                <h6 class="fw-bold text-break text-6 m-0">Explore and follow some subreddits!</h6>
            </div>
        </li>
        <li v-for="sub in subreddits" class="list-group-item foreground border-0 rounded m-3 mt-0 p-0">
            <div class="d-flex justify-content-between align-items-center p-3">
                <div class="d-flex align-items-center">
                    <div class="me-2">
                        <img :src="sub.icon_img" class="snoovatar-icon">
                    </div>
                    <div class="d-flex flex-column">
                        <div class="d-flex align-items-center">
                            <h6 class="text-break text-11 m-0 me-2">{{ sub.display_name }}</h6>
                        </div>
                    </div>
                </div>
                <div class="d-flex">
                    <button class="btn btn-touch text-4" @click.passive="open_subreddit(sub)">
                        <span class="bi bi-arrow-right"></span>
                    </button>
                </div>
            </div>
        </li>
    </ul>
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import Fuse from 'fuse.js';

const router = useRouter();

const subreddits = ref([]);
const _subreddits = ref([]);

const text = ref("")
const fuse = ref(null);
const mounted = ref(false);

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

async function get_subreddits(_mounted = false) {
    subreddits.value = JSON.parse(localStorage.getItem("subreddits"));
    _subreddits.value = subreddits.value;

    if (_mounted) {
        mounted.value = true;
    }
}

async function open_subreddit(sub) {
    router.push("/r/" + sub.display_name)
}

onBeforeMount(() => {
    get_subreddits(true);
    fuse.value = new Fuse(subreddits.value, {
        threshold: 0.3,
        keys: ['display_name'],
    });
})

onActivated(() => {
    if (mounted.value) {
        get_subreddits();
    }
})
</script>