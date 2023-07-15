<template>
    <div v-if="!post" class="d-flex justify-content-center align-items-center cover-all position-absolute">
        <div class="d-flex circle bg-6 p-2">
            <div class="spinner-border text-0" role="status"></div>
        </div>
    </div>
    <div v-else>
        <FullPost :post="post" />
        <div class="d-flex flex-column">
            <div class="foreground p-2">
                <h6 class="text-6 fw-bold m-0">Comments</h6>
            </div>
            <div v-for="comment in comments" class="foreground border-bottom border-secondary p-2">
                <small :class="get_author_class(comment.data.author)" @click.passive="open_user(comment.data.author)">{{
                    comment.data.author }}</small>
                <div class="text-4 text-post" v-html="markdown(comment.data.body_html)"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated } from 'vue';
import { useRouter } from 'vue-router';
import FullPost from './FullPost.vue';
import { Geddit } from "/js/geddit.js";

const router = useRouter();
const geddit = new Geddit();

const post = ref(null);
const comments = ref([]);

async function setup() {
    let response = await geddit.getSubmissionComments(router.currentRoute.value.params.id);
    if (!response) return;

    post.value = response.submission;
    comments.value = response.comments.slice(0, -1)
}

function decodeHtml(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function markdown(body) {
    return decodeHtml(body);
}

async function open_user(author) {
    router.push(`/u/${author}`);
}

function get_author_class(author) {
    if (author == "AutoModerator") return "fw-bold bg-14 text-0 rounded px-1";
    return 'bg-10 text-6 rounded px-1';
}

onBeforeMount(() => {
    if (!router.currentRoute.value.params.id) {
        router.back();
        return;
    }

    setup();
})

onActivated(() => {
    // Scroll to top
    let view = document.querySelector('.content-view');
    view.scroll({
        top: 0,
    })
})
</script>