<template>
    <AppContainer>
        <div class="edit-page">
            <div class="page-header">
                <div>
                    <h1>แก้ไขประกาศ</h1>
                    <p>ปรับข้อมูลข่าวสารก่อนบันทึกการเปลี่ยนแปลง</p>
                </div>

                <button class="back-btn" @click="router.push('/admin/announcements')">กลับไปรายการ</button>
            </div>

            <div v-if="loading" class="state-card">กำลังโหลดข้อมูลประกาศ...</div>

            <div v-else class="form-card">
                <div class="form-group">
                    <label>
                        หัวข้อประกาศ
                        <span class="required">*</span>
                    </label>

                    <input
                        class="input"
                        :value="formData.title"
                        placeholder="กรอกหัวข้อประกาศ"
                        @input="handleTextInput($event, 'title')"
                    />
                </div>

                <div class="form-group">
                    <label>
                        รายละเอียดประกาศ
                        <span class="required">*</span>
                    </label>

                    <textarea
                        rows="5"
                        class="input textarea"
                        :value="formData.content"
                        placeholder="กรอกรายละเอียดประกาศ"
                        @input="handleTextInput($event, 'content')"
                    />
                </div>

                <div class="grid two-columns">
                    <div class="form-group">
                        <label>หมวดหมู่ประกาศ</label>
                        <select
                            class="input"
                            :value="formData.categoryName"
                            @change="handleTextInput($event, 'categoryName')"
                        >
                            <option value="GENERAL">ข่าวทั้งหมด</option>
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
                                    :checked="formData.targetType === 'ALL'"
                                    @change="handleTargetChange('ALL')"
                                />
                                ทุกคนในหอ
                            </label>

                            <label class="radio-item">
                                <input
                                    type="radio"
                                    value="ROOM"
                                    :checked="formData.targetType === 'ROOM'"
                                    @change="handleTargetChange('ROOM')"
                                />
                                เฉพาะห้อง
                            </label>
                        </div>
                    </div>
                </div>

                <div v-if="formData.targetType === 'ROOM'" class="grid two-columns">
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

                <div class="line-box">
                    <div>
                        <label>แจ้งเตือนผ่าน LINE</label>
                        <div class="sub-label">{{ lineStatusLabel }}</div>
                    </div>
                    <button class="line-send-btn" :disabled="!canSendLine || sendingLine" @click="handleSendLine">
                        {{
                            sendingLine
                                ? "กำลังส่ง..."
                                : Boolean(announcement?.is_line_sent)
                                  ? "ส่งแล้ว ✓"
                                  : "ส่งแจ้งเตือน LINE"
                        }}
                    </button>
                </div>

                <div class="action-row">
                    <button class="btn-cancel" @click="router.push('/admin/announcements')">ยกเลิก</button>

                    <button class="btn-save" :disabled="saving" @click="handleSubmit">
                        {{ saving ? "กำลังบันทึก..." : "บันทึกการแก้ไข" }}
                    </button>
                </div>
            </div>
        </div>
    </AppContainer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppContainer from "../../components/ui/AppContainer.vue";
import { getRooms } from "../../api/dorm.api";
import { getAnnouncementByIdForEdit, sendLineNotification, updateAnnouncement } from "../../api/announcements.api";

type AnnouncementFormData = {
    title: string;
    content: string;
    categoryName: string;
    targetType: "ALL" | "ROOM";
    roomId: number | null;
    isLineNotificationEnabled: boolean;
};

type RoomItem = {
    id: number;
    room_number: string;
    floor: number;
    building_name?: string | null;
};

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const saving = ref(false);
const rooms = ref<RoomItem[]>([]);
const selectedFloor = ref<number | null>(null);
const formData = ref<AnnouncementFormData>({
    title: "",
    content: "",
    categoryName: "GENERAL",
    targetType: "ALL",
    roomId: null,
    isLineNotificationEnabled: false,
});
const announcement = ref<any>(null);
const sendingLine = ref(false);

const announcementId = String(route.params.id || "");

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

const mapAnnouncementToForm = (announcement: any): AnnouncementFormData => {
    const targetType = announcement?.targetType || announcement?.target_type || "ALL";
    const roomId = announcement?.roomId || announcement?.room_id || null;
    const categoryName =
        announcement?.categoryName || announcement?.category_name || announcement?.category || "GENERAL";

    return {
        title: announcement?.title || "",
        content: announcement?.content || "",
        categoryName: ["GENERAL", "ANNOUNCEMENT", "EVENT", "PAYMENT", "MAINTENANCE"].includes(categoryName)
            ? categoryName
            : "GENERAL",
        targetType: targetType === "ROOM" ? "ROOM" : "ALL",
        roomId: roomId ? Number(roomId) : null,
        isLineNotificationEnabled: Boolean(
            announcement?.isLineNotificationEnabled ?? announcement?.is_line_notification_enabled
        ),
    };
};

const fetchRooms = async () => {
    const res = await getRooms();
    rooms.value = res.data;
};

const fetchAnnouncement = async () => {
    const res = await getAnnouncementByIdForEdit(announcementId);
    announcement.value = res.data;
    formData.value = mapAnnouncementToForm(res.data);
};

watch(
    [rooms, () => formData.value.roomId],
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

    formData.value = {
        ...formData.value,
        [field]: target?.value ?? "",
    };
};

