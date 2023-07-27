<template>
    <div v-if="!post" class="d-flex justify-content-center align-items-center cover-all position-absolute">
        <div class="d-flex circle md-background p-2">
            <div class="spinner-border text-4" role="status"></div>
        </div>
    </div>
    <div v-else>
        <FullPost :post="post" />
        <div class="d-flex dpx-16">
            <span class="title-small text-4">Comments</span>
        </div>
        <div ref="axisX" class="list-container overflow-x-scroll dpy-16" @touchstart="touchstart" @touchmove="touchmove">
            <div v-for="comment in comments">
                <div v-show="comment.kind == 't1'" class="list-item-full list-item-divider pe-0">
                    <div v-show="comment.depth" class="comment-depth-container">
                        <div class="comment-depth" v-for="_ in comment.depth">
                            <div class="comment-depth-line"></div>
                        </div>
                    </div>
                    <div class="list-item-leading-icon">
                        <span class="material-icons">{{ comment.author == 'AutoModerator' ? 'local_police' : 'face'
                        }}</span>
                    </div>
                    <div class="comment-body">
                        <span class="label-small dpb-4 text-10" @click.passive="open_user(comment.author)">{{
                            comment.author }}</span>
                        <span class="body-medium" v-html="markdown(comment.body)"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onActivated, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import FullPost from './FullPost.vue';
import { Geddit } from "/js/geddit.js";

const router = useRouter();
const geddit = new Geddit();

const post = ref(null);
const comments = ref([]);

const start_x = ref(0);
const start_y = ref(0);

const axisX = ref(null);
const axisY = ref(document.querySelector('.content-view'));

async function setup() {
    let response = await geddit.getSubmissionComments(router.currentRoute.value.params.id);
    if (!response) return;

    // Get all replies for all comments in the post with Promise all as a single array
    Promise.all(response.comments.map(async (comment) => {
        return await get_all_replies(comment);
    }))
        .then(replies => {
            comments.value = replies.flat();
            axisX.value = document.querySelector('.list-container');
            axisX.value.scroll({
                left: 0,
            })
        })

    post.value = response.submission;
    await nextTick();
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

async function get_all_replies(comment, depth = 0) {
    let replies = [];
    if (comment.kind == "more") {
        replies.push({
            kind: "more",
            children: comment.data.children,
        })
        return replies;
    }

    replies.push({
        kind: "t1",
        author: comment.data.author,
        body: comment.data.body_html,
        depth: depth,
    })

    if (!comment.data.replies) return replies;
    comment.data.replies.data.children.map(async (reply) => {
        replies.push(...await get_all_replies(reply, depth + 1));
    })
    return replies;
}

async function touchstart(event) {
    start_x.value = event.touches[0].clientX;
    start_y.value = event.touches[0].clientY;
}

async function touchmove(event) {
    // Get the difference between the start and current touch position
    let deltaX = event.touches[0].clientX - start_x.value;
    let deltaY = event.touches[0].clientY - start_y.value;

    // Scroll the axis by the difference and momentum
    axisX.value.scrollLeft -= deltaX;
    axisY.value.scrollTop -= deltaY;

    // Set the start position to the current position
    start_x.value = event.touches[0].clientX;
    start_y.value = event.touches[0].clientY;

    event.preventDefault();
}

onBeforeMount(() => {
    if (!router.currentRoute.value.params.id) {
        router.back();
        return;
    }

    setup();

    // Scroll to top
    axisY.value.scroll({
        top: 0
    })
})

onActivated(() => {
    // Scroll to the last position
    let pages = JSON.parse(localStorage.getItem("pages"));
    let this_page = pages.find(page => page.path == window.location.pathname);
    if (this_page) {
        axisY.value.scrollTop = parseInt(this_page.scroll);
    }
})
</script>