<template>
    <div class="d-flex flex-column foreground cover-all">
        <div class="m-3">
            <h6 class="text-6 mb-0">Gallery</h6>
        </div>
        <div class="row row-cols-4 g-1">
            <div v-for="image in images" class="col col-gallery">
                <img :src="image.src" class="img-gallery" @click="open_image(image)">
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onActivated } from 'vue';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { open_gallery_viewer } from "/js/event.js";

const images = ref([]);

async function load_images() {
    let response = await Filesystem.readdir({
        path: "Geddit/",
        directory: Directory.External
    });

    images.value = response.files.map(f => ({
        uri: f.uri,
        name: f.name,
        src: Capacitor.convertFileSrc(f.uri)
    }));
}

async function open_image(image) {
    open_gallery_viewer({
        src: image.src,
        uri: image.uri,
        id: image.name.split("_")[1].split(".")[0],
    });
}

onActivated(() => {
    load_images();
})
</script>