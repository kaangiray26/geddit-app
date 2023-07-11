<template>
    <div class="d-flex cover-50 position-relative">
        <div class="wrapper theme-shadow">
            <div v-for="image in images">
                <img :src="image.preview" @click.passive="fullscreen(image)">
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
import { onMounted, ref } from 'vue';
import { open_image_viewer } from "/js/event.js";

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const images = ref([]);

async function get_sources() {
    let order = props.data.gallery_data.items.map(item => item.media_id);
    let items = order.map(id => props.data.media_metadata[id]);

    images.value = items.map(item => ({
        src: item.s.u.split("?")[0].replace("preview", "i"),
        preview: item.p.pop().u.replaceAll("&amp;", "&"),
        style: {
            'aspect-ratio': `${item.p.pop().x} / ${item.p.pop().y}}`
        }
    }))
}

async function fullscreen(image) {
    open_image_viewer({
        src: image.src,
        title: props.data.title,
        num_comments: props.data.num_comments,
        id: props.data.id,
    });
}

// setup
get_sources();

onMounted(() => {
    let wrapper = document.querySelector(".wrapper");
    wrapper.scrollLeft = 0;
})
</script>