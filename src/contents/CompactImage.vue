<template>
    <div class="d-flex cover-50 position-relative bg-dark" :style="image_options.style">
        <img :src="image_options.preview" class="position-relative theme-shadow cover-50" @click.passive="fullscreen"
            loading="lazy">
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { open_image_viewer } from "/js/event.js";

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const image_options = ref({});

async function get_sources() {
    if (!props.data.preview) {
        image_options.value = {
            src: props.data.url,
            preview: props.data.url,
            style: {
                'aspect-ratio': `${props.data.thumbnail.width} / ${props.data.thumbnail.height}}`
            }
        }
        return;
    }

    image_options.value = {
        src: props.data.url,
        preview: props.data.preview.images[0].resolutions.pop().url.replaceAll("&amp;", "&"),
        style: {
            'aspect-ratio': `${props.data.preview.images[0].resolutions.slice(-1)[0].width} / ${props.data.preview.images[0].resolutions.slice(-1)[0].height}`
        }
    }
}

async function fullscreen() {
    open_image_viewer({
        src: image_options.value.src,
        title: props.data.title,
        num_comments: props.data.num_comments,
        id: props.data.id,
    });
}

// setup
get_sources();
</script>