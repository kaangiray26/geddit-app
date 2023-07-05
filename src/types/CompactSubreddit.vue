<template>
    <li class="list-group-item foreground border-0 rounded m-3 mt-0 p-0">
        <div class="d-flex justify-content-between align-items-center p-3">
            <div class="d-flex align-items-center">
                <div>
                    <img :src="get_icon_src()" class="snoovatar-icon me-2">
                </div>
                <div class="d-flex flex-column">
                    <div class="d-flex align-items-center">
                        <h6 class="text-11 m-0 me-2">{{ data.display_name }}</h6>
                    </div>
                    <div class="ellipsis mb-2">
                        <small class="text-4">{{ get_description() }}</small>
                    </div>
                    <small class="text-4">{{ format_subscribers() }}</small>
                </div>
            </div>
            <div class="d-flex">
                <button class="btn btn-touch text-4" @click="open_subreddit">
                    <span class="bi bi-arrow-right"></span>
                </button>
            </div>
        </div>
    </li>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

function get_icon_src() {
    if (props.data.community_icon) {
        return props.data.community_icon.split("?")[0];
    }
    return "/images/subreddit.svg"
}

function format_subscribers() {
    if (props.data.subscribers) {
        return props.data.subscribers.toLocaleString() + " members";
    }
    return "private";
}

async function open_subreddit() {
    router.push("/r/" + props.data.display_name)
}

function get_description() {
    let txt = document.createElement('textarea');
    txt.innerHTML = props.data.public_description;
    return txt.value;
}
</script>