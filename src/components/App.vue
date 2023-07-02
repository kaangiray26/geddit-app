<template>
    <div class="vw-100 complete-view d-flex flex-column">
        <div class="content-view">
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" :key="router.currentRoute.value.path"></component>
                </keep-alive>
            </router-view>
        </div>
        <Toolbar />
        <ImageViewer ref="image_viewer" />
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import ImageViewer from './ImageViewer.vue';
import Toolbar from './Toolbar.vue';

const router = useRouter();

const image_viewer = ref(null);

onBeforeMount(() => {
    // Add event listeners for image viewer
    window.addEventListener("image_viewer", (event) => {
        image_viewer.value.handle(event.detail);
    })
})
</script>