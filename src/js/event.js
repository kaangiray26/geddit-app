// event.js

async function open_image_viewer(src) {
    window.dispatchEvent(new CustomEvent('image_viewer', { detail: src }))
}

export { open_image_viewer }