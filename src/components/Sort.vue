<template>
    <div ref="modalElement" class="modal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body foreground rounded">
                    <ul class="list-group">
                        <li v-show="tab == 'sort'" v-for="sort_type in sort_types" class="theme-list-item rounded"
                            @click="change_sort(sort_type)">
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
                            @click="change_time(time_type)">
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
import { Modal } from "bootstrap"

const emit = defineEmits(["show", "hide", "sort_changed", "time_changed"]);

const tab = ref('sort');

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

const modal = ref(null);
const modalElement = ref(null);

async function show() {
    modal.value.show();
}

async function hide() {
    modal.value.hide();
}

async function change_sort(sort_type) {
    emit("sort_changed", sort_type.value);

    if (sort_type.value == 'top' || sort_type.value == 'controversial') {
        tab.value = 'time';
        return
    }

    hide();
}

async function change_time(time_type) {
    emit("time_changed", time_type.value);
    hide();
}

defineExpose({
    show,
    hide
})

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