const handleFloorChange = (event: Event) => {
    const target = event.target as HTMLSelectElement | null;
    const value = target?.value ? Number(target.value) : null;

    selectedFloor.value = Number.isNaN(value) ? null : value;
    formData.value = {
        ...formData.value,
        roomId: null,
    };
};

const handleRoomChange = (event: Event) => {
    const target = event.target as HTMLSelectElement | null;
    const value = target?.value ? Number(target.value) : null;

    formData.value = {
        ...formData.value,
        roomId: Number.isNaN(value) ? null : value,
    };
};

const handleTargetChange = (targetType: "ALL" | "ROOM") => {
    if (targetType === "ALL") {
        selectedFloor.value = null;
    }

    formData.value = {
        ...formData.value,
        targetType,
        roomId: targetType === "ROOM" ? formData.value.roomId : null,
    };
};

const canSendLine = computed(() => !Boolean(announcement.value?.is_line_sent));

const lineStatusLabel = computed(() => {
    if (Boolean(announcement.value?.is_line_sent)) {
        return "ส่งแจ้งเตือนแล้ว";
    }
    return "ยังไม่ได้ส่งแจ้งเตือน";
});

const handleSendLine = async () => {
    if (sendingLine.value) return;
    try {
        sendingLine.value = true;
        await sendLineNotification(announcementId);
        announcement.value = { ...announcement.value, is_line_sent: 1 };
        alert("ส่งแจ้งเตือน LINE สำเร็จ");
    } catch (err: any) {
        alert(err?.response?.data?.message || "ส่ง LINE ไม่สำเร็จ");
    } finally {
        sendingLine.value = false;
    }
};

const handleSubmit = async () => {
    if (!formData.value.title.trim() || !formData.value.content.trim()) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }

    if (formData.value.targetType === "ROOM" && selectedFloor.value === null) {
        alert("กรุณาเลือกชั้น");
        return;
    }

    if (formData.value.targetType === "ROOM" && !formData.value.roomId) {
        alert("กรุณาเลือกห้อง");
        return;
    }

    try {
        saving.value = true;
        await updateAnnouncement(announcementId, formData.value);
        await fetchAnnouncement();
        alert("แก้ไขประกาศเรียบร้อยแล้ว");
        router.push("/admin/announcements");
    } catch (error: any) {
        alert(error?.response?.data?.message || "ไม่สามารถแก้ไขประกาศได้");
    } finally {
        saving.value = false;
    }
};

onMounted(async () => {
    try {
        await Promise.all([fetchRooms(), fetchAnnouncement()]);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.edit-page {
    max-width: 960px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
    margin-bottom: 24px;
}

.page-header h1 {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
}

.page-header p {
    margin-top: 6px;
    color: #6b7280;
}

.back-btn {
    background: #e5e7eb;
    color: #1f2937;
    padding: 10px 16px;
    border-radius: 12px;
    font-weight: 600;
}

.state-card,
.form-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 20px;
    padding: 24px;
}

.form-group {
    margin-bottom: 20px;
}

.grid.two-columns {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
}

label {
    display: block;
    margin-bottom: 8px;
    color: #4b5563;
    font-weight: 500;
}

.input {
    width: 100%;
    border: 1px solid #d1d5db;
    border-radius: 12px;
    padding: 12px 14px;
    background: #fff;
}

.input:disabled {
    background: #f8fafc;
    color: #94a3b8;
    cursor: not-allowed;
}

.textarea {
    min-height: 140px;
    resize: vertical;
}

.radio-group {
    display: flex;
    gap: 18px;
    padding-top: 12px;
}

.radio-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 0;
}

.line-box {
    margin-top: 10px;
    padding: 18px;
    border-radius: 16px;
    background: #f8fafc;
    display: flex;
    justify-content: space-between;
    gap: 16px;
    align-items: center;
}

.sub-label {
    font-size: 13px;
    color: #6b7280;
}

.action-row {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
}

.btn-cancel,
.btn-save {
    padding: 11px 22px;
    border-radius: 12px;
    font-weight: 600;
}

.btn-cancel {
    background: #e5e7eb;
    color: #1f2937;
}

.btn-save {
    background: #1e2b4a;
    color: white;
}

.btn-save:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.switch {
    position: relative;
    width: 46px;
    height: 26px;
}

.switch input {
    display: none;
}

.slider {
    position: absolute;
    inset: 0;
    background: #d1d5db;
    border-radius: 999px;
}

.slider::before {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    top: 3px;
    left: 3px;
    background: white;
    border-radius: 50%;
    transition: 0.2s;
}

.switch input:checked + .slider {
    background: #1e2b4a;
}

.switch input:checked + .slider::before {
    transform: translateX(20px);
}

.required {
    color: #ef4444;
    margin-left: 4px;
}

.line-send-btn {
    padding: 10px 20px;
    border-radius: 12px;
    background: #06c755;
    color: white;
    font-weight: 600;
    white-space: nowrap;
    transition: 0.2s;
}

.line-send-btn:disabled {
    background: #d1fae5;
    color: #6b7280;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .page-header {
        flex-direction: column;
        align-items: stretch;
    }

    .grid.two-columns {
        grid-template-columns: 1fr;
    }

    .line-box {
        flex-direction: column;
        align-items: flex-start;
    }

    .action-row {
        flex-direction: column-reverse;
    }
}
</style>
