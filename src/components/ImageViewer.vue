<template>
    <div ref="modalElement" class="modal" tabindex="-1">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <div class="modal-body background p-0">
                    <div class="d-flex cover-all position-relative">
                        <img :src="data.src" class="img-contain" @click="controls">
                        <div v-show="controls_visible" class="position-absolute bottom-0 m-2">
                            <div class="d-flex position-relative">
                                <div class="position-absolute bg-dark cover-all opacity-75 rounded"></div>
                                <div class="d-flex flex-column position-relative p-2">
                                    <h6 class="text-white">{{ data.title }}</h6>
                                    <div class="d-flex justify-content-start align-items-center">
                                        <button class="btn btn-touch-border text-white me-2" @click="hide">
                                            <span class="bi bi-arrow-return-left"></span>
                                        </button>
                                        <button class="btn btn-touch-border text-white me-2" @click="comments">
                                            <span class="bi bi-chat-fill me-1"></span>
                                            <span>{{ format_num(data.num_comments) }}</span>
                                        </button>
                                        <!-- <button class="btn btn-touch-border text-white" @click="download">
                                            <span class="bi bi-download"></span>
                                        </button> -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from "bootstrap"

const router = useRouter();

const modal = ref(null);
const modalElement = ref(null);

const data = ref({
    src: null,
    title: null,
    num_comments: null,
    id: null
});
const controls_visible = ref(false);

async function show() {
    modal.value.show();
}

async function hide() {
    modal.value.hide();
}

async function handle(obj) {
    data.value = obj;
    controls_visible.value = true;
    modal.value.show();
}

async function controls() {
    controls_visible.value = !controls_visible.value;
}

function format_num(points) {
    if (points > 1000000) return (points / 1000000).toFixed(1) + "M";
    if (points > 1000) return (points / 1000).toFixed(1) + "K";
    return points;
}

async function comments() {
    await hide();
    router.push("/post/" + data.value.id);
}

async function download() {
    //
}

defineExpose({
    show,
    hide,
    handle
})

onMounted(() => {
    modal.value = new Modal(modalElement.value, {
        keyboard: false
    })
})

onBeforeUnmount(() => {
    modal.value.dispose();
})
</script>