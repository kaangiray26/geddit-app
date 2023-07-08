<template>
    <div class="d-flex cover-50 position-relative background" v-html="embed_options.html" />
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