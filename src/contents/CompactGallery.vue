<template>
    <div class="wrapper">
        <div v-for="image in images">
            <img class="ct" :src="image.preview" @click.prevent="emit('open_post')">
            <div class="position-absolute top-0 end-0 m-2">
                <div class="d-flex position-relative">
                    <div class="position-absolute background cover-all opacity-75 rounded"></div>
                    <small class="gallery-indicator position-relative text-4 px-1" :length="images.length"></small>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const emit = defineEmits(['open_post']);
const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const images = ref([]);

async function get_sources() {
    if (!props.data.gallery_data) return;

    let order = props.data.gallery_data.items.map(item => item.media_id);
    let items = order.map(id => props.data.media_metadata[id]);

    images.value = items.map(item => ({
        src: item.s.u ? item.s.u.split("?")[0].replace("preview", "i") : item.s.gif,
        preview: item.p.pop().u.replaceAll("&amp;", "&"),
        style: {
            'aspect-ratio': item.p ? `${item.p.slice(-1)[0].x} / ${item.p.slice(-1)[0].y}` : `${item.s.x} / ${item.s.y}`
        }
    }))
}

// setup
get_sources();

onMounted(() => {
    let wrapper = document.querySelector(".wrapper");
    wrapper.scrollLeft = 0;
})
</script>