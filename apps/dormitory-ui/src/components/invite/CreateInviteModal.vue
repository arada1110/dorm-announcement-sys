<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { X } from "lucide-vue-next";
import { getBuildings, getRoomsByBuilding } from "../../api/dorm.api";
import { createInviteCode } from "../../api/inviteCode";
import ConfirmInviteModal from "./ConfirmInviteModal.vue";

type BuildingItem = {
    id: number;
    building_name: string;
};

type RoomItem = {
    id: number;
    room_number: string;
    floor: number;
    building_name?: string;
};

const emit = defineEmits(["close", "created"]);

const buildings = ref<BuildingItem[]>([]);
const rooms = ref<RoomItem[]>([]);

const selectedBuilding = ref("");
const selectedFloor = ref<number | null>(null);
const selectedRoomId = ref<number | null>(null);

const loading = ref(false);
const showConfirmModal = ref(false);

const fetchBuildings = async () => {
    const res = await getBuildings();
    buildings.value = res.data;
};

watch(selectedBuilding, async (buildingName) => {
    selectedFloor.value = null;
    selectedRoomId.value = null;
    rooms.value = [];

    if (!buildingName) {
        return;
    }

    const res = await getRoomsByBuilding(buildingName);
    rooms.value = res.data;
});

const floorOptions = computed(() => {
    return Array.from(new Set(rooms.value.map((room) => room.floor)))
        .filter((floor) => typeof floor === "number" && !Number.isNaN(floor))
        .sort((a, b) => a - b);
});

const filteredRooms = computed(() => {
    if (selectedFloor.value === null) {
        return [];
    }

    return rooms.value.filter((room) => room.floor === selectedFloor.value);
});

watch(selectedFloor, () => {
    selectedRoomId.value = null;
});

const selectedRoom = () => {
    return rooms.value.find((room) => room.id === selectedRoomId.value) || null;
};

const handleCreateInvite = () => {
    if (!selectedBuilding.value) {
        alert("กรุณาเลือกอาคาร");
        return;
    }

    if (selectedFloor.value === null) {
        alert("กรุณาเลือกชั้น");
        return;
    }

    if (!selectedRoomId.value) {
        alert("กรุณาเลือกห้อง");
        return;
    }

    showConfirmModal.value = true;
};

const confirmCreateInvite = async () => {
    if (!selectedRoomId.value) {
        return;
    }

    loading.value = true;

    try {
        await createInviteCode({
            room_id: selectedRoomId.value,
        });

        showConfirmModal.value = false;
        emit("created");
        emit("close");
    } catch (error) {
        console.error(error);
        alert("สร้างรหัสไม่สำเร็จ");
    } finally {
        loading.value = false;
    }
};

onMounted(fetchBuildings);
</script>

<template>
    <div v-if="!showConfirmModal" class="overlay">
        <div class="modal">
            <div class="modal-header">
                <h2>สร้างรหัสเชิญใหม่</h2>

                <button @click="$emit('close')">
                    <X class="icon" />
                </button>
            </div>

            <div class="form">
                <div class="field">
                    <label>เลือกอาคาร</label>

                    <select v-model="selectedBuilding">
                        <option value="">เลือกอาคาร</option>
                        <option
                            v-for="building in buildings"
                            :key="building.id"
                            :value="building.building_name"
                        >
                            {{ building.building_name }}
                        </option>
                    </select>
                </div>

                <div class="field">
                    <label>เลือกชั้น</label>

                    <select
                        v-model="selectedFloor"
                        :disabled="!selectedBuilding"
                    >
                        <option :value="null">เลือกชั้น</option>
                        <option
                            v-for="floor in floorOptions"
                            :key="floor"
                            :value="floor"
                        >
                            ชั้น {{ floor }}
                        </option>
                    </select>
                </div>

                <div class="field">
                    <label>เลือกห้อง</label>

                    <select
                        v-model="selectedRoomId"
                        :disabled="selectedFloor === null"
                    >
                        <option :value="null">เลือกห้อง</option>

                        <option
                            v-for="room in filteredRooms"
                            :key="room.id"
                            :value="room.id"
                        >
                            ห้อง {{ room.room_number }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="footer">
                <button class="btn-cancel" @click="$emit('close')">
                    ยกเลิก
                </button>

                <button
                    class="btn-submit"
                    :disabled="loading"
                    @click="handleCreateInvite"
                >
                    {{ loading ? "กำลังสร้าง..." : "สร้างรหัส" }}
                </button>
            </div>
        </div>
    </div>

    <ConfirmInviteModal
        v-if="showConfirmModal"
        :buildingName="selectedBuilding"
        :roomNumber="selectedRoom()?.room_number"
        @cancel="showConfirmModal = false"
        @confirm="confirmCreateInvite"
    />
</template>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.25);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal {
    width: 560px;
    max-width: calc(100vw - 32px);
    background: white;
    border-radius: 16px;
    padding: 24px;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
}

.icon {
    width: 18px;
    height: 18px;
}

.form {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
}

.field {
    min-width: 0;
}

label {
    font-size: 13px;
    margin-bottom: 6px;
    display: block;
}

select {
    width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 10px;
}

select:disabled {
    background: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
}

.footer {
    display: flex;
    gap: 12px;
    margin-top: 24px;
}

.btn-cancel {
    flex: 1;
    background: #eee;
    padding: 12px;
    border-radius: 10px;
}

.btn-submit {
    flex: 1;
    background: #1e2b4a;
    color: white;
    padding: 12px;
    border-radius: 10px;
}

@media (max-width: 768px) {
    .form {
        grid-template-columns: 1fr;
    }

    .footer {
        flex-direction: column-reverse;
    }
}
</style>
