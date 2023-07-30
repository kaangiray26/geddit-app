<template>
    <div class="profile-container">
        <div class="profile-headline">
            <span class="title-large">Profile</span>
        </div>
    </div>
    <div class="d-flex flex-column px-3">
        <div class="d-flex md-background dpb-16">
            <div class="chips-container" @click.passive="open_gallery">
                <span class=" material-icons">collections</span>
                <span class="label-large">Gallery</span>
            </div>
        </div>
        <div class="divider"></div>
        <div class="list-container py-8">
            <div class="list-item dps-16">
                <span class="body-large">Autoplay</span>
                <span class="list-item-trailing-icon">
                    <div class="switch" :state="autoplay ? 'on' : 'off'" @click.passive="change_autoplay">
                        <div class="switch-container">
                            <span class="material-icons"></span>
                        </div>
                    </div>
                </span>
            </div>
            <div class="list-item dps-16">
                <span class="body-large">Check for updates</span>
                <span class="list-item-trailing-icon">
                    <div class="switch" :state="check_for_updates ? 'on' : 'off'" @click.passive="change_updates">
                        <div class="switch-container">
                            <span class="material-icons"></span>
                        </div>
                    </div>
                </span>
            </div>
            <div class="list-item dps-16">
                <span class="body-large">Use in-app browser</span>
                <span class="list-item-trailing-icon">
                    <div class="switch" :state="in_app_browser ? 'on' : 'off'" @click.passive="change_browser">
                        <div class="switch-container">
                            <span class="material-icons"></span>
                        </div>
                    </div>
                </span>
            </div>
            <div class="list-item dps-16">
                <span class="body-large">Share old.reddit links</span>
                <span class="list-item-trailing-icon">
                    <div class="switch" :state="share_old_reddit ? 'on' : 'off'" @click.passive="change_old_reddit">
                        <div class="switch-container">
                            <span class="material-icons"></span>
                        </div>
                    </div>
                </span>
            </div>
        </div>
        <div class="divider"></div>
        <div class="d-flex flex-column text-4 dpy-16">
            <span class="body-large">Title size</span>
            <div class="d-flex dpt-8">
                <div class="chips-container" :checked="title_size == 'title-large'"
                    @click.passive="change_title_size('title-large')">
                    <span class="material-icons"></span>
                    <span class="label-large">Large</span>
                </div>
                <div class="chips-container" :checked="title_size == 'title-medium'"
                    @click.passive="change_title_size('title-medium')">
                    <span class=" material-icons"></span>
                    <span class="label-large">Medium</span>
                </div>
                <div class="chips-container" :checked="title_size == 'title-small'"
                    @click.passive="change_title_size('title-small')">
                    <span class=" material-icons"></span>
                    <span class="label-large">Small</span>
                </div>
            </div>
        </div>
        <div class="d-flex flex-column">
            <div class="geddit-banner">
                <img src="/images/logo_background.jpg" class="cover-all object-fit-cover md-rounded-12 md-foreground"
                    alt="Photo by Pawel Czerwinski on Unsplash">
                <div class="d-flex flex-column align-items-center position-absolute">
                    <img src="/images/logo_compressed.png" class="snoovatar">
                    <span class="body-large text-6 text-shadow">Geddit</span>
                </div>
            </div>
            <div class="d-flex flex-column text-4 dpt-4">
                <div class="d-flex flex-column align-items-center justify-content-center">
                    <span class="label-medium fst-italic">Made by users, for the users.</span>
                    <div class="d-flex align-items-center dpt-4">
                        <span class="material-icons dpe-4">directions_run</span>
                        <span class="label-medium">kaangiray26</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center dpy-16">
            <div class="md-filled-button-with-icon bg-3 text-4">
                <span class="material-icons">bug_report</span>
                <span class="label-large" @click.passive="open_github">Report a bug</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import { store } from "../js/store";

const router = useRouter();

const autoplay = ref(null);
const title_size = ref(null);
const check_for_updates = ref(null);
const in_app_browser = ref(null);
const share_old_reddit = ref(null);

async function open_github() {
    window.open("https://github.com/kaangiray26/geddit-app", "_blank");
}

async function open_gallery() {
    router.push("/gallery");
}

async function change_title_size(value) {
    title_size.value = value;
    store.title_size = value;
    localStorage.setItem("title_size", JSON.stringify(value));
}

async function change_autoplay() {
    autoplay.value = !autoplay.value;
    document.body.setAttribute("autoplay", autoplay.value);
    localStorage.setItem("autoplay", JSON.stringify(autoplay.value));
}

async function change_updates() {
    check_for_updates.value = !check_for_updates.value;
    localStorage.setItem("check_for_updates", JSON.stringify(check_for_updates.value));
}

async function change_browser() {
    in_app_browser.value = !in_app_browser.value;
    localStorage.setItem("in_app_browser", JSON.stringify(in_app_browser.value));
}

async function change_old_reddit() {
    share_old_reddit.value = !share_old_reddit.value;
    localStorage.setItem("share_old_reddit", JSON.stringify(share_old_reddit.value));
}

onBeforeMount(() => {
    autoplay.value = JSON.parse(localStorage.getItem("autoplay"));
    check_for_updates.value = JSON.parse(localStorage.getItem("check_for_updates"));
    in_app_browser.value = JSON.parse(localStorage.getItem("in_app_browser"));
    share_old_reddit.value = JSON.parse(localStorage.getItem("share_old_reddit"));
    title_size.value = JSON.parse(localStorage.getItem("title_size"));
})
</script>
