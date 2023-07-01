<template>
    <div class="bg-dark">
        <ul class="nav nav-pills nav-fill">
            <li class="nav-item">
                <router-link to="/" class="nav-link text-white fw-bold" aria-current="page">
                    <div class="d-flex flex-column align-items-center">
                        <h5 class="py-1 m-0 bi"
                            :class="{ 'bi-house-door-fill': path == '/', 'bi-house-door': path != '/' }">
                        </h5>
                    </div>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/search" class="nav-link text-white fw-bold" aria-current="page">
                    <div class="d-flex flex-column align-items-center">
                        <h5 class="py-1 m-0 bi"
                            :class="{ 'bi-search-heart-fill': path == '/search', 'bi-search-heart': path != '/search' }">
                        </h5>
                    </div>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/subreddits" class="nav-link text-white fw-bold" aria-current="page">
                    <div class="d-flex flex-column align-items-center">
                        <h5 class="py-1 m-0 bi"
                            :class="{ 'bi-collection-fill': path == '/subreddits', 'bi-collection': path != '/subreddits' }">
                        </h5>
                    </div>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/saved" class="nav-link text-white fw-bold" aria-current="page">
                    <div class="d-flex flex-column align-items-center">
                        <h5 class="py-1 m-0 bi"
                            :class="{ 'bi bi-archive-fill': path == '/saved', 'bi-archive': path != '/saved' }">
                        </h5>
                    </div>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { App } from '@capacitor/app';
import { useRouter } from 'vue-router';

const router = useRouter();
const path = computed(() => router.currentRoute.value.path);

App.addListener('backButton', () => {
    if (path.value == '/') {
        App.exitApp();
    } else {
        router.back();
    }
});
</script>