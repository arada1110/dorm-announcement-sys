<template>
    <div class="overlay">
        <div class="modal">
            <div class="modal-header">
                <h2>สร้างประกาศใหม่</h2>

                <button class="icon-btn" @click="$emit('close')">
                    <X :size="20" />
                </button>
            </div>

            <div class="modal-body">
                <div class="form-group">
                    <label>
                        หัวข้อประกาศ
                        <span class="required">*</span>
                    </label>

                    <input
                        class="input"
                        :value="formData?.title"
                        placeholder="เช่น แจ้งปิดน้ำ"
                        @input="handleTextInput($event, 'title')"
                    />
                </div>

                <div class="form-group">
                    <label>
                        รายละเอียดประกาศ
                        <span class="required">*</span>
                    </label>

                    <textarea
                        rows="3"
                        class="input"
                        :value="formData?.content"
                        placeholder="เช่น ปิดน้ำเวลา 09:00 - 12:00"
                        @input="handleTextInput($event, 'content')"
                    />
                </div>

                <div class="form-group">
                    <label>หมวดหมู่ประกาศ</label>

                    <select
                        class="input"
                        :value="formData?.categoryName || 'GENERAL'"
                        @change="handleTextInput($event, 'categoryName')"
                    >
                        <option value="GENERAL">ข่าวทั่วไป</option>
                        <option value="ANNOUNCEMENT">ประกาศสำคัญ</option>
                        <option value="EVENT">กิจกรรม</option>
                        <option value="PAYMENT">การชำระเงิน</option>
                        <option value="MAINTENANCE">การซ่อมบำรุง</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>ประเภทผู้รับประกาศ</label>

                    <div class="radio-group">
                        <label class="radio-item">
                            <input
                                type="radio"
                                value="ALL"
                                :checked="formData?.targetType === 'ALL'"
                                @change="handleTargetTypeChange('ALL')"
                            />
                            ทุกคนในหอ
                        </label>

                        <label class="radio-item">
                            <input
                                type="radio"
                                value="ROOM"
                                :checked="formData?.targetType === 'ROOM'"
                                @change="handleTargetTypeChange('ROOM')"
                            />
                            เฉพาะห้อง
                        </label>
                    </div>
                </div>

                <div v-if="formData?.targetType === 'ROOM'" class="room-grid">
                    <div class="form-group">
                        <label>
                            ชั้น
                            <span class="required">*</span>
                        </label>

                        <select class="input" :value="selectedFloor ?? ''" @change="handleFloorChange">
                            <option disabled value="">-- เลือกชั้น --</option>
                            <option v-for="floor in floorOptions" :key="floor" :value="floor">ชั้น {{ floor }}</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>
                            ห้อง
                            <span class="required">*</span>
                        </label>

                        <select
                            class="input"
                            :value="formData.roomId ?? ''"
                            :disabled="selectedFloor === null"
                            @change="handleRoomChange"
                        >
                            <option disabled value="">-- เลือกห้อง --</option>
                            <option v-for="room in filteredRooms" :key="room.id" :value="room.id">
                                {{ formatRoomLabel(room) }}
                            </option>
                        </select>
                    </div>
                </div>

                <div class="form-group line-toggle">
                    <div>
                        <label>แจ้งเตือนผ่าน LINE</label>
                        <div class="sub-label">
                            <template v-if="lineNotificationAvailable">
                                ระบบจะส่งแจ้งเตือนทันทีหลังสร้างประกาศ
                            </template>
                            <template v-else> LINE Notification ถูกปิดในการตั้งค่า </template>
                        </div>
                    </div>

                    <label class="switch" :class="{ 'opacity-40 cursor-not-allowed': !lineNotificationAvailable }">
                        <input
                            type="checkbox"
                            :checked="formData?.isLineNotificationEnabled"
                            :disabled="!lineNotificationAvailable"
                            @change="handleLineNotificationChange"
                        />
                        <span class="slider"></span>
                    </label>
                </div>
            </div>

            <div class="modal-footer">
                <button class="btn-cancel" @click="$emit('close')">ยกเลิก</button>

                <button class="btn-submit" @click="handleSubmit">สร้างประกาศ</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { X } from "lucide-vue-next";
import { getRooms } from "../../api/dorm.api";
import { getMe } from "../../api/authApi";
import { getPublicLineConfig } from "../../api/lineConfig.api";

type AnnouncementFormData = {
    title?: string;
    content?: string;
    categoryName?: string;
    targetType?: "ALL" | "ROOM";
    roomId?: number | null;
    isLineNotificationEnabled?: boolean;
};

type RoomItem = {
    id: number;
    room_number: string;
    floor: number;
    building_name?: string | null;
};

const props = defineProps({
    formData: Object as () => AnnouncementFormData,
});

const emit = defineEmits(["close", "preview", "update:formData"]);

const rooms = ref<RoomItem[]>([]);
const selectedFloor = ref<number | null>(null);
const lineNotificationAvailable = ref(false);

