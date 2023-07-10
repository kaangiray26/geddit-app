<template>
    <li class="list-group-item foreground border-0 rounded m-3 mt-0 p-0" type="link">
        <div class="d-flex flex-column mb-2">
            <div class="d-flex flex-column p-3 pb-0">
                <h6 class="text-break text-4 mb-2">{{ data.title }}</h6>
                <div class="d-flex flex-wrap">
                    <small class="text-11 me-2" @click.passive="open_subreddit">{{ data.subreddit }}</small>
                    <small class="text-4 me-2">{{ data.domain }}</small>
                    <small class="text-4">{{ format_date() }}</small>
                </div>
            </div>
            <div v-if="data.name.startsWith('t1')">
                <div class="d-flex flex-column bg-dark p-3 mt-2">
                    <div class="text-4 text-post" v-html="markdown(data.body)"></div>
                </div>
            </div>
            <div v-if="data.name.startsWith('t3')">
                <div v-if="text" class="mt-2">
                    <div class="text-wrap text-break text-truncate overflow-hidden vh-25 px-3">
                        <div class="text-4 text-post" v-html="text" />
                    </div>
                </div>
                <div v-if="type == 'image'" class="mt-2">
                    <div class="d-flex cover-50 position-relative bg-dark" :style="image_options.style">
                        <img :src="image_options.preview" class="position-relative cover-50" @click.passive="fullscreen"
                            loading="lazy">
                    </div>
                </div>
                <div v-if="type == 'video'" class="mt-2">
                    <VideoPlayer ref="video_player" :options="video_options" />
                </div>
            </div>
        </div>
        <div class="d-flex flex-column p-3 pt-0">
            <div class="d-flex mb-2">
                <small class="text-4 me-2">by</small>
                <small class="text-10" @click.passive="open_user">{{ data.author }}</small>
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
                    <button class="btn btn-touch text-4 py-0" @click.passive="open_post">
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
import { useIntersectionObserver } from '@vueuse/core'
import { open_image_viewer } from "/js/event.js";
import VideoPlayer from '/components/VideoPlayer.vue';
import { marked } from 'marked';

const router = useRouter();

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const type = ref(null);
const text = ref(null);

const image_src = ref(null);
const image_options = ref({});

const video_options = ref({});
const video_player = ref(null);

async function get_sources() {
    if (props.data.is_self) {
        text.value = marked.parse(props.data.selftext);
        type.value = "text";
        return;
    }

    // video
    if (props.data.domain == "v.redd.it") {
        video_options.value = {
            hls: true,
            src: props.data.secure_media.reddit_video.dash_url,
            poster: props.data.preview.images[0].source.url.replaceAll("&amp;", "&"),
            duration: props.data.secure_media.reddit_video.duration,
            style: {
                'aspect-ratio': `${props.data.secure_media.reddit_video.width} / ${props.data.secure_media.reddit_video.height}`
            }
        }

        type.value = "video";
        return
    }

    // image
    if (props.data.domain == "i.redd.it") {
        image_options.value = {
            src: props.data.url,
            preview: props.data.preview.images[0].resolutions.pop().url.replaceAll("&amp;", "&"),
            style: {
                'aspect-ratio': `${props.data.preview.images[0].resolutions.slice(-1)[0].width} / ${props.data.preview.images[0].resolutions.slice(-1)[0].height}`
            }
        }

        type.value = "image";
        return
    }

    // Gallery
    if (props.data.gallery_data) {
        image_options.value = {
            src: `https://i.redd.it/${props.data.gallery_data.items[0].media_id}.jpg`,
            preview: props.data.preview.images[0].resolutions.pop().url.replaceAll("&amp;", "&"),
            style: {
                'aspect-ratio': `${props.data.preview.images[0].source.width} / ${props.data.preview.images[0].source.height}`
            }
        }

        type.value = "image";
        return
    }

    // Link
    if (props.data.preview) {
        image_options.value = {
            src: props.data.preview.images[0].source.url.replaceAll("&amp;", "&"),
            preview: props.data.preview.images[0].resolutions.pop().url.replaceAll("&amp;", "&"),
            style: {
                'aspect-ratio': `${props.data.preview.images[0].source.width} / ${props.data.preview.images[0].source.height}`
            }
        }

        type.value = "image";
    }

    // No source
    type.value = "image";
    image_src.value = "/images/link.svg";
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
        num_comments: props.data.num_comments
    });
}

async function play_video() {
    video_player.value.play();
}

async function reset_video() {
    video_player.value.reset();
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

function markdown(body) {
    return marked.parse(body);
}

onBeforeMount(() => {
    get_sources();

    useIntersectionObserver(video_player, ([{ isIntersecting }]) => {
        if (isIntersecting) {
            play_video();
        } else {
            reset_video();
        }
    }, {
        threshold: 0.5
    })
})
</script>