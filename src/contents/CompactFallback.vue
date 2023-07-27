<template>
    <div class="d-flex cover-50 position-relative">
        <div class="w-100 d-flex flex-fill ratio-16-9 md-background md-rounded-12 p-3 justify-content-center align-items-center ct"
            @click.passive="open_link">
            <p class="w-100 word-break fw-bold text-4 p-3 m-0">{{ data.url }}</p>
        </div>
    </div>
</template>

<script setup>
import { Browser } from '@capacitor/browser';

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

async function open_link() {
    let pref = JSON.parse(localStorage.getItem("in_app_browser"));
    if (pref) {
        await Browser.open({
            url: props.data.url
        })
        return
    }
    window.open(props.data.url, '_blank')


}
</script>