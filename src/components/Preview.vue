<template>
    <div class="preview-container">
        <img class="preview" v-if="data" :src="data.url" @click.passive="controls_visible = !controls_visible">
        <div class="position-absolute bottom-0 end-0 m-3" v-show="controls_visible">
            <div class="md-fab md-foreground el-3" @click.passive="go_back">
                <span class="material-icons text-4">arrow_back</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const data = ref(null);
const controls_visible = ref(false);

async function setup() {
    let url = `https://i.redd.it/${router.currentRoute.value.params.id}.${router.currentRoute.value.params.ext}`;

    data.value = {
        url: url,
    }
}

function go_back() {
    router.back();
}

onBeforeMount(() => {
    if (!router.currentRoute.value.params) {
        router.back();
        return;
    }

    setup();
})
</script>