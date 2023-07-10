<template>
    <div class="background">
        <ul class="nav nav-pills nav-fill">
            <li class="nav-item">
                <button class="nav-link fw-bold" aria-current="page" @click.passive="go_home">
                    <div class="d-flex flex-column align-items-center">
                        <h5 class="text-4 py-1 m-0 bi"
                            :class="{ 'bi-house-door-fill': path == '/', 'bi-house-door': path != '/' }">
                        </h5>
                    </div>
                </button>
            </li>
            <li class="nav-item">
                <button class="nav-link fw-bold" aria-current="page" @click.passive="go_search">
                    <div class="d-flex flex-column align-items-center">
                        <h5 class="text-4 py-1 m-0 bi"
                            :class="{ 'bi-compass-fill': path == '/search', 'bi-compass': path != '/search' }">
                        </h5>
                    </div>
                </button>
            </li>
            <li class="nav-item">
                <router-link to="/subreddits" class="nav-link fw-bold" aria-current="page">
                    <div class="d-flex flex-column align-items-center">
                        <h5 class="text-4 py-1 m-0 bi"
                            :class="{ 'bi-collection-fill': path == '/subreddits', 'bi-collection': path != '/subreddits' }">
                        </h5>
                    </div>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link to="/settings" class="nav-link fw-bold" aria-current="page">
                    <div class="d-flex flex-column align-items-center">
                        <h5 class="text-4 py-1 m-0 bi"
                            :class="{ 'bi bi-gear-fill': path == '/settings', 'bi-gear': path != '/settings' }">
                        </h5>
                    </div>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const path = computed(() => router.currentRoute.value.path);

async function go_home() {
    if (router.currentRoute.value.path == '/') {
        // Scroll to top
        let view = document.querySelector('.content-view');
        view.scroll({
            top: 0,
            behavior: 'smooth'
        })
        return
    }
    router.push('/');
}

async function go_search() {
    if (router.currentRoute.value.path == '/search') {
        // Scroll to top
        let view = document.querySelector('.content-view');
        view.scroll({
            top: 0,
        });
        document.querySelector('input').focus();
        return
    }
    router.push('/search');
}
</script>