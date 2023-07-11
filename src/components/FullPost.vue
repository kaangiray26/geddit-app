<template>
    <li class="list-group-item foreground border-0 m-0 p-0">
        <div class="d-flex flex-column mb-2">
            <div class="d-flex flex-column p-3 pb-0">
                <div class="d-flex flex-wrap">
                    <small class="text-11 me-2" @click.passive="open_subreddit">{{ post.data.subreddit }}</small>
                    <small class="text-4 me-2">{{ post.data.domain }}</small>
                    <small class="text-4">{{ format_date() }}</small>
                </div>
                <h6 class="fw-bold text-break text-6 mb-2">{{ post.data.title }}</h6>
            </div>
            <div class="d-flex px-3 mb-2" v-if="post.data.over_18">
                <span class="badge bg-11">NSFW</span>
            </div>
            <div class="mx-3">
                <component :is="types[type]" :data="post.data" />
            </div>
        </div>
        <div class="d-flex justify-content-between align-items-center pb-3 px-3">
            <div class="d-flex flex-column">
                <div class="d-flex flex-wrap">
                    <small class="text-10" @click.passive="open_user">{{ post.data.author }}</small>
                </div>
                <div class="d-flex align-items-center">
                    <div class="d-flex">
                        <h6 class="color-upvote fw-bold m-0">{{ format_num(post.data.score) }}</h6>
                    </div>
                    <div class="d-flex mx-2">
                        <small class="text-4">·</small>
                    </div>
                    <div class="d-flex text-4">
                        <small class="bi bi-chat-fill me-1"></small>
                        <small>{{ format_num(post.data.num_comments) }}</small>
                    </div>
                </div>
            </div>
            <div class="d-flex">
                <button class="btn btn-touch text-4 me-2" @click.passive="share">
                    <span class="bi bi-share-fill"></span>
                </button>
                <button class="btn btn-touch-border text-4" @click.passive="go_back">
                    <span class="bi bi-arrow-left"></span>
                </button>
            </div>
        </div>
        <hr class="text-6 m-0">
    </li>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Share } from '@capacitor/share';
import Placeholder from '/contents/Placeholder.vue';
import FullText from '/contents/FullText.vue';
import CompactImage from '/contents/CompactImage.vue';
import CompactVideo from '/contents/CompactVideo.vue';
import CompactEmbed from '/contents/CompactEmbed.vue';
import CompactLink from '/contents/CompactLink.vue';
import CompactGallery from '/contents/CompactGallery.vue';

const router = useRouter();
const type = ref(null);
const types = {
    Placeholder,
    FullText,
    CompactImage,
    CompactVideo,
    CompactEmbed,
    CompactLink,
    CompactGallery
}

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})

async function share() {
    await Share.share({
        url: "https://www.reddit.com" + props.post.data.permalink,
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
        type.value = "CompactVideo";
        return
    }

    // image
    if (props.post.data.domain == "i.redd.it") {
        type.value = "CompactImage";
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
        type.value = "CompactImage";
        return
    }

    if (props.post.data.post_hint == 'link') {
        type.value = "CompactLink";
        return
    }

    if (props.post.data.url.startsWith('https://www.reddit.com/gallery/')) {
        type.value = "CompactGallery";
        return
    }
}

async function go_back() {
    router.back();
}

get_type();
</script>