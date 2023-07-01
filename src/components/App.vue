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
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Toolbar from './Toolbar.vue';

const router = useRouter();
</script>