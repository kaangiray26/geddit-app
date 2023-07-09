<template>
    <div class="d-flex flex-column foreground cover-all">
        <div class="m-3">
            <h6 class="text-6 mb-0">Images</h6>
        </div>
        <div class="row row-cols-4 g-1">
            <div v-for="image in images" class="col col-gallery">
                <img :src="get_image_src(image.uri)" class="img-gallery">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

const images = ref([]);

async function load_images() {
    let response = await Filesystem.readdir({
        path: "Geddit/",
        directory: Directory.Data
    });

    images.value = response.files;
}

function get_image_src(uri) {
    return Capacitor.convertFileSrc(uri);
}

onBeforeMount(() => {
    load_images();
})
</script>