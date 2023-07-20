<template>
    <div class="d-flex cover-50 position-relative background"
        :style="{ 'aspect-ratio': dimensions.width + '/' + dimensions.height + '!important' }">
        <div ref="wrapper" class="video-wrapper">
            <video ref="video" class="position-relative theme-shadow" :poster="get_poster()" preload="metadata" muted loop>
            </video>
            <div v-if="paused" class="video-paused">
                <div class="d-flex circle bg-10 p-1">
                    <button type="button" class="btn btn-touch" @click="play">
                        <span class="bi bi-play-fill text-6"></span>
                    </button>
                </div>
            </div>
            <div v-show="is_fullscreen">
                <div class="video-controls d-flex flex-column flex-fill" :class="{ 'visually-hidden': !controls_visible }">
                    <div class="d-flex cover-all bg-black position-absolute opacity-25"></div>
                    <div class="d-flex justify-content-between position-relative">
                        <button class="btn btn-touch px-3" @click.passive="mute">
                            <span class="text-4 bi"
                                :class="{ 'bi-volume-mute-fill': muted, 'bi-volume-up-fill': !muted }"></span>
                        </button>
                        <button class="btn btn-touch px-3" @click.passive="playback">
                            <span class="text-4 bi" :class="{ 'bi-play-fill': paused, 'bi-pause-fill': !paused }"></span>
                        </button>
                    </div>
                    <div class="d-flex flex-column px-3 pb-5 position-relative" @touchstart="progress_start"
                        @touchmove="progress_move" @touchend="progress_end">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <small class="text-6 fw-bold">{{ currentTime }}</small>
                            <small class="text-6 fw-bold">{{ duration }}</small>
                        </div>
                        <div ref="progress" class="video-progress position-relative">
                            <div class="video-progress-now position-relative" :style="{ 'left': progress_left }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="play_promise" class="d-flex justify-content-center align-items-center cover-all position-absolute">
            <div class="d-flex circle background p-2">
                <div class="spinner-border background text-4" role="status"></div>
            </div>
        </div>
        <div v-show="has_audio" class="position-absolute bottom-0 start-0 m-2" @click.passive="mute">
            <div class="position-relative">
                <div class="position-absolute background cover-all opacity-75 circle"></div>
                <button class="position-relative btn btn-touch circle bi px-2 py-1"
                    :class="{ 'bi-volume-mute-fill': muted, 'bi-volume-up-fill': !muted }">
                </button>
            </div>
        </div>
        <div class="position-absolute bottom-0 end-0 m-2">
            <div class="d-flex position-relative">
                <div class="position-absolute background cover-all opacity-75 rounded"></div>
                <small class="position-relative text-4 px-1">{{ remaining }}</small>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onBeforeMount, onMounted, onDeactivated } from 'vue';
import Hls from 'hls.js';
import { useIntersectionObserver } from '@vueuse/core'
import Hammer from 'hammerjs';

let hls = null;
const video = ref(null);
const hammer = ref(null);
const wrapper = ref(null);
const remaining = ref(null);
const play_promise = ref(null);
const duration = ref(null);
const currentTime = ref(null);
const progress = ref(null);
const progress_left = ref(0);

const paused = ref(false);
const muted = ref(true);
const has_audio = ref(false);
const is_fullscreen = ref(false);
const controls_visible = ref(true);

const dimensions = ref({
    width: 0,
    height: 0
});

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

async function mute() {
    video.value.muted = !video.value.muted;
}

async function play() {
    if (play_promise.value) return

    play_promise.value = video.value.play();
    play_promise.value.then(() => {
        play_promise.value = null;
    })
}

async function playback() {
    if (video.value.paused) {
        await play();
    } else {
        video.value.pause();
    }
}

async function reset() {
    // Ignore if video has
    if (!video.value || video.value.paused || play_promise.value) {
        return
    }

    video.value.pause();
    video.value.muted = true;
    video.value.currentTime = 0;
}

function get_poster() {
    if (props.data.preview) {
        return props.data.preview.images[0].source.url.replaceAll("&amp;", "&")
    }
    return null;
}

async function progress_start(event) {
    event.preventDefault();
    video.value.pause();
}

async function progress_end(event) {
    event.preventDefault();
    let rect = progress.value.getBoundingClientRect();
    let x = event.changedTouches[0].clientX - rect.left;
    video.value.currentTime = x / rect.width * video.value.duration;
    await video.value.play();
}

async function progress_move(event) {
    event.preventDefault();
    let rect = progress.value.getBoundingClientRect();
    let x = event.touches[0].clientX - rect.left;
    video.value.currentTime = x / rect.width * video.value.duration;
}

async function setup() {
    // Set video data
    if (!props.data.secure_media) {
        console.log("No video data", props.data);
        return
    }

    dimensions.value = {
        width: props.data.secure_media.reddit_video.width,
        height: props.data.secure_media.reddit_video.height
    }

    // Load video
    hls = new Hls();
    hls.loadSource(props.data.secure_media.reddit_video.hls_url);
    hls.attachMedia(video.value);

    // Event for loaded
    video.value.onloadeddata = () => {
        duration.value = format_time(video.value.duration);
        has_audio.value = video.value.mozHasAudio ||
            Boolean(video.value.webkitAudioDecodedByteCount) ||
            Boolean(video.value.audioTracks && video.value.audioTracks.length);
    }

    // Events for mute
    video.value.onvolumechange = () => {
        muted.value = video.value.muted;
    }

    // Events for progress
    video.value.ontimeupdate = () => {
        remaining.value = format_time(video.value.duration - video.value.currentTime);
        currentTime.value = format_time(video.value.currentTime);
        progress_left.value = `${(video.value.currentTime / video.value.duration) * 100}%`;
    }

    video.value.onpause = () => {
        paused.value = true;
    }

    video.value.onplay = () => {
        paused.value = false;
    }

    wrapper.value.onfullscreenchange = () => {
        if (document.fullscreenElement) {
            is_fullscreen.value = true;
            hammer.value.get('swipe').set({ enable: true });
            return
        }

        video.value.muted = true;
        is_fullscreen.value = false;
        hammer.value.get('swipe').set({ enable: false });
    }
}

function format_time(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// setup
onMounted(() => {
    setup();
    hammer.value = new Hammer(video.value);
    hammer.value.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL, enable: false });

    hammer.value.on('swipeup swipedown', async () => {
        console.log("Swipe");
        if (!document.fullscreenElement) return;
        document.exitFullscreen();
    })

    hammer.value.on('tap', async () => {
        if (!document.fullscreenElement) {
            wrapper.value.requestFullscreen();
            return
        }

        controls_visible.value = !controls_visible.value;
    })
})

onBeforeMount(() => {
    useIntersectionObserver(video, ([{ isIntersecting }]) => {
        if (isIntersecting && document.body.getAttribute('autoplay') == 'true') {
            play();
            return
        }
        reset();
    }, {
        threshold: 0.5
    })
})

onBeforeUnmount(() => {
    hls.destroy()
})

onDeactivated(() => {
    reset();
})
</script>