<template>
    <div class="d-flex cover-50 position-relative">
        <div class="wrapper theme-shadow">
            <div v-for="image in images">
                <img :src="image.preview">
                <div class="position-absolute top-0 end-0 m-2">
                    <div class="d-flex position-relative">
                        <div class="position-absolute background cover-all opacity-75 rounded"></div>
                        <small class="gallery-indicator position-relative text-4 px-1" :length="images.length"></small>
                    </div>
                </div>
            </div>
        </div>
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

const page = ref(1);
const images = ref([]);

async function get_sources() {
    images.value = Object.values(props.data.media_metadata).map(item => ({
        src: item.s.u.split("?")[0].replace("preview", "i"),
        preview: item.p.pop().u.replaceAll("&amp;", "&"),
        style: {
            'aspect-ratio': `${item.p.pop().x} / ${item.p.pop().y}}`
        }
    }))
    return

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

// setup
get_sources();
</script>