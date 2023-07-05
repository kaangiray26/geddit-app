<template>
    <div v-if="!data" class="progress " role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0"
        aria-valuemax="100">
        <div class="progress-bar"></div>
    </div>
    <div v-else>
        <div class="d-flex flex-column foreground">
            <div class="d-flex flex-column mb-2">
                <div class="d-flex flex-column p-3 pb-0">
                    <h6 class="text-4 mb-2">{{ data.title }}</h6>
                    <div class="d-flex flex-wrap mb-2">
                        <small class="text-11 me-2">{{ data.subreddit }}</small>
                        <small class="text-4 me-2">{{ data.domain }}</small>
                    </div>
                </div>
                <div class="d-flex px-3 mb-2" v-if="data.over_18">
                    <span class="badge bg-11">NSFW</span>
                </div>
                <div v-if="type == 'text'">
                    <div class="d-flex flex-column bg-dark p-3 rounded">
                        <div class="text-4 text-post" v-html="text" />
                    </div>
                </div>
                <div v-if="type == 'image'">
                    <div class="d-flex cover-50 position-relative bg-dark" :style="image_options.style">
                        <img :src="image_options.preview" class="position-relative cover-50" @click="fullscreen"
                            loading="lazy">
                    </div>
                </div>
                <div v-if="type == 'video'">
                    <VideoPlayer ref="video_player" :options="video_options" />
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
                            <small class="bi bi-arrow-up text-light me-1"></small>
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
                    <div>
                        <button class="btn btn-touch text-4 py-0">
                            <span class="bi bi-three-dots"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex flex-column border-secondary">
            <div class="foreground border-bottom border-secondary p-2">
                <h6 class="text-6 fw-bold m-0">Comments</h6>
            </div>
            <div v-for="comment in comments" class="foreground border-bottom border-secondary p-2">
                <small class="text-10">{{ comment.data.author }}</small>
                <div class="text-4 text-post" v-html="markdown(comment.data.body)"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { open_image_viewer } from "/js/event.js";
import VideoPlayer from './VideoPlayer.vue';
import { Geddit } from "/js/geddit.js";
import showdown from 'showdown';

const router = useRouter();
const geddit = new Geddit();
const converter = new showdown.Converter({
    simplifiedAutoLink: true,
});

const data = ref(null);
const comments = ref([]);

const type = ref(null);
const text = ref(null);

const image_src = ref(null);
const image_options = ref({});

const video_options = ref({});
const video_player = ref(null);

async function setup() {
    let response = await geddit.getSubmissionComments(router.currentRoute.value.params.id);
    if (!response) return;

    data.value = response.submission;
    comments.value = response.comments.slice(0, -1)

    // Get image source
    get_sources();
}

async function get_sources() {
    if (data.value.is_self) {
        text.value = converter.makeHtml(data.value.selftext);
        type.value = "text";
        return;
    }

    // video
    if (data.value.domain == "v.redd.it") {
        video_options.value = {
            src: data.value.secure_media.reddit_video.dash_url,
            poster: data.value.preview.images[0].source.url.replaceAll("&amp;", "&"),
            duration: data.value.secure_media.reddit_video.duration,
            style: {
                'aspect-ratio': `${data.value.secure_media.reddit_video.width} / ${data.value.secure_media.reddit_video.height}`
            }
        }

        type.value = "video";
        return
    }

    // image
    if (data.value.domain == "i.redd.it") {
        image_options.value = {
            src: data.value.url,
            preview: data.value.preview.images[0].resolutions.pop().url.replaceAll("&amp;", "&"),
            style: {
                'aspect-ratio': `${data.value.preview.images[0].resolutions.slice(-1)[0].width} / ${data.value.preview.images[0].resolutions.slice(-1)[0].height}`
            }
        }

        type.value = "image";
        return
    }

    // Gallery
    if (data.value.gallery_data) {
        image_options.value = {
            src: `https://i.redd.it/${data.value.gallery_data.items[0].media_id}.jpg`,
            preview: data.value.preview.images[0].resolutions.pop().url.replaceAll("&amp;", "&"),
            style: {
                'aspect-ratio': `${data.value.preview.images[0].source.width} / ${data.value.preview.images[0].source.height}`
            }
        }

        type.value = "image";
        return
    }

    // Link
    if (data.value.preview) {
        image_options.value = {
            src: data.value.preview.images[0].source.url.replaceAll("&amp;", "&"),
            preview: data.value.preview.images[0].resolutions.pop().url.replaceAll("&amp;", "&"),
            style: {
                'aspect-ratio': `${data.value.preview.images[0].source.width} / ${data.value.preview.images[0].source.height}`
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

function markdown(body) {
    return converter.makeHtml(body);
}

onBeforeMount(() => {
    if (!router.currentRoute.value.params.id) {
        router.back();
        return;
    }
    setup();
})
</script>