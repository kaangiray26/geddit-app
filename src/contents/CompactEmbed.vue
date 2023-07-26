<template>
    <div class="d-flex position-relative text-white cover-all md-background md-rounded-12">
        <iframe :src="src" :height="height" v-show="iframe" scrolling="no" loading="lazy" :style="style"></iframe>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const src = ref(null);
const height = ref(null);
const style = ref(null);
const iframe = ref(false);

async function get_sources() {
    // Listen for messages from the iframe
    window.onmessage = (response) => {
        height.value = response.data.height;
    }

    // Create iframe
    src.value = props.data.secure_media_embed.media_domain_url + '?responsive=true&is_nightmode=true';
    if (props.data.secure_media_embed.width && props.data.secure_media_embed.height) {
        style.value = `aspect-ratio: ${props.data.secure_media_embed.width}/${props.data.secure_media_embed.height};`;
    }

    iframe.value = true;
}

// setup
get_sources();
</script>