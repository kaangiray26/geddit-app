<template>
    <div class="d-flex flex-column foreground cover-all p-3">
        <h6 class="text-6 mb-3">Settings</h6>
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
            <button type="button" class="btn btn-3 fs-6" @click="open_github">
                <span class="bi bi-github me-1"></span>
                <span>GitHub</span>
            </button>
        </div>
    </div>
</template>

<script setup>

async function open_github() {
    window.open("https://github.com/kaangiray26/geddit-app", "_blank");
}
</script>