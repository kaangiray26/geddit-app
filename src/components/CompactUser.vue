<template>
    <li class="list-group-item foreground border-0 rounded m-3 mt-0 p-0" @click.passive="open_user">
        <div class="d-flex justify-content-between align-items-center p-3">
            <div class="d-flex align-items-center">
                <div>
                    <img :src="get_icon_src()" class="snoovatar-icon me-2">
                </div>
                <div class="d-flex flex-column">
                    <div class="d-flex align-items-center">
                        <h6 class="text-break text-4 m-0 me-2">{{ post.name }}</h6>
                        <img v-if="post.is_gold" src="/images/premium.svg" class="icon-small">
                    </div>
                    <small class="text-4">{{ format_karma() }}</small>
                    <small v-if="post.is_suspended" class="text-4">suspended</small>
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