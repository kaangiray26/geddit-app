<template>
    <li class="list-group-item foreground border-0 rounded m-3 mt-0 p-0" @click.passive="open_subreddit">
        <div class="d-flex justify-content-between align-items-center p-3">
            <div class="d-flex align-items-center">
                <div>
                    <img :src="get_icon_src()" class="snoovatar-icon me-2">
                </div>
                <div class="d-flex flex-column">
                    <div class="d-flex align-items-center">
                        <h6 class="text-break text-11 m-0 me-2">{{ post.display_name }}</h6>
                    </div>
                    <div class="ellipsis mb-2">
                        <small class="text-4">{{ get_description() }}</small>
                    </div>
                    <small class="text-4">{{ format_subscribers() }}</small>
                </div>
            </div>
        </div>
    </li>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
})

function get_icon_src() {
    if (props.post.community_icon) {
        return props.post.community_icon.split("?")[0];
    }
    return "/images/subreddit.svg"
}

function format_subscribers() {
    if (props.post.subscribers) {
        return props.post.subscribers.toLocaleString() + " members";
    }
    return "private";
}

async function open_subreddit() {
    router.push("/r/" + props.post.display_name)
}

function get_description() {
    let txt = document.createElement('textarea');
    txt.innerHTML = props.post.public_description;
    return txt.value;
}
</script>