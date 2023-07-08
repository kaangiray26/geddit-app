<template>
    <li class="list-group-item foreground border-0 rounded m-3 mt-0 p-0">
        <div class="d-flex flex-column mb-2">
            <div class="d-flex flex-column p-3 pb-0 mb-2">
                <h6 class="text-break text-4 mb-0">{{ post.link_title }}</h6>
            </div>
            <div class="d-flex flex-column bg-1 p-3">
                <div class="text-4 text-post" v-html="markdown(post.body)"></div>
            </div>
        </div>
        <div class="d-flex flex-column p-3 pt-0">
            <div class="d-flex flex-wrap mb-2">
                <small class="text-4 me-2">commented by</small>
                <small class="text-10" @click="open_user">{{ post.author }}</small>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <div class="d-flex">
                        <h6 class="color-upvote fw-bold m-0">{{ format_num(post.score) }}</h6>
                    </div>
                    <div class="d-flex mx-2">
                        <small class="text-4">·</small>
                    </div>
                    <div class="d-flex">
                        <small class="bi bi-chat-fill text-4 me-1"></small>
                        <small class="text-4">{{ format_num(post.num_comments) }}</small>
                    </div>
                </div>
                <div class="d-flex">
                    <button class="btn btn-touch text-4 py-0" @click="open_post">
                        <span class="bi bi-arrow-right"></span>
                    </button>
                </div>
            </div>
        </div>
    </li>
</template>

<script setup>
import { useRouter } from 'vue-router';
import showdown from 'showdown';

const router = useRouter();

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})

const converter = new showdown.Converter({
    simplifiedAutoLink: true,
});

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

function markdown(body) {
    return converter.makeHtml(body);
}
</script>