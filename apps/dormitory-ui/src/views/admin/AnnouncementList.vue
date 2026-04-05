<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getAnnouncements, deleteAnnouncement } from "../../api/announcements.api";
import { useRouter } from "vue-router";
import { sendLineNotification } from "../../api/announcements.api";
import AppContainer from "../../components/ui/AppContainer.vue";
import ConfirmAnnouncementModal from "../../components/announcement/ConfirmAnnouncementModal.vue";
import DeleteAnnouncementModal from "../../components/announcement/DeleteAnnouncementModal.vue";
import { createAnnouncement } from "../../api/announcements.api";
import { useAuthStore } from "../../stores/authStore";
import { categoryLabelMap } from "../../helper/categoryLabel";
import { targetTypeLabelMap } from "../../helper/targetLabel";

import { Pencil, Trash2, CheckCircle2, Users, CalendarDays } from "lucide-vue-next";
import CreateAnnouncementModal from "../../components/announcement/CreateAnnouncementModal.vue";
import { formatDate } from "../../helper/formatDate";

type AnnouncementFormData = {
    title: string;
    content: string;
    categoryName: string;
    targetType: "ALL" | "ROOM";
    roomId: number | null;
    isLineNotificationEnabled: boolean;
};

const announcements = ref<any[]>([]);
const router = useRouter();

const showCreateModal = ref(false);
const showConfirmModal = ref(false);
const showDeleteModal = ref(false);
const previewData = ref<any>(null);
const selectedAnnouncement = ref<any>(null);
const submitting = ref(false);
const createFormData = ref<AnnouncementFormData>({
    title: "",
    content: "",
    categoryName: "GENERAL",
    targetType: "ALL",
    roomId: null,
    isLineNotificationEnabled: false,
});

const authStore = useAuthStore();

const fetchData = async () => {
    const res = await getAnnouncements();
    announcements.value = res.data;
};

const goEdit = (id: string) => {
    router.push(`/admin/announcements/${id}/edit`);
};

const openDeleteModal = (announcement: any) => {
    selectedAnnouncement.value = announcement;
    showDeleteModal.value = true;
};

const handleDelete = async () => {
    if (!selectedAnnouncement.value?.public_id) return;

    await deleteAnnouncement(selectedAnnouncement.value.public_id);
    showDeleteModal.value = false;
    selectedAnnouncement.value = null;
    await fetchData();
};

const handleSendLine = async (publicId: string) => {
    try {
        await sendLineNotification(publicId);
        alert("ส่ง LINE notification สำเร็จ");
    } catch (error) {
        alert("ส่ง LINE ไม่สำเร็จ");
    }
};

const getCategoryBadgeClass = (categoryName?: string) => {
    if (categoryName === "ROOM") return "badge-room";
    if (categoryName === "BUILDING") return "badge-building";
    if (categoryName === "PAYMENT") return "badge-payment";
    if (categoryName === "MAINTENANCE") return "badge-maintenance";

    return "badge-general";
};

const getTargetBadgeClass = (targetType?: string) => {
    if (targetType === "ROOM") return "badge-target-room";
    if (targetType === "USER") return "badge-target-user";

    return "badge-target-all";
};

const handleCreated = async () => {
    await fetchData();
};

const openCreateModal = () => {
    createFormData.value = {
        title: "",
        content: "",
        categoryName: "GENERAL",
        targetType: "ALL",
        roomId: null,
        isLineNotificationEnabled: false,
    };
    showCreateModal.value = true;
};

const handlePreview = (data: any) => {
    previewData.value = data;
    showCreateModal.value = false;
    showConfirmModal.value = true;
};

const confirmCreate = async () => {
    if (submitting.value) return;
    submitting.value = true;
    try {
        await createAnnouncement({
            title: previewData.value.title,
            content: previewData.value.content,
            categoryName: previewData.value.categoryName,
            targetType: previewData.value.targetType,
            roomId: previewData.value.targetType === "ROOM" ? previewData.value.roomId : undefined,
            isLineNotificationEnabled: previewData.value.isLineNotificationEnabled,
            creatorId: authStore.user?.sub,
        });

        showConfirmModal.value = false;
        fetchData();
    } catch (error: any) {
        console.error("Create announcement failed:", error?.response?.data || error);
        alert(error?.response?.data?.message || "ไม่สามารถสร้างประกาศได้");
    } finally {
        submitting.value = false;
    }
};
onMounted(fetchData);
</script>

