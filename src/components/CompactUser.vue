<template>
    <div class="list-item-3 md-foreground md-rounded-12 space-between-16" @click.passive="open_user">
        <div class="list-item-leading-avatar">
            <img :src="get_icon_src()">
        </div>
        <div class="d-flex flex-column">
            <div class="d-flex align-items-center">
                <span class="body-large text-11">{{ post.name }}</span>
                <img v-if="post.is_gold" src="/images/premium.svg" class="md-img-24 dms-8">
            </div>
            <div class="ellipsis">
                <span class="body-medium">{{ format_karma() }}</span>
            </div>
            <span class="label-small" v-if="post.is_suspended">suspended</span>
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
    if (props.post.icon_img) {
        return props.post.icon_img.split("?")[0];
    }
    return "/images/user.svg";
}

function format_karma() {
    if (!props.post.link_karma) {
        return null;
    }

    let karma = props.post.link_karma + props.post.comment_karma;
    return karma.toLocaleString() + " karma";
}

async function open_user() {
    router.push("/u/" + props.post.name)
}
</script>