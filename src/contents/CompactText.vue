<template>
    <div class="text-wrap text-break background text-truncate overflow-hidden vh-25 p-3">
        <div class="text-4 text-post" v-html="text" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import showdown from 'showdown';

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const converter = new showdown.Converter({
    simplifiedAutoLink: true,
});

const text = ref(null);

async function get_sources() {
    text.value = converter.makeHtml(props.data.selftext);
}

// setup
get_sources();
</script>