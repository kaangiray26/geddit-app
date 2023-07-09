<template>
    <div v-show="text">
        <div class="text-wrap text-break background p-3">
            <div class="text-4 text-post" v-html="text" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import showdown from 'showdown';

const text = ref(null);

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

const converter = new showdown.Converter({
    simplifiedAutoLink: true,
});

async function get_sources() {
    text.value = converter.makeHtml(props.data.selftext);
}

// setup
get_sources();
</script>