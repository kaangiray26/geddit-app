<template>
    <div class="d-flex cover-50 position-relative">
        <div class="w-100 d-flex flex-fill ratio-16-9 bg-black p-3 justify-content-center align-items-center"
            @click="open_link">
            <p class="w-100 word-break fw-bold text-10 rounded p-3 m-0">{{ data.url }}</p>
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
    await Browser.open({
        url: props.data.url
    })
}
</script>