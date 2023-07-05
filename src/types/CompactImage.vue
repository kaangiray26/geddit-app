<template>
    <li class="list-group-item foreground border-0 rounded m-3 mt-0 p-0">
        <div class="d-flex flex-column mb-2">
            <div class="d-flex flex-column p-3 pb-0 mb-2">
                <h6 class="text-4 mb-2">{{ data.title }}</h6>
                <div class="d-flex flex-wrap">
                    <small class="text-11 me-2" @click="open_subreddit">{{ data.subreddit }}</small>
                    <small class="text-4 me-2">{{ data.domain }}</small>
                    <small class="text-4">{{ format_date() }}</small>
                </div>
            </div>
            <div class="d-flex px-3 mb-2" v-if="data.over_18">
                <span class="badge bg-11">NSFW</span>
            </div>
            <div>
                <div class="d-flex cover-50 position-relative bg-dark" :style="image_options.style">
                    <img :src="image_options.preview" class="position-relative cover-50" @click="fullscreen" loading="lazy">
                </div>
            </div>
        </div>
        <div class="d-flex flex-column p-3 pt-0">
            <div class="d-flex mb-2">
                <small class="text-4 me-2">by</small>
                <small class="text-10" @click="open_user">{{ data.author }}</small>
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex">
                    <div class="d-flex">
                        <small class="bi bi-arrow-up text-4 me-1"></small>
                        <small class="text-4">{{ format_num(data.score) }}</small>
                    </div>
                    <div class="d-flex mx-2">
                        <small class="text-4">·</small>
                    </div>
                    <div class="d-flex">
                        <small class="bi bi-chat-fill text-4 me-1"></small>
                        <small class="text-4">{{ format_num(data.num_comments) }}</small>
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
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { open_image_viewer } from "/js/event.js";

const router = useRouter();

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const image_options = ref({});

async function get_sources() {
    if (!props.data.preview) {
        image_options.value = {
            src: props.data.url,
            preview: props.data.url,
            style: {
                'aspect-ratio': `${props.data.thumbnail.width} / ${props.data.thumbnail.height}}`
            }
        }
        return;
    }

    image_options.value = {
        src: props.data.url,
        preview: props.data.preview.images[0].resolutions.pop().url.replaceAll("&amp;", "&"),
        style: {
            'aspect-ratio': `${props.data.preview.images[0].resolutions.slice(-1)[0].width} / ${props.data.preview.images[0].resolutions.slice(-1)[0].height}`
        }
    }
}

function format_num(points) {
    if (points > 1000000) return (points / 1000000).toFixed(1) + "M";
    if (points > 1000) return (points / 1000).toFixed(1) + "K";
    return points;
}

async function fullscreen() {
    open_image_viewer({
        src: image_options.value.src,
        title: props.data.title,
        num_comments: props.data.num_comments,
        id: props.data.id,
    });
}

async function open_post() {
    router.push(`/post/${props.data.id}`);
}

async function open_user() {
    router.push(`/u/${props.data.author}`);
}

async function open_subreddit() {
    router.push(`/r/${props.data.subreddit}`);
}

// Return when the post was created
// Format: 1h ago, 1d ago, 1w ago, 1m ago, 1y ago
function format_date() {
    let dt = new Date(props.data.created * 1000);
    let now = new Date();

    let diff = now - dt;

    if (diff < 1000 * 60 * 60) return `${Math.floor(diff / (1000 * 60))}m ago`;
    if (diff < 1000 * 60 * 60 * 24) return `${Math.floor(diff / (1000 * 60 * 60))}h ago`;
    if (diff < 1000 * 60 * 60 * 24 * 7) return `${Math.floor(diff / (1000 * 60 * 60 * 24))}d ago`;
    if (diff < 1000 * 60 * 60 * 24 * 30) return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 7))}w ago`;
    if (diff < 1000 * 60 * 60 * 24 * 365) return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 30))}m ago`;
    return `${Math.floor(diff / (1000 * 60 * 60 * 24 * 365))}y ago`;
}

onBeforeMount(() => {
    get_sources();
})
</script>