<template>
    <div class="d-flex flex-column background cover-all p-3">
        <h5 class="text-6 mb-3">Settings</h5>
        <div class="mb-2">
            <button class="btn btn-3 fs-6" @click.passive="open_gallery">
                <span class="bi bi-images me-1"></span>
                <span>Gallery</span>
            </button>
        </div>
        <h6 class="text-4">Title Font Size</h6>
        <div class="dropdown">
            <button class="btn btn-3 fs-6 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="me-1">Default:</span>
                <span class="badge bg-10 text-capitalize">{{ title_size }}</span>
            </button>
            <ul class="dropdown-menu bg-3">
                <li @click="change_title_size('small')">
                    <span class="dropdown-item text-4">Small</span>
                </li>
                <li @click="change_title_size('medium')">
                    <span class="dropdown-item text-4">Medium</span>
                </li>
                <li @click="change_title_size('large')">
                    <span class="dropdown-item text-4">Large</span>
                </li>
            </ul>
        </div>
        <hr class="text-6">
        <div class="d-flex justify-content-center mb-1">
            <div class="banner d-flex justify-content-center align-items-center position-relative theme-shadow">
                <img src="/images/logo_background.jpg" class="cover-all rounded"
                    alt="Photo by Pawel Czerwinski on Unsplash">
                <div class="d-flex flex-column align-items-center position-absolute">
                    <img src="/images/logo_compressed.png" class="snoovatar mb-2">
                    <h6 class="fw-bold text-6 mb-0">Geddit App</h6>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center mb-3">
            <small class="fw-bold fst-italic text-6">Made by users, for the users.</small>
        </div>
        <div class="d-flex flex-column text-4">
            <div></div>
            <span class="mb-2">Visit our GitHub Repo to learn how to build more apps with Geddit Library.</span>
            <button type="button" class="btn btn-3 fs-6" @click.passive="open_github">
                <span class="bi bi-github me-1"></span>
                <span>GitHub</span>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const title_size = ref("small");

async function open_github() {
    window.open("https://github.com/kaangiray26/geddit-app", "_blank");
}

async function open_gallery() {
    router.push("/gallery");
}

async function change_title_size(size) {
    title_size.value = size;
    localStorage.setItem("title_size", size);
    router.go();
}

// onBeforeMount replacement
title_size.value = localStorage.getItem("title_size") || "small";
</script>