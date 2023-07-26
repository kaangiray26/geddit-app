<template>
    <div class="d-flex cover-50 position-relative md-background" :style="image_options.style">
        <img :src="image_options.preview" class="position-relative theme-shadow cover-50" loading="lazy"
            @click.passive="open_link">
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { Browser } from '@capacitor/browser';

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
            preview: props.data.thumbnail,
            style: {
                'aspect-ratio': `${props.data.thumbnail.width} / ${props.data.thumbnail.height}}`
            }
        }
        return;
    }

    image_options.value = {
        preview: props.data.preview.images[0].resolutions.pop().url.replaceAll("&amp;", "&"),
        style: {
            'aspect-ratio': `${props.data.preview.images[0].resolutions.slice(-1)[0].width} / ${props.data.preview.images[0].resolutions.slice(-1)[0].height}`
        }
    }
}

async function open_link() {
    await Browser.open({
        url: props.data.url
    })
}

// setup
get_sources();
</script>