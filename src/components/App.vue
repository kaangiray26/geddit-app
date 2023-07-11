<template>
    <div class="vw-100 complete-view d-flex flex-column">
        <div class="content-view">
            <router-view v-slot="{ Component }">
                <keep-alive :max="10">
                    <component :is="Component" :key="router.currentRoute.value.path"></component>
                </keep-alive>
            </router-view>
        </div>
        <Toolbar />
        <ImageViewer ref="image_viewer" />
        <GalleryViewer ref="gallery_viewer" />
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { App } from '@capacitor/app';
import Toolbar from './Toolbar.vue';
import ImageViewer from './ImageViewer.vue';
import GalleryViewer from './GalleryViewer.vue';

const router = useRouter();

const image_viewer = ref(null);
const gallery_viewer = ref(null);
const path = computed(() => router.currentRoute.value.path);

async function back_handler() {
    // Check if the image viewer is open
    if (image_viewer.value.is_open()) {
        image_viewer.value.hide();
        return;
    }

    // Check if the gallery viewer is open
    if (gallery_viewer.value.is_open()) {
        gallery_viewer.value.hide();
        return;
    }

    // Check if video player is open
    if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
    }

    // Exit if we are on the home page
    if (path.value == '/') {
        App.exitApp();
        return
    }

    // Otherwise, go back
    router.back();
}

onBeforeMount(() => {
    App.removeAllListeners().then(
        App.addListener('backButton', back_handler)
    )

    // Add event listeners for image viewer
    window.addEventListener("image_viewer", (event) => {
        image_viewer.value.handle(event.detail);
    })

    // Add event listeners for gallery viewer
    window.addEventListener("gallery_viewer", (event) => {
        gallery_viewer.value.handle(event.detail);
    })
})

onMounted(() => {
    // Scroll to top
    let view = document.querySelector('.content-view');
    view.scroll({
        top: 0,
        behavior: 'smooth'
    })
})
</script>