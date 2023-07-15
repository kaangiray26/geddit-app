<template>
    <div v-show="text" class="text-wrap text-break text-truncate overflow-hidden vh-25 p-3">
        <div class="text-4 text-post" v-html="text" />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const text = ref(null);

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

// setup
get_sources();
</script>