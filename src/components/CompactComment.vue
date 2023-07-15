<template>
    <li class="list-group-item foreground border-0 rounded m-3 mt-0 p-0">
        <div class="d-flex flex-column mb-2">
            <div class="d-flex flex-column p-3 pb-0">
                <div class="d-flex flex-wrap">
                    <small class="text-11 me-2" @click.passive="open_subreddit">{{ post.subreddit }}</small>
                    <small class="text-4">{{ format_date() }}</small>
                </div>
                <h6 class="title text-break text-4 mb-2">{{ post.link_title }}</h6>
            </div>
            <div class="d-flex flex-column background p-3">
                <div class="text-4 text-post" v-html="markdown(post.body_html)"></div>
            </div>
        </div>
        <div class="d-flex justify-content-between align-items-center pb-3 px-3">
            <div class="d-flex flex-column">
                <div class="d-flex flex-wrap">
                    <small class="text-10" @click.passive="open_user">{{ post.author }}</small>
                </div>
                <div class="d-flex align-items-center">
                    <div class="d-flex">
                        <h6 class="color-upvote fw-bold m-0">{{ format_num(post.score) }}</h6>
                    </div>
                    <div class="d-flex mx-2">
                        <small class="text-4">·</small>
                    </div>
                    <div class="d-flex text-4">
                        <small class="bi bi-chat-fill me-1"></small>
                        <small>{{ format_num(post.num_comments) }}</small>
                    </div>
                </div>
            </div>
            <div class="d-flex">
                <button class="btn btn-touch text-4 me-2" @click.passive="share">
                    <span class="bi bi-share-fill"></span>
                </button>
                <button class="btn btn-touch-border text-4" @click.passive="open_post">
                    <span class="bi bi-arrow-right"></span>
                </button>
            </div>
        </div>
    </li>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})

function format_num(points) {
    if (points > 1000000) return (points / 1000000).toFixed(1) + "M";
    if (points > 1000) return (points / 1000).toFixed(1) + "K";
    return points;
}

async function open_post() {
    router.push(`/post/${props.post.id}`);
}

async function open_user() {
    router.push(`/u/${props.post.author}`);
}

async function open_subreddit() {
    router.push(`/r/${props.post.subreddit}`);
}

// Return when the post was created
// Format: 1h ago, 1d ago, 1w ago, 1m ago, 1y ago
function format_date() {
    let dt = new Date(props.post.created * 1000);
    let now = new Date();

    let diff = now - dt;

    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`;
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    if (diff < 1000 * 60 * 60 * 24 * 7) return `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ago`;
    if (diff < 1000 * 60 * 60 * 24 * 30) return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 7))}w ago`;
    if (diff < 1000 * 60 * 60 * 24 * 365) return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 30))}m ago`;
    return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365))}y ago`;
}

function decodeHtml(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

function markdown(body) {
    return decodeHtml(body);
}
</script>