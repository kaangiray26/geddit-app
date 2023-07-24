<template>
    <div class="list-item-3 md-foreground md-rounded-12 space-between-16" @click.passive="open_subreddit">
        <div class="list-item-leading-avatar">
            <img :src="get_icon_src()">
        </div>
        <div class="d-flex flex-column">
            <span class="body-large text-11">{{ post.display_name }}</span>
            <div class="ellipsis">
                <span class="body-medium">{{ get_description() }}</span>
            </div>
            <span class="label-small">{{ format_subscribers() }}</span>
        </div>
    </div>
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