<template>
    <!-- PAGE -->
    <AppContainer>
        <div class="max-w-6xl mx-auto">
            <!-- HEADER -->
            <div class="flex justify-between items-center mb-6">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">จัดการประกาศ</h1>

                    <p class="text-gray-400 text-sm mt-1">สร้าง แก้ไข และจัดการประกาศข่าวสารของหอพัก</p>
                </div>

                <button @click="openCreateModal" class="create-btn">+ สร้างประกาศใหม่</button>
            </div>

            <!-- LIST -->
            <div class="space-y-6">
                <div v-for="item in announcements" :key="item.public_id" class="announcement-card">
                    <div class="flex justify-between items-start">
                        <div class="badge-row">
                            <span class="badge" :class="getCategoryBadgeClass(item.category_name)">
                                {{ categoryLabelMap[item.category_name] || item.category_name || "ข่าวทั้งหมด" }}
                            </span>

                            <span class="badge" :class="getTargetBadgeClass(item.target_type)">
                                <Users class="w-3 h-3" />
                                {{ targetTypeLabelMap[item.target_type] || item.target_label || item.target_type }}
                            </span>

                            <span v-if="item.sent_line" class="badge bg-green-100 text-green-600">
                                <CheckCircle2 class="w-3 h-3" />
                                ส่งแจ้งเตือนแล้ว
                            </span>
                        </div>

                        <div class="flex gap-3">
                            <button @click="goEdit(item.public_id)" class="text-blue-500 hover:text-blue-700">
                                <Pencil class="w-4 h-4" />
                            </button>

                            <button @click="openDeleteModal(item)" class="text-red-500 hover:text-red-700">
                                <Trash2 class="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div class="mt-2 text-lg font-semibold text-gray-800">
                        {{ item.title }}
                    </div>

                    <div class="announcement-content text-gray-500 text-sm mt-1">
                        {{ item.content }}
                    </div>

                    <div class="announcement-date text-xs text-gray-400 mt-3">
                        <CalendarDays class="date-icon" />
                        {{ formatDate(item.created_at) }}
                    </div>
                </div>
            </div>
        </div>
    </AppContainer>

    <CreateAnnouncementModal
        v-if="showCreateModal"
        :formData="createFormData"
        @close="showCreateModal = false"
        @preview="handlePreview"
        @update:formData="createFormData = $event"
    />

    <ConfirmAnnouncementModal
        v-if="showConfirmModal"
        :formData="previewData"
        :loading="submitting"
        @cancel="
            showConfirmModal = false;
            showCreateModal = true;
        "
        @confirm="confirmCreate"
    />

    <DeleteAnnouncementModal
        v-if="showDeleteModal"
        :announcement="selectedAnnouncement"
        @cancel="
            showDeleteModal = false;
            selectedAnnouncement = null;
        "
        @confirm="handleDelete"
    />
</template>

<style scoped>
.create-btn {
    background: #1e2b4a;
    color: white;
    padding: 10px 18px;
    border-radius: 12px;
}

.announcement-card {
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 18px;
    background: white;
    transition: 0.2s;
}

.announcement-card:hover {
    border-color: #3b82f6;
}

.badge {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    border-radius: 999px;
    padding: 3px 10px;
}

.badge-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.badge-general {
    background: #eef2ff;
    color: #4f46e5;
}

.badge-room {
    background: #dbeafe;
    color: #1d4ed8;
}

.badge-building {
    background: #ede9fe;
    color: #6d28d9;
}

.badge-payment {
    background: #dcfce7;
    color: #15803d;
}

.badge-maintenance {
    background: #fee2e2;
    color: #dc2626;
}

.badge-target-all {
    background: #f3f4f6;
    color: #4b5563;
}

.badge-target-room {
    background: #dbeafe;
    color: #1d4ed8;
}

.badge-target-user {
    background: #fef3c7;
    color: #b45309;
}

.announcement-content {
    max-width: 100%;
    overflow: hidden;
    overflow-wrap: anywhere;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.date-icon {
    width: 14px;
    height: 14px;
}

.announcement-date {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #9ca3af;
}
</style>
