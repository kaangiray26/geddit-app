<template>
    <li class="list-group-item border-0 rounded m-3 mt-0 p-0">
        <div class="d-flex flex-column">
            <div class="d-flex flex-column p-3 pb-0">
                <h6 class="text-light mb-0">{{ data.title }}</h6>
                <div class="d-flex mb-3 ">
                    <small class="text-danger me-2">{{ data.subreddit }}</small>
                    <small class="text-light me-2">{{ data.domain }}</small>
                    <small class="text-light">{{ data.name }}</small>
                </div>
            </div>
            <div v-if="type != 'text'">
                <div class="d-flex mb-3">
                    <img v-if="type == 'image'" :src="media_src" class="cover" @click="open_image">
                    <video v-if="type == 'video'" :src="media_src" class="cover" controls @click="open_video"></video>
                </div>
            </div>
            <div class="d-flex flex-column p-3 py-0 mb-3">
                <div class="d-flex">
                    <div class="d-flex me-2">
                        <small class="bi bi-arrow-up text-light me-1"></small>
                        <small class="text-light">{{ format_num(data.score) }}</small>
                    </div>
                    <div class="d-flex">
                        <small class="bi bi-chat-fill text-light me-1"></small>
                        <small class="text-light">{{ format_num(data.num_comments) }}</small>
                    </div>
                </div>
            </div>
        </div>
    </li>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const type = ref("text");
const media_src = ref(null);

async function get_img_src() {
    if (props.data.is_self) return;

    if (props.data.domain == "v.redd.it") {
        type.value = "video";
        media_src.value = props.data.secure_media.reddit_video.fallback_url;
        return
    }

    if (props.data.thumbnail != "default") {
        type.value = "image";
        let url = props.data.preview.images[0].source.url.split("https://").pop();
        media_src.value = "https://i." + url.split(".").slice(1).join(".");
        return
    }
}

function format_num(points) {
    if (points > 1000000) return (points / 1000000).toFixed(1) + "M";
    if (points > 1000) return (points / 1000).toFixed(1) + "K";
    return points;
}

async function open_video(event) {
    event.preventDefault();
    event.stopPropagation();
    event.target.fullscreen = true;
}

onBeforeMount(() => {
    get_img_src();
})
</script>