<template>
    <div class="full-card-container">
        <div class="full-card-content">
            <component :is="types[type]" :data="post.data" />
        </div>
        <div class="full-card-details">
            <div class="d-flex flex-wrap align-items-center text-4">
                <span class="label-medium text-11" @click.passive="open_subreddit">r/{{ post.data.subreddit
                }}</span>
                <span class="label-medium dmx-4">-</span>
                <span class="label-medium">{{ post.data.domain }}</span>
                <span class="label-medium dmx-4">-</span>
                <span class="label-medium">{{ format_date() }}</span>
            </div>
            <span class="text-6 dpy-4" :class="store.title_size">{{ post.data.title }}</span>
            <span class="label-medium text-10" @click.passive="open_user">u/{{ post.data.author }}</span>
            <div class="d-flex align-items-center dpt-16">
                <div class="md-icon-container-with-label">
                    <span class="material-icons">arrow_upward</span>
                    <span class="label-large">{{ format_num(post.data.score) }}</span>
                </div>
                <div class="md-icon-container-with-label">
                    <span class="material-icons">chat</span>
                    <span class="label-large">{{ format_num(post.data.num_comments) }}</span>
                </div>
                <div class="md-icon-container-with-label" @click.passive="share">
                    <span class="material-icons">share</span>
                    <span class="label-large">Share</span>
                </div>
                <div class="md-icon-container-with-label" @click.passive="hide_post">
                    <span class="material-icons">hide_source</span>
                    <span class="label-large">Hide</span>
                </div>
                <div class="md-icon-container-with-label" @click.passive="go_back">
                    <span class="material-icons">close_fullscreen</span>
                    <span class="label-large">Close</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Share } from '@capacitor/share';
import { store, hide, unhide } from '/js/store.js'
import Placeholder from '/contents/Placeholder.vue';
import FullText from '/contents/FullText.vue';
import FullImage from '/contents/FullImage.vue';
import FullVideo from '/contents/FullVideo.vue';
import CompactEmbed from '/contents/CompactEmbed.vue';
import CompactLink from '/contents/CompactLink.vue';
import FullGallery from '/contents/FullGallery.vue';

const router = useRouter();
const type = ref(null);
const types = {
    Placeholder,
    FullText,
    FullImage,
    FullVideo,
    CompactEmbed,
    CompactLink,
    FullGallery
}

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})

async function share() {
    let redditDomain = JSON.parse(localStorage.getItem("share_old_reddit")) ? "https://old.reddit.com" : "https://www.reddit.com";
    await Share.share({
        url: redditDomain + props.post.data.permalink,
    });
}

async function open_user() {
    router.push(`/u/${props.post.data.author}`);
}

async function open_subreddit() {
    router.push(`/r/${props.post.data.subreddit}`);
}

// Return when the post was created
// Format: 1h ago, 1d ago, 1w ago, 1m ago, 1y ago
function format_date() {
    let dt = new Date(props.post.data.created * 1000);
    let now = new Date();

    let diff = now - dt;

    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`;
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    if (diff < 1000 * 60 * 60 * 24 * 7) return `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ago`;
    if (diff < 1000 * 60 * 60 * 24 * 30) return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 7))}w ago`;
    if (diff < 1000 * 60 * 60 * 24 * 365) return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 30))}m ago`;
    return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365))}y ago`;
}

function format_num(points) {
    if (points > 1000000) return (points / 1000000).toFixed(1) + "M";
    if (points > 1000) return (points / 1000).toFixed(1) + "K";
    return points;
}

async function get_type() {
    // video
    if (props.post.data.domain == "v.redd.it") {
        type.value = "FullVideo";
        return
    }

    // image
    if (props.post.data.domain == "i.redd.it") {
        type.value = "FullImage";
        return
    }

    // embed
    if (props.post.data.media) {
        type.value = "CompactEmbed";
        return
    }

    // text
    if (props.post.data.is_self) {
        type.value = "FullText";
        return
    }

    // Consider post hint
    if (props.post.data.post_hint == 'image') {
        type.value = "FullImage";
        return
    }

    if (props.post.data.post_hint == 'link') {
        type.value = "CompactLink";
        return
    }

    if (props.post.data.url_overridden_by_dest.startsWith('https://www.reddit.com/gallery/')) {
        type.value = "FullGallery";
        return
    }
}

async function hide_post() {
    if (!store.hidden.includes(props.post.data.id)) {
        hide(props.post.data.id)
        return
    }
    unhide(props.post.data.id)
}

async function go_back() {
    router.back();
}

// onBeforeMount replacement
get_type();
</script>
