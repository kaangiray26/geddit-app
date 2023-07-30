<template>
    <div class="vw-100 complete-view d-flex flex-column">
        <div class="content-view">
            <router-view v-slot="{ Component }">
                <keep-alive :max="10">
                    <component :is="Component" :key="router.currentRoute.value.path"></component>
                </keep-alive>
            </router-view>
        </div>
        <NavigationBar />
        <ImageViewer ref="image_viewer" />
        <GalleryViewer ref="gallery_viewer" />
        <UpdateManager ref="update_manager" />
    </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { save_hidden } from '/js/store.js';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { App } from '@capacitor/app';
import { Toast } from '@capacitor/toast';
import NavigationBar from './NavigationBar.vue';
import ImageViewer from './ImageViewer.vue';
import GalleryViewer from './GalleryViewer.vue';
import UpdateManager from './UpdateManager.vue';

const router = useRouter();

const image_viewer = ref(null);
const gallery_viewer = ref(null);
const update_manager = ref(null);

const path = computed(() => router.currentRoute.value.path);
const should_exit = ref(false);

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
        if (!should_exit.value) {
            should_exit.value = true;
            await Toast.show({
                text: "Press back again to exit",
                duration: "short"
            })
            setTimeout(async () => {
                should_exit.value = false;
            }, 2000)
            return;
        }
        should_exit.value = false;
        App.exitApp();
        return
    }

    // Otherwise, go back
    router.back();
}

async function url_handler(event) {
    let url = new URL(event.url);

    if (url.host == "preview.redd.it") {
        router.push('/preview' + url.pathname.split(".").join("/"));
        return
    }

    router.push(url.pathname + url.search);
    return
}

onBeforeMount(() => {
    App.removeAllListeners().then(
        App.addListener('backButton', back_handler)
    )

    // Add events for deep links
    App.addListener('appUrlOpen', url_handler)

    // Add event listeners for image viewer
    window.addEventListener("image_viewer", (event) => {
        image_viewer.value.handle(event.detail);
    })

    // Add event listeners for gallery viewer
    window.addEventListener("gallery_viewer", (event) => {
        gallery_viewer.value.handle(event.detail);
    })

    // Add event listeners for saving the store
    window.onbeforeunload = save_hidden;

    // Create if the geddit folder does not exist
    Filesystem.stat({
        path: "geddit",
        directory: Directory.Documents
    }).catch(() => {
        Filesystem.mkdir({
            path: "geddit",
            directory: Directory.Documents
        })
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