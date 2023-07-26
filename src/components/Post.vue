<template>
    <div v-if="!post" class="d-flex justify-content-center align-items-center cover-all position-absolute">
        <div class="d-flex circle md-background p-2">
            <div class="spinner-border text-4" role="status"></div>
        </div>
    </div>
    <div v-else>
        <FullPost :post="post" />
        <div class="d-flex dp-16">
            <span class="title-small text-4">Comments</span>
        </div>
        <div class="list-container py-0">
            <div class="list-item-full list-item-divider" v-for="comment in comments">
                <div class="list-item-leading-icon">
                    <span class="material-icons">face</span>
                </div>
                <div class="d-flex flex-column">
                    <span class="label-small dpb-4 text-10" @click.passive="open_user(comment.data.author)">{{
                        comment.data.author }}</span>
                    <span class="body-medium" v-html="markdown(comment.data.body_html)"></span>
                </div>
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