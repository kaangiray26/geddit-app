<template>
    <div ref="modalElement" class="modal" tabindex="-1">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <div class="modal-body background overflow-hidden p-0">
                    <div class="d-flex justify-content-center align-items-center cover-all position-relative">
                        <div class="position-relative">
                            <img ref="image" :src="data.src" class="contain position-relative"
                                :style="{ 'left': left + 'px', 'top': top + 'px', 'scale': scale, 'transform': transform_scale + ' ' + transform_translate }">
                        </div>
                        <div class="w-100 position-absolute bottom-0 start-0 p-2"
                            :class="{ 'fade-in': controls_visible, 'fade-out': !controls_visible }">
                            <div class="d-flex position-relative">
                                <div class="d-flex position-absolute background opacity-75 cover-all rounded"></div>
                                <div class="d-flex flex-column position-relative p-2">
                                    <div class="d-flex justify-content-start align-items-center">
                                        <button class="btn btn-touch-border text-4 me-2" @click.passive="hide">
                                            <span class="bi bi-arrow-return-left"></span>
                                        </button>
                                        <button class="btn btn-touch-border text-4 me-2" @click.passive="comments">
                                            <span class="bi bi-chat-fill"></span>
                                        </button>
                                        <button class="btn btn-touch-border text-4 me-2" @click.passive="share">
                                            <span class="bi bi-share-fill"></span>
                                        </button>
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
import { Share } from '@capacitor/share';
import { useRouter } from 'vue-router';
import { Modal } from "bootstrap"
import Hammer from 'hammerjs';

const router = useRouter();

const modal = ref(null);
const modalElement = ref(null);
const hammer = ref(null);

const scale = ref(1);
const transform_scale = ref("scale(1)");

const left = ref(0);
const top = ref(0);
const transform_translate = ref("translate(0px, 0px)");

const image = ref(null);
const controls_visible = ref(false);

const data = ref({
    id: null,
    src: null,
    uri: null,
});

async function reset() {
    // Reset image
    data.value = {
        src: null,
        title: null,
        num_comments: null,
        id: null
    };

    // Reset transformations
    scale.value = 1;
    transform_scale.value = "scale(1)";

    left.value = 0;
    top.value = 0;
    transform_translate.value = "translate(0px, 0px)";

}

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

async function comments() {
    router.push("/post/" + data.value.id);
    hide();
}

async function share() {
    await Share.share({
        url: data.value.uri,
    });
}

function is_open() {
    return modal.value._isShown;
}

defineExpose({
    show,
    hide,
    handle,
    is_open
})

onMounted(() => {
    // Init modal
    modal.value = new Modal(modalElement.value, {
        keyboard: false
    })

    modalElement.value.addEventListener('hidden.bs.modal', reset);

    // Init hammer
    hammer.value = new Hammer.Manager(image.value);

    let doubletap = new Hammer.Tap({ event: 'doubletap', taps: 2 });
    let tap = new Hammer.Tap({ event: 'tap' });
    let pinch = new Hammer.Pinch({ event: 'pinch' });
    let pan = new Hammer.Pan({ event: 'pan' });

    hammer.value.add([doubletap, tap, pinch, pan]);
    hammer.value.get('tap').requireFailure('doubletap');
    hammer.value.get('pan').dropRecognizeWith('pinch');
    hammer.value.get('pinch').dropRecognizeWith('pan');

    // Pan
    hammer.value.on('pan', (e) => {
        // Return if pinching
        if (e.maxPointers > 1) return;
        if (get_scale() == 1) return;

        image.value.style.transition = "none";

        let x = (e.deltaX / get_scale());
        let y = (e.deltaY / get_scale());

        transform_translate.value = "translate(" + x + "px, " + y + "px)";
    })

    hammer.value.on('panend', (e) => {
        // Return if pinching
        if (e.maxPointers > 1) return;
        if (get_scale() == 1) return;

        image.value.style.transition = "none";

        // Set position values
        let temp_x = left.value + (get_transform_x() * get_scale());
        let temp_y = top.value + (get_transform_y() * get_scale());

        // Limit position
        let rec = image.value.getBoundingClientRect();

        // X axis
        if (rec.x > 0) {
            temp_x -= rec.x;
        }
        if (rec.x < (window.innerWidth - rec.width)) {
            temp_x += (window.innerWidth - rec.width) - rec.x;
        }

        // Y axis
        if (rec.height < window.innerHeight) {
            temp_y = 0;
        }
        else if (rec.y > 0) {
            temp_y -= rec.y;
        }
        else if ((rec.height + rec.y) < window.innerHeight) {
            temp_y += window.innerHeight - (rec.height + rec.y);
        }

        // Set new position
        left.value = temp_x;
        top.value = temp_y;

        transform_translate.value = "translate(0px, 0px)";
    })

    // Single tap
    hammer.value.on('tap', () => {
        image.value.style.transition = "none";

        controls();
    })

    // Double tap
    hammer.value.on('doubletap', () => {
        // Do zooming out animation

        scale.value = 1;
        transform_scale.value = "scale(1)";

        left.value = 0;
        top.value = 0;
        transform_translate.value = "translate(0px, 0px)";
        image.value.style.transition = "scale 0.25s ease";
    })

    // Zoom in
    hammer.value.on('pinchout', (e) => {
        image.value.style.transition = "none";

        let scale = e.scale;

        // Set new scale style
        transform_scale.value = "scale(" + scale + ")";
    })

    // Zoom out
    hammer.value.on('pinchin', (e) => {
        image.value.style.transition = "none";

        let scale = e.scale;

        // Limit scale
        if (scale < 0.5) {
            scale = 0.5;
        }

        // Set new scale style
        transform_scale.value = "scale(" + scale + ")";
    })

    hammer.value.on('pinchend', (e) => {
        image.value.style.transition = "none";

        // Set scale values
        let temp_scale = scale.value * get_transform_scale();

        // Limit position
        let rec = image.value.getBoundingClientRect();

        // X axis
        if (rec.x > 0) {
            left.value -= rec.x;
        }
        if (rec.x < (window.innerWidth - rec.width)) {
            left.value += (window.innerWidth - rec.width) - rec.x;
        }

        // Y axis
        if (rec.height < window.innerHeight) {
            top.value = 0;
        }
        else if (rec.y > 0) {
            top.value -= rec.y;
        }
        else if ((rec.height + rec.y) < window.innerHeight) {
            top.value += window.innerHeight - (rec.height + rec.y);
        }

        // Limit scale
        if (temp_scale < 1) {
            temp_scale = 1;
            left.value = 0;
            top.value = 0;
            transform_translate.value = "translate(0px, 0px)";
        }

        // Set scale
        scale.value = temp_scale;
        transform_scale.value = "scale(1)";
    })
})

function get_transform_scale() {
    if (transform_scale.value == "") return 1;
    return parseFloat(transform_scale.value.slice(6, -1));
}

function get_scale() {
    return parseFloat(image.value.style.scale);
}

function get_transform_x() {
    if (transform_translate.value == "") return 0;
    return parseFloat(transform_translate.value.slice(10, -1).split(",")[0].slice(0, -2));
}

function get_transform_y() {
    if (transform_translate.value == "") return 0;
    return parseFloat(transform_translate.value.slice(10, -1).split(",")[1].slice(0, -2));
}

onBeforeUnmount(() => {
    modal.value.dispose();
})
</script>