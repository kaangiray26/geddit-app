<template>
    <div class="card-container space-between-16">
        <div class="card-header">
            <div class="d-flex flex-wrap align-items-center text-4">
                <span class="label-medium text-11" @click.passive="open_subreddit">r/{{ post.subreddit
                }}</span>
                <span class="label-medium dmx-4">-</span>
                <span class="label-medium">{{ post.domain }}</span>
                <span class="label-medium dmx-4">-</span>
                <span class="label-medium">{{ format_date() }}</span>
            </div>
            <span class="text-6 dpy-4" :class="store.title_size">{{ post.link_title }}</span>
            <div class="d-flex align-items-center">
                <span class="label-medium text-10" @click.passive="open_user">u/{{ post.author }}</span>
            </div>
        </div>
        <div class="card-content">
            <div class="d-flex cover-25 text-wrap text-break text-truncate overflow-hidden" @click.passive="open_post">
                <div class="text-4 text-post" v-html="markdown(post.body_html)" />
            </div>
        </div>
        <div class="card-details" :class="{ 'sticky': post.stickied }">
            <div v-if="post.over_18" class="d-flex dpb-16">
                <div class="chips-container bg-11 border-0">
                    <span class=" material-icons">18_up_rating</span>
                    <span class="label-large">NSFW</span>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <div class="md-icon-container-with-label">
                    <span class="material-icons">arrow_upward</span>
                    <span class="label-large">{{ format_num(post.score) }}</span>
                </div>
                <div class="md-icon-container-with-label">
                    <span class="material-icons">chat</span>
                    <span class="label-large">{{ format_num(post.num_comments) }}</span>
                </div>
                <div class="md-icon-container-with-label" @click.passive="share">
                    <span class="material-icons">share</span>
                    <span class="label-large">Share</span>
                </div>
                <div class="md-icon-container-with-label" @click.passive="hide_post">
                    <span class="material-icons">hide_source</span>
                    <span class="label-large">Hide</span>
                </div>
                <div class="md-icon-container-with-label" @click.passive="open_post">
                    <span class="material-icons">open_in_new</span>
                    <span class="label-large">Open</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { store, hide, unhide } from '/js/store.js'

const router = useRouter();

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})

async function hide_post() {
    if (!store.hidden.includes(props.post.id)) {
        hide(props.post.id)
        return
    }
    unhide(props.post.id)
}

function format_num(points) {
    if (points > 1000000) return (points / 1000000).toFixed(1) + "M";
    if (points > 1000) return (points / 1000).toFixed(1) + "K";
    return points;
}

async function open_post() {
    router.push(`/post/${props.post.link_id.split("_").pop()}`);
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