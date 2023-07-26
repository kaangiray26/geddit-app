<template>
    <div class="text-wrap text-break w-100">
        <div class="position-relative">
            <div class="text-4 text-post full-text-post position-relative" v-html="text"
                @contextmenu.prevent="controls_visible = true" />
            <div class="text-controls" v-show="controls_visible" @click.passive="controls_visible = false">
                <div class="md-fab md-foreground el-3" @click.passive="translate">
                    <span class="material-icons text-4">translate</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const text = ref(null);
const translated = ref(false);
const controls_visible = ref(false);

const origin = ref(1);          // 0: original, 1: translated
const texts = ref(['', '']);    // original, translated

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
    let md = document.querySelector(".md");

    if (!translated.value) {
        texts.value[0] = md.textContent;

        let translation = await fetch("https://lingva.garudalinux.org/api/v1/auto/en/" + encodeURIComponent(texts.value[0]))
            .then(res => res.json())
            .then(res => res.translation)
            .catch(err => null);
        if (!translation) {
            return
        }

        md.innerText = translation
        texts.value[1] = translation;
        translated.value = true;
        return
    }

    origin.value = (origin.value + 1) % 2;
    p.innerText = texts.value[origin.value];
}

// setup
get_sources();
</script>