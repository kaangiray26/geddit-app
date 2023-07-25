// store.js

import { reactive } from "vue";

const store = reactive({
    hidden: JSON.parse(localStorage.getItem('hidden_posts')) || [],
    title_size: JSON.parse(localStorage.getItem("title_size")) || 'title-medium',
})

async function hide(id) {
    store.hidden.push(id);
}

async function unhide(id) {
    store.hidden = store.hidden.filter(post_id => post_id != id);
}

function save_hidden() {
    localStorage.setItem('hidden_posts', JSON.stringify(store.hidden))
}

async function clear_hidden() {
    store.hidden = [];
}

async function is_hidden(id) {
    return store.hidden.includes(id);
}

export { store, hide, unhide, is_hidden, save_hidden, clear_hidden }