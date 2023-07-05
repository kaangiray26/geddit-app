<template>
    <component :is="get_type()" :data="props.data.data" />
</template>

<script setup>
import CompactLink from './CompactLink.vue';
import CompactText from './CompactText.vue';
import CompactImage from './CompactImage.vue';
import CompactVideo from './CompactVideo.vue';
import CompactComment from './CompactComment.vue';
import CompactEmbed from './CompactEmbed.vue';
import CompactUser from './CompactUser.vue';
import CompactSubreddit from './CompactSubreddit.vue';

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
})

function get_type() {
    if (props.data.kind == "t1") {
        return CompactComment;
    }

    if (props.data.kind == "t2") {
        return CompactUser;
    }

    if (props.data.kind == "t5") {
        return CompactSubreddit;
    }

    // text
    if (props.data.data.is_self) {
        return CompactText;
    }

    // video
    if (props.data.data.domain == "v.redd.it") {
        return CompactVideo;
    }

    // image
    if (props.data.data.domain == "i.redd.it") {
        return CompactImage;
    }

    // embed
    if (props.data.data.media) {
        return CompactEmbed;
    }

    // link
    if (props.data.data.preview) {
        return CompactLink;
    }

    // Gallery
    // if (props.data.gallery_data) {
    //     image_options.value = {
    //         src: `https://i.redd.it/${props.data.gallery_data.items[0].media_id}.jpg`,
    //         preview: props.data.preview.images[0].resolutions.pop().url.replaceAll("&amp;", "&"),
    //         style: {
    //             'aspect-ratio': `${props.data.preview.images[0].source.width} / ${props.data.preview.images[0].source.height}`
    //         }
    //     }

    //     type.value = "image";
    //     return
    // }

    // Fallback
}
</script>