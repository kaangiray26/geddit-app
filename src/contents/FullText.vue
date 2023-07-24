<template>
    <div v-show="text">
        <div class="text-wrap text-break">
            <div class="text-4 text-post" v-html="text" />
            <div class="d-flex justify-content-end">
                <button type="button" class="btn btn-touch bi bi-translate" @click="translate"
                    :disabled="btn_disabled"></button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const text = ref(null);
const translated = ref(false);

const origin = ref(1);          // 0: original, 1: translated
const texts = ref(['', '']);    // original, translated

const btn_disabled = ref(false);

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

function decodeHtml(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

async function get_sources() {
    text.value = decodeHtml(props.data.selftext_html);
}

async function translate() {
    btn_disabled.value = true;
    let p = document.querySelector("p");

    if (!translated.value) {
        texts.value[0] = p.textContent;

        let translation = await fetch("https://lingva.ml/api/v1/auto/en/" + encodeURIComponent(texts.value[0]))
            .then(res => res.json())
            .then(res => res.translation)
            .catch(err => null);
        if (!translation) {
            btn_disabled.value = false;
            return
        }

        p.innerText = translation
        texts.value[1] = translation;
        translated.value = true;
        btn_disabled.value = false;
        return
    }

    origin.value = (origin.value + 1) % 2;
    p.innerText = texts.value[origin.value];
    btn_disabled.value = false;
}

// setup
get_sources();
</script>