<template>
    <div class="top-app-bar">
        <div class="top-app-bar-leading-icon-container" @touchstart.prevent="go_back">
            <span class="top-app-bar-leading-icon material-icons">arrow_back</span>
        </div>
        <span class="title-large">{{ props.subreddit }}</span>
        <div class="top-app-bar-trailing-icons">
            <div class="top-app-bar-trailing-icon-container position-relative" @touchstart.prevent="open_menu_options">
                <span class="top-app-bar-trailing-icon material-icons">more_vert</span>
                <div v-show="menu_visible" class="menu" @touchstart.prevent="close_menu_options">
                    <div v-show="menu_visible" class="menu-container">
                        <div class="menu-item" @touchstart.prevent="refresh">
                            <span class="material-icons">refresh</span>
                            <span class="label-large">Refresh</span>
                        </div>
                        <div class="menu-item" @touchstart.prevent="clear_hidden">
                            <span class="material-icons">restore</span>
                            <span class="label-large">Clear hidden posts</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="d-flex dps-16 md-dark">
        <div class="chips-container" @touchstart.prevent="open_sort_options">
            <span class=" material-icons">sort</span>
            <span class="label-large">{{ display }}</span>
        </div>
    </div>
    <div ref="modalElement" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body foreground rounded">
                    <ul class="list-group">
                        <li v-show="tab == 'sort'" v-for="sort_type in sort_types" class="theme-list-item rounded"
                            @click.passive="change_sort(sort_type)">
                            <div class="d-flex justify-content-between align-items-center p-3">
                                <div class="d-flex align-items-center">
                                    <h6 :class="sort_type.icon" class="mb-0 me-3"></h6>
                                    <h6 class="mb-0 me-3">{{ sort_type.name }}</h6>
                                </div>
                                <div v-show="sort_type.value == 'top' || sort_type.value == 'controversial'">
                                    <h6 class="mb-0 bi bi-arrow-right"></h6>
                                </div>
                            </div>
                        </li>
                        <li v-show="tab == 'time'" v-for="time_type in time_types" class="theme-list-item rounded"
                            @click.passive="change_time(time_type)">
                            <div class="d-flex align-items-center p-3">
                                <h6 :class="time_type.icon" class="mb-0 me-3"></h6>
                                <h6 class="mb-0">{{ time_type.name }}</h6>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { clear_hidden } from '/js/store.js';
import { useRouter } from 'vue-router';
import { Modal } from "bootstrap"

const router = useRouter();

const tab = ref('sort');
const sort = ref("hot");
const time = ref("day");
const display = ref("hot");

const modal = ref(null);
const modalElement = ref(null);
const menu_visible = ref(false);

const emit = defineEmits(['params_changed'])

const props = defineProps({
    subreddit: {
        type: String,
        required: false
    }
})

defineExpose({
    show,
    hide,
    sort,
    time
})

const sort_types = [
    {
        name: "Best",
        value: "best",
        icon: "bi bi-rocket-takeoff-fill"
    },
    {
        name: "Hot",
        value: "hot",
        icon: "bi bi-fire"
    },
    {
        name: "New",
        value: "new",
        icon: "bi bi-clock-fill"
    },
    {
        name: "Top",
        value: "top",
        icon: "bi bi-trophy-fill"
    },
    {
        name: "Rising",
        value: "rising",
        icon: "bi bi-lightning-charge-fill"
    },
    {
        name: "Controversial",
        value: "controversial",
        icon: "bi bi-chat-text-fill"
    }
]

const time_types = [
    {
        name: "Hour",
        value: "hour",
        icon: "bi bi-clock-history"
    },
    {
        name: "Day",
        value: "day",
        icon: "bi bi-calendar-day"
    },
    {
        name: "Week",
        value: "week",
        icon: "bi bi-calendar"
    },
    {
        name: "Month",
        value: "month",
        icon: "bi bi-calendar2"
    },
    {
        name: "Year",
        value: "year",
        icon: "bi bi-calendar3"
    },
    {
        name: "All",
        value: "all",
        icon: "bi bi-clock-fill"
    }
]

async function open_menu_options(event) {
    event.stopPropagation();
    menu_visible.value = true;
}

async function close_menu_options(event) {
    event.stopPropagation();
    menu_visible.value = false;
}

async function open_sort_options() {
    modal.value.show();
}

async function refresh() {
    router.go();
}

async function show() {
    modal.value.show();
}

async function hide() {
    modal.value.hide();
}

async function change_sort(sort_type) {
    sort.value = sort_type.value;
    display.value = sort_type.name;

    if (sort.value == 'top' || sort.value == 'controversial') {
        tab.value = 'time';
        return
    }

    emit('params_changed');
    hide();
}

async function change_time(time_type) {
    time.value = time_type.value;
    emit('params_changed');
    hide();
}

onMounted(() => {
    // Init modal
    modal.value = new Modal(modalElement.value, {
        keyboard: false
    })

    modalElement.value.addEventListener('hidden.bs.modal', () => {
        tab.value = 'sort';
    })
})

onBeforeUnmount(() => {
    modal.value.dispose();
})
</script>