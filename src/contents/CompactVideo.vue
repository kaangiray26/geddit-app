<template>
    <div class="d-flex cover-50 position-relative bg-dark"
        :style="{ 'aspect-ratio': dimensions.width + '/' + dimensions.height + '!important' }">
        <video ref="video" class="video-js v-compact position-relative theme-shadow" @touchstart="fullscreen">
        </video>
        <div v-if="play_promise" class="d-flex justify-content-center align-items-center cover-all position-absolute">
            <div class="d-flex circle background p-2">
                <div class="spinner-border background text-4" role="status"></div>
            </div>
        </div>
        <div v-show="has_audio" class="position-absolute bottom-0 start-0 m-2" @click="mute">
            <div class="position-relative">
                <div class="position-absolute bg-dark cover-all opacity-75 circle"></div>
                <button class="position-relative btn btn-touch circle bi px-2 py-1"
                    :class="{ 'bi-volume-mute-fill': muted, 'bi-volume-up-fill': !muted }">
                </button>
            </div>
        </div>
        <div class="position-absolute bottom-0 end-0 m-2">
            <div class="d-flex position-relative">
                <div class="position-absolute bg-dark cover-all opacity-75 rounded"></div>
                <small class="position-relative text-4 px-1">{{ remaining }}</small>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeUnmount, onBeforeMount, onMounted } from 'vue';
import videojs from 'video.js';
import { useIntersectionObserver } from '@vueuse/core'

const video = ref(null);
const player = ref(null);
const dimensions = ref({
    width: 0,
    height: 0
});

const remaining = ref(null);
const play_promise = ref(null);

const muted = ref(true);
const has_audio = ref(false);
const is_fullscreen = ref(false);

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

async function reset() {
    // Ignore if video has
    if (!player.value || !player.value.hasStarted() || player.value.paused() || play_promise.value) {
        return
    }

    player.value.pause();
    video.value.muted = true;
    video.value.currentTime = 0;
}

async function fullscreen() {
    if (player.value.isFullscreen()) {
        return
    }

    // Go fullscreen and add controls
    player.value.requestFullscreen();
}

function getRemainingTime() {
    if (!video.value) return null;
    if (!video.value.duration) return null;
    let remaining = video.value.duration - video.value.currentTime;
    let minutes = Math.floor(remaining / 60);
    let seconds = Math.floor(remaining % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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
    player.value = videojs(video.value, {
        loop: true,
        muted: true,
        controls: false,
        autoplay: false,
        preload: 'none',
        poster: props.data.preview.images[0].source.url.replaceAll("&amp;", "&"),
        aspectRatio: `${dimensions.value.width}:${dimensions.value.height}`,
        sources: [
            {
                src: props.data.secure_media.reddit_video.hls_url,
                type: 'application/vnd.apple.mpegURL'
            }
        ]
    });

    player.value.on('fullscreenchange', () => {
        // Set fullscreen options
        if (player.value.isFullscreen()) {
            player.value.removeClass('v-compact');
            player.value.addClass('v-fullscreen');
            player.value.controls(true);
            is_fullscreen.value = true;
            return
        }

        // Remove fullscreen options
        player.value.removeClass('v-fullscreen');
        player.value.addClass('v-compact');
        player.value.controls(false);
        is_fullscreen.value = false;
    })


    // Event for loaded
    video.value.addEventListener('loadeddata', () => {
        has_audio.value = video.value.mozHasAudio ||
            Boolean(video.value.webkitAudioDecodedByteCount) ||
            Boolean(video.value.audioTracks && video.value.audioTracks.length);
    })

    // Events for mute
    video.value.addEventListener('volumechange', () => {
        muted.value = video.value.muted;
    })

    // Events for progress
    video.value.addEventListener('timeupdate', () => {
        remaining.value = getRemainingTime();
    })
}

// setup
onMounted(() => {
    setup();
})

onBeforeMount(() => {
    useIntersectionObserver(video, ([{ isIntersecting }]) => {
        if (isIntersecting) {
            play();
            return
        }
        reset();
    }, {
        threshold: 0.5
    })
})

onBeforeUnmount(() => {
    player.value.dispose();
})
</script>