<template>
    <li class="list-group-item foreground border-0 rounded m-3 mt-0 p-0 snap">
        <div class="d-flex flex-column mb-2">
            <div class="d-flex flex-column p-3 pb-0" :class="{ 'sticky': post.stickied }">
                <div class="d-flex flex-wrap align-items-center">
                    <small class="text-11 me-2" @click.passive="open_subreddit">{{ post.subreddit }}</small>
                    <small class="text-4 me-2">{{ post.domain }}</small>
                    <small class="text-4 me-2">{{ format_date() }}</small>
                </div>
                <h6 class="title fw-bold text-break text-6 mb-2"
                    :class="{ 'text-truncate': store.hidden.includes(post.id) }">{{
                        post.title }}</h6>
            </div>
            <div class="d-flex px-3 mb-2" v-if="post.over_18">
                <span class="badge bg-11">NSFW</span>
            </div>
            <div :hidden="store.hidden.includes(post.id)">
                <component :is="types[type]" :data="post" />
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
                <button class="btn btn-touch bg-3 text-4 me-2" @click.passive="share">
                    <span class="bi bi-share-fill"></span>
                </button>
                <button class="btn btn-touch bg-3 text-4 me-2" @click.passive="hide_post">
                    <span class="bi"
                        :class="{ 'bi-eye-fill': store.hidden.includes(post.id), 'bi-eye-slash-fill': !store.hidden.includes(post.id) }"></span>
                </button>
                <button class="btn btn-touch bg-3 text-4" @click.passive="open_post">
                    <span class="bi bi-arrow-right"></span>
                </button>
            </div>
        </div>
    </li>
</template>

<script setup>
import { ref } from 'vue';
import { store, hide, unhide } from '/js/store.js'
import { useRouter } from 'vue-router';
import { Share } from '@capacitor/share';
import Placeholder from '/contents/Placeholder.vue';
import CompactText from '/contents/CompactText.vue';
import CompactImage from '/contents/CompactImage.vue';
import CompactVideo from '/contents/CompactVideo.vue';
import CompactEmbed from '/contents/CompactEmbed.vue';
import CompactLink from '/contents/CompactLink.vue';
import CompactGallery from '/contents/CompactGallery.vue';
import CompactFallback from '../contents/CompactFallback.vue';

const router = useRouter();

const type = ref(null);
const types = {
    Placeholder,
    CompactText,
    CompactImage,
    CompactVideo,
    CompactEmbed,
    CompactLink,
    CompactGallery,
    CompactFallback
}

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})

async function share() {
    await Share.share({
        url: "https://www.reddit.com" + props.post.permalink,
    });
}
async function hide_post() {
    if (!store.hidden.includes(props.post.id)) {
        hide(props.post.id)
        return
    }
    unhide(props.post.id)
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

function format_num(points) {
    if (points > 1000000) return (points / 1000000).toFixed(1) + "M";
    if (points > 1000) return (points / 1000).toFixed(1) + "K";
    return points;
}

async function get_type() {
    // video
    if (props.post.domain == "v.redd.it") {
        type.value = "CompactVideo";
        return
    }

    // image
    if (props.post.domain == "i.redd.it") {
        type.value = "CompactImage";
        return
    }

    // embed
    if (props.post.media) {
        type.value = "CompactEmbed";
        return
    }

    // text
    if (props.post.is_self) {
        type.value = "CompactText";
        return
    }

    // Consider post hint
    if (props.post.post_hint == 'image') {
        type.value = "CompactImage";
        return
    }

    if (props.post.post_hint == 'link') {
        type.value = "CompactLink";
        return
    }

    if (props.post.url.startsWith('https://www.reddit.com/gallery/')) {
        type.value = "CompactGallery";
        return
    }
    type.value = "CompactFallback";
}

// onBeforeMount replacement
get_type();
</script>