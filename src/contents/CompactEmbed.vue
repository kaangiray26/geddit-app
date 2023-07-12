<template>
    <div class="embed-source ms-3 text-white">{{ props.data.media?.type ?? '' }}</div>
    <div :class="{ 'py-2 px-3': (props.data.media?.type == 'twitter.com') }"
        class="d-flex position-relative border border-white p-1 mx-3 border-2 text-white" v-html="embed_options.html" />
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const embed_options = ref({});

async function get_sources() {
    let txt = document.createElement("textarea");
    txt.innerHTML = props.data.media.oembed.html;
    embed_options.value = {
        html: txt.value
    }
}

// setup
get_sources();
</script>