const fetchRooms = async () => {
    const res = await getRooms();
    rooms.value = res.data;
};

onMounted(async () => {
    await fetchRooms();

    try {
        const me = await getMe();
        const lineRes = await getPublicLineConfig(me.data.dormitory_id);
        lineNotificationAvailable.value =
            lineRes.data && lineRes.data.enabled !== false && Boolean(lineRes.data.notificationEnabled);
    } catch {
        lineNotificationAvailable.value = false;
    }
});

if (!props.formData?.categoryName) {
    emit("update:formData", {
        ...props.formData,
        categoryName: "GENERAL",
    });
}

const updateFormData = (patch: Partial<AnnouncementFormData>) => {
    emit("update:formData", {
        ...props.formData,
        ...patch,
    });
};

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

const formatRoomLabel = (room: RoomItem) => {
    return room.building_name ? `${room.building_name} / ห้อง ${room.room_number}` : `ห้อง ${room.room_number}`;
};

watch(
    [rooms, () => props.formData?.roomId],
    ([roomList, roomId]) => {
        if (!roomId) {
            return;
        }

        const matchedRoom = roomList.find((room) => room.id === roomId);
        selectedFloor.value = matchedRoom?.floor ?? null;
    },
    { immediate: true }
);

const handleTextInput = (event: Event, field: "title" | "content" | "categoryName") => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;

    updateFormData({
        [field]: target?.value ?? "",
    });
};

const handleTargetTypeChange = (targetType: "ALL" | "ROOM") => {
    if (targetType === "ALL") {
        selectedFloor.value = null;
    }

    updateFormData({
        targetType,
        roomId: targetType === "ROOM" ? (props.formData?.roomId ?? null) : null,
    });
};

const handleFloorChange = (event: Event) => {
    const target = event.target as HTMLSelectElement | null;
    const value = target?.value ? Number(target.value) : null;

    selectedFloor.value = Number.isNaN(value) ? null : value;
    updateFormData({
        roomId: null,
    });
};

const handleRoomChange = (event: Event) => {
    const target = event.target as HTMLSelectElement | null;
    const value = target?.value ? Number(target.value) : null;

    updateFormData({
        roomId: Number.isNaN(value) ? null : value,
    });
};

const handleLineNotificationChange = (event: Event) => {
    const target = event.target as HTMLInputElement | null;

    updateFormData({
        isLineNotificationEnabled: target?.checked ?? false,
    });
};

const handleSubmit = () => {
    if (!props.formData?.title?.trim() || !props.formData.content?.trim()) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }

    if (props.formData.targetType === "ROOM" && selectedFloor.value === null) {
        alert("กรุณาเลือกชั้น");
        return;
    }

    if (props.formData.targetType === "ROOM" && !props.formData.roomId) {
        alert("กรุณาเลือกห้อง");
        return;
    }

    emit("preview", props.formData);
};
</script>

<style scoped>
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.modal {
    width: 560px;
    max-width: calc(100vw - 32px);
    max-height: 90vh;
    background: white;
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #eee;
    font-weight: 600;
}

.modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
}

.form-group {
    margin-bottom: 18px;
}

.room-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
}

label {
    font-size: 14px;
    color: #555;
    margin-bottom: 6px;
    display: block;
}

.input {
    width: 100%;
    border: 1px solid #e5e7eb;
    padding: 10px 12px;
    border-radius: 10px;
}

.input:disabled {
    background: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
}

.radio-group {
    display: flex;
    gap: 20px;
}

.radio-item {
    display: flex;
    align-items: center;
    gap: 6px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 20px 24px;
    border-top: 1px solid #eee;
}

.btn-cancel {
    background: #eee;
    padding: 10px 24px;
    border-radius: 10px;
}

.btn-submit {
    background: #1e2b4a;
    color: white;
    padding: 10px 24px;
    border-radius: 10px;
}

.icon-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #374151;
}

.switch {
    position: relative;
    width: 44px;
    height: 24px;
}

.switch input {
    display: none;
}

.slider {
    position: absolute;
    inset: 0;
    background: #ddd;
    border-radius: 999px;
}

.slider::before {
    content: "";
    position: absolute;
    width: 18px;
    height: 18px;
    background: white;
    border-radius: 50%;
    top: 3px;
    left: 4px;
    transition: 0.2s;
}

.switch input:checked + .slider {
    background: #1e2b4a;
}

.switch input:checked + .slider::before {
    transform: translateX(18px);
}

.line-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sub-label {
    font-size: 12px;
    color: #888;
}

.required {
    color: #ef4444;
    margin-left: 4px;
    font-weight: 600;
}

@media (max-width: 640px) {
    .room-grid {
        grid-template-columns: 1fr;
    }

    .modal-footer {
        flex-direction: column-reverse;
    }

    .btn-cancel,
    .btn-submit {
        width: 100%;
    }

    .line-toggle {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }
}
</style>
