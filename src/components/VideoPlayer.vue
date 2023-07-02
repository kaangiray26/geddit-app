<template>
    <div class="d-flex cover-all position-relative mb-3">
        <video ref="video" data-dashjs-player="" class="cover-50" @click="fullscreen" muted loop></video>
        <div class="position-absolute bottom-0 start-0 m-2" @click="mute">
            <div class="position-relative">
                <div class="position-absolute bg-dark cover-all opacity-75 circle"></div>
                <button class="position-relative btn btn-touch text-white circle bi px-2 py-1"
                    :class="{ 'bi-volume-mute-fill': muted, 'bi-volume-up-fill': !muted }">
                </button>
            </div>
        </div>
        <div class="position-absolute bottom-0 end-0 m-2">
            <div class="d-flex position-relative">
                <div class="position-absolute bg-dark cover-all opacity-75 rounded"></div>
                <small class="position-relative text-white px-1">{{ remaining }}</small>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import dashjs from 'dashjs';

const video = ref(null);
const player = ref(null);

const remaining = ref(null);

const muted = ref(true);
const is_fullscreen = ref(false);

const props = defineProps({
    options: {
        type: Object,
        required: true
    }
})

async function mute() {
    video.value.muted = !video.value.muted;
}

async function play() {
    video.value.play();
}

async function reset() {
    video.value.currentTime = 0;
    video.value.pause();
}

async function fullscreen() {
    // Exit fullscreen and remove controls
    if (is_fullscreen.value) {
        document.exitFullscreen();
        return;
    }

    // Go fullscreen and add controls
    await video.value.requestFullscreen();
}

function getRemainingTime() {
    if (!video.value) return null;
    let remaining = props.options.duration - video.value.currentTime;
    let minutes = Math.floor(remaining / 60);
    let seconds = Math.floor(remaining % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

defineExpose({
    mute,
    play,
    reset
})

onMounted(() => {
    player.value = dashjs.MediaPlayer().create();
    player.value.initialize(video.value, props.options.src, true);

    // Add poster
    video.value.setAttribute('poster', props.options.poster);

    // Events for fullscreen
    video.value.addEventListener('fullscreenchange', () => {
        if (document.fullscreenElement?.nodeName === "VIDEO") {
            video.value.setAttribute('controls', '');
            is_fullscreen.value = true;
            return
        }
        video.value.removeAttribute('controls');
        is_fullscreen.value = false;
    })

    // Events for mute
    video.value.addEventListener('volumechange', () => {
        muted.value = video.value.muted;
    })

    // Events for progress
    video.value.addEventListener('timeupdate', () => {
        remaining.value = getRemainingTime();
    })
})

onBeforeUnmount(() => {
    if (player.value) {
        player.value.destroy();
    }
})
</script>