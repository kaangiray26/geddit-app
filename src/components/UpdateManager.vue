<template>
    <div ref="modalElement" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered p-3 m-0">
            <div class="modal-content foreground rounded">
                <div class="modal-header foreground rounded-top border-0 pb-0">
                    <h5 class="modal-title text-6">A new version of Geddit is available!</h5>
                    <button type="button" class="btn btn-touch bi bi-x-lg text-6" data-bs-dismiss="modal"
                        aria-label="Close"></button>
                </div>
                <div class="modal-body foreground rounded-bottom">
                    <div class="d-flex flex-column">
                        <h5 v-if="latest_release" class="text-11">{{ latest_release.tag_name }}</h5>
                        <div ref="body" class="release-body d-flex flex-column text-4 border rounded p-3" />
                        <p class="text-4 mt-3 mb-0">Clicking the update button will download the latest release from our
                            GitHub repository and bypass F-Droid's checks if you have downloaded the app from there.</p>
                        <button class="btn btn-touch bg-10 mt-3" @click="update">Update</button>
                        <button class="btn btn-touch bg-10 mt-2" @click="dont_ask">Don't ask again</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount } from 'vue';
import { AppLauncher } from '@capacitor/app-launcher';
import { Modal } from "bootstrap"

const version = "v1.7";

const modal = ref(null);
const body = ref(null);
const modalElement = ref(null);

const latest_release = ref(null);

async function update() {
    let tag = latest_release.value.tag_name
    await AppLauncher.openUrl({
        url: `https://github.com/kaangiray26/geddit-app/releases/download/${tag}/Geddit_${tag}.apk`
    })
}

async function render(markdown) {
    let response = await fetch('https://api.github.com/markdown', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'mode': 'markdown', 'text': markdown })
    })
        .then(res => res.text())
        .catch(err => null);
    body.value.innerHTML = response;
}

async function check_for_updates() {
    let response = await fetch("https://api.github.com/repos/kaangiray26/geddit-app/releases/latest")
        .then(res => res.json())
        .catch(err => null);
    if (!response || version >= response.tag_name) return;

    render(response.body);
    latest_release.value = response;

    show();
}

async function show() {
    modal.value.show();
}

async function hide() {
    modal.value.hide();
}

function is_open() {
    return modal.value._isShown;
}

async function dont_ask() {
    localStorage.setItem("check_for_updates", JSON.stringify(false));
    hide();
}

defineExpose({
    show,
    hide,
    is_open
})

onBeforeMount(() => {
    // Check if user wants to check for updates
    let pref = JSON.parse(localStorage.getItem("check_for_updates"));
    if (!pref) return;
    check_for_updates();
})

onMounted(() => {
    // Init modal
    modal.value = new Modal(modalElement.value, {
        keyboard: false
    })
})

onBeforeUnmount(() => {
    modal.value.dispose();
})
</script>