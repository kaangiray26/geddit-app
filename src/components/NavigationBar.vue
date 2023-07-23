<template>
    <div class="navigation-bar">
        <div class="navigation-bar-container" @touchstart.prevent="go_home"
            :class="{ 'navigation-bar-active': path == '/' }">
            <div class="navigation-bar-indicator">
                <span :class="home">home</span>
            </div>
            <span class="label-medium">Home</span>
        </div>
        <div class="navigation-bar-container" @touchstart.prevent="go_search"
            :class="{ 'navigation-bar-active': path == '/search' }">
            <div class="navigation-bar-indicator">
                <span :class="search">search</span>
            </div>
            <span class="label-medium">Search</span>
        </div>
        <div class="navigation-bar-container" @touchstart.prevent="go_subreddits"
            :class="{ 'navigation-bar-active': path == '/subreddits' }">
            <div class="navigation-bar-indicator">
                <span :class="subreddits">reorder</span>
            </div>
            <span class="label-medium">Subs</span>
        </div>
        <div class="navigation-bar-container" @touchstart.prevent="go_settings"
            :class="{ 'navigation-bar-active': path == '/settings' }">
            <div class="navigation-bar-indicator">
                <span :class="settings">person</span>
            </div>
            <span class="label-medium">Profile</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const path = computed(() => router.currentRoute.value.path);

const home = computed(() => ({
    'material-icons': path.value == '/',
    'material-icons-outlined': path.value != '/',
}))

const search = computed(() => ({
    'material-icons': path.value == '/search',
    'material-icons-outlined': path.value != '/search',
}))

const subreddits = computed(() => ({
    'material-icons': path.value == '/subreddits',
    'material-icons-outlined': path.value != '/subreddits',
}))

const settings = computed(() => ({
    'material-icons': path.value == '/settings',
    'material-icons-outlined': path.value != '/settings',
}))

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

async function go_subreddits() {
    if (router.currentRoute.value.path == '/subreddits') {
        // Scroll to top
        let view = document.querySelector('.content-view');
        view.scroll({
            top: 0,
            behavior: 'smooth'
        })
        return
    }
    router.push('/subreddits');
}

async function go_settings() {
    if (router.currentRoute.value.path == '/settings') {
        // Scroll to top
        let view = document.querySelector('.content-view');
        view.scroll({
            top: 0,
            behavior: 'smooth'
        })
        return
    }
    router.push('/settings');
}
</script>