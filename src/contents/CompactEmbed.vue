<template>
    <div class="d-flex position-relative text-white cover-all">
        <div v-html="embed_options.html"></div>
        <iframe :src="src" :height="height" v-show="iframe" scrolling="no" loading="lazy"></iframe>
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
const iframe = ref(false);
const embed_options = ref({});

async function get_sources() {
    if (props.data.domain == 'twitter.com') {
        // Listen for messages from the iframe
        window.onmessage = (response) => {
            height.value = response.data.height;
        }

        // Create iframe
        src.value = props.data.secure_media_embed.media_domain_url + '?responsive=true&is_nightmode=true';
        iframe.value = true;
        return
    }

    let txt = document.createElement("textarea");
    txt.innerHTML = props.data.media.oembed.html;

    embed_options.value = {
        html: txt.value
    }
}

// setup
get_sources();
</script>