<template>
    <li class="list-group-item foreground border-0 rounded m-3 mt-0 p-0">
        <div class="d-flex flex-column">
            <div class="d-flex flex-column p-3 pb-0">
                <h6 class="text-light mb-0">{{ data.title }}</h6>
                <div class="d-flex mb-3 ">
                    <small class="text-danger me-2">{{ data.subreddit }}</small>
                    <small class="text-light me-2">{{ data.domain }}</small>
                    <small class="text-light">{{ data.name }}</small>
                </div>
            </div>
            <div v-if="type == 'image'">
                <div class="cover-all mb-3">
                    <img :src="image_src" class="cover-50" @click="fullscreen" loading="lazy">
                </div>
            </div>
            <div v-if="type == 'video'">
                <VideoPlayer ref="video_player" :options="video_options" />
            </div>
        </div>
        <div class="d-flex flex-column p-3 py-0 mb-3">
            <div class="d-flex">
                <div class="d-flex">
                    <small class="bi bi-arrow-up text-light me-1"></small>
                    <small class="text-light">{{ format_num(data.score) }}</small>
                </div>
                <div class="d-flex mx-2">
                    <small class="text-light">●</small>
                </div>
                <div class="d-flex">
                    <small class="bi bi-chat-fill text-light me-1"></small>
                    <small class="text-light">{{ format_num(data.num_comments) }}</small>
                </div>
            </div>
        </div>
    </li>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useIntersectionObserver } from '@vueuse/core'
import { open_image_viewer } from "/js/event.js";
import VideoPlayer from './VideoPlayer.vue';

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const video_player = ref(null);
const type = ref("text");
const image_src = ref(null);
const video_options = ref({});

async function get_sources() {
    if (props.data.is_self) return;

    // video
    if (props.data.domain == "v.redd.it") {
        type.value = "video";
        video_options.value = {
            src: props.data.secure_media.reddit_video.dash_url,
            poster: props.data.preview.images[0].source.url.replaceAll("&amp;", "&"),
            duration: props.data.secure_media.reddit_video.duration,
        }
        return
    }

    // image
    if (props.data.domain == "i.redd.it") {
        type.value = "image";
        image_src.value = props.data.url;
        return
    }

    // Gallery
    if (props.data.gallery_data) {
        type.value = "image";
        image_src.value = `https://i.redd.it/${props.data.gallery_data.items[0].media_id}.jpg`;
        return
    }

    // Link
    if (props.data.preview) {
        type.value = "image";
        image_src.value = props.data.preview.images[0].source.url.replaceAll("&amp;", "&");
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
        src: image_src.value,
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