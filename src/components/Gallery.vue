<template>
    <div class="d-flex flex-column">
        <div class="m-3">
            <h5 class="text-6 mb-0">Gallery</h5>
        </div>
        <div class="display-flex justify-content-center p-3" v-show="!images.length">
            <span class="title-medium text-4">No images found.</span>
        </div>
        <div v-show="edit_mode">
            <div class="d-flex mb-1">
                <button class="btn btn-touch" @click.passive="delete_images">
                    <div class="d-flex flex-column text-6 btn-touch">
                        <span class="bi bi-trash-fill"></span>
                        <span>Delete</span>
                    </div>
                </button>
            </div>
        </div>
        <div class="row row-cols-4 g-1">
            <div v-for="image in images" class="col col-gallery">
                <img :src="image.src" class="img-gallery" @click.passive="clicked(image)"
                    @contextmenu.prevent="right_clicked(image)">
                <div v-show="edit_mode" class="position-absolute top-0 start-0 m-2">
                    <div class="theme-shadow" :class="get_edit_style(image)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onActivated, onDeactivated } from 'vue';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { open_gallery_viewer } from "/js/event.js";

const images = ref([]);
const edit_mode = ref(false);
const selected_items = ref([]);

async function delete_image(fname) {
    new Promise(async (resolve, reject) => {
        await Filesystem.deleteFile({
            path: "geddit/" + fname,
            directory: Directory.Documents
        });
        resolve();
    })
}

async function delete_images() {
    let items = selected_items.value;

    Promise.all(items.map(item => delete_image(item)))
        .then(() => {
            console.log("All items deleted.");
            edit_mode.value = false;
            selected_items.value = [];
            load_images();
        });
}

function get_edit_style(image) {
    if (selected_items.value.includes(image.name)) {
        return 'checked'
    }
    return 'unchecked'
}

async function right_clicked(image) {
    if (!edit_mode.value) {
        edit_mode.value = true;
    }

    if (selected_items.value.includes(image.name)) {
        selected_items.value = selected_items.value.filter(item => item != image.name);
        if (!selected_items.value.length)
            edit_mode.value = false;
        return;
    }
    selected_items.value.push(image.name);
}

async function load_images() {
    let response = await Filesystem.readdir({
        path: "geddit/",
        directory: Directory.Documents
    });

    images.value = response.files.map(f => ({
        uri: f.uri,
        name: f.name,
        src: Capacitor.convertFileSrc(f.uri)
    }));
}

async function clicked(image) {
    if (!edit_mode.value) {
        open_gallery_viewer({
            src: image.src,
            uri: image.uri,
            id: image.name.split("_")[1].split(".")[0],
        });
        return
    }

    if (selected_items.value.includes(image.name)) {
        selected_items.value = selected_items.value.filter(item => item != image.name);
        if (!selected_items.value.length)
            edit_mode.value = false;
        return;
    }
    selected_items.value.push(image.name);
}

onActivated(() => {
    load_images();
})

onDeactivated(() => {
    edit_mode.value = false;
    selected_items.value = [];
})
</script>