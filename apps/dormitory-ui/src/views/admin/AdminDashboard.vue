<script setup lang="ts">
import { ref, onMounted } from "vue";
import AppContainer from "../../components/ui/AppContainer.vue";
import { getDashboardStats } from "../../api/dashboard.api";
import { useRouter } from "vue-router";
import CreateAnnouncementModal from "../../components/announcement/CreateAnnouncementModal.vue";
import ConfirmAnnouncementModal from "../../components/announcement/ConfirmAnnouncementModal.vue";
import CreateInviteModal from "../../components/invite/CreateInviteModal.vue";
import { createAnnouncement } from "../../api/announcements.api";
import { useAuthStore } from "../../stores/authStore";
import { categoryLabelMap } from "../../helper/categoryLabel";
import { targetTypeLabelMap } from "../../helper/targetLabel";

/*
|--------------------------------------------------------------------------
| LUCIDE ICONS
|--------------------------------------------------------------------------
*/

import { Megaphone, Users, KeyRound, PlusCircle, CalendarDays } from "lucide-vue-next";
import { formatDate } from "../../helper/formatDate";

const router = useRouter();
const authStore = useAuthStore();

type AnnouncementFormData = {
    title: string;
    content: string;
    categoryName: string;
    targetType: "ALL" | "ROOM";
    roomId: number | null;
    isLineNotificationEnabled: boolean;
};

/*
|--------------------------------------------------------------------------
| STATE
|--------------------------------------------------------------------------
*/

const stats = ref({
    totalAnnouncements: 0,
    totalResidents: 0,
    inviteUsage: "0/0",
    latestAnnouncements: [] as any[],
});

const loading = ref(true);
const showCreateModal = ref(false);
const showConfirmModal = ref(false);
const showInviteModal = ref(false);
const previewData = ref<any>(null);
const createFormData = ref<AnnouncementFormData>({
    title: "",
    content: "",
    categoryName: "GENERAL",
    targetType: "ALL",
    roomId: null,
    isLineNotificationEnabled: false,
});

/*
|--------------------------------------------------------------------------
| FETCH DATA
|--------------------------------------------------------------------------
*/

const fetchDashboardStats = async () => {
    const res = await getDashboardStats();
    stats.value = res.data;
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

const openInviteModal = () => {
    showInviteModal.value = true;
};

const handlePreview = (data: any) => {
    previewData.value = data;
    showCreateModal.value = false;
    showConfirmModal.value = true;
};

const creating = ref(false);

const confirmCreate = async () => {
    try {
        creating.value = true;
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
        await fetchDashboardStats();
    } catch (error: any) {
        console.error("Create announcement failed:", error?.response?.data || error);
        alert(error?.response?.data?.message || "ไม่สามารถสร้างประกาศได้");
    } finally {
        creating.value = false;
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

onMounted(async () => {
    try {
        await fetchDashboardStats();
    } catch (err) {
        console.error("Dashboard load error:", err);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <AppContainer>
        <div v-if="loading" class="text-gray-400">Loading dashboard...</div>

        <div v-else class="max-w-6xl mx-auto">
            <!-- HEADER -->
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-gray-800">แดชบอร์ด</h1>

                <p class="text-gray-400 mt-1">ยินดีต้อนรับกลับ! นี่คือภาพรวมของหอพักของคุณ</p>
            </div>

            <!-- SUMMARY CARDS -->
            <div class="grid md:grid-cols-3 gap-6 mb-8">
                <!-- ANNOUNCEMENTS -->
                <div class="stat-card">
                    <Megaphone class="icon" />

                    <div class="stat-value">
                        {{ stats.totalAnnouncements }}
                    </div>

                    <div class="stat-label">ประกาศทั้งหมด</div>
                </div>

                <!-- RESIDENTS -->
                <div class="stat-card">
                    <Users class="icon" />

                    <div class="stat-value">
                        {{ stats.totalResidents }}
                    </div>

                    <div class="stat-label">ผู้พักอาศัย</div>
                </div>

                <!-- INVITE -->
                <div class="stat-card">
                    <KeyRound class="icon" />

                    <div class="stat-value">
                        {{ stats.inviteUsage }}
                    </div>

                    <div class="stat-label">รหัสเชิญที่ใช้แล้ว</div>
                </div>
            </div>

            <!-- ACTION CARDS -->
            <div class="grid md:grid-cols-2 gap-6 mb-10">
                <!-- CREATE ANNOUNCEMENT -->
                <div class="action-card" @click="openCreateModal">
                    <Megaphone class="action-icon" />

                    <div>
                        <div class="action-title">สร้างประกาศใหม่</div>

                        <div class="action-subtitle">ประกาศข่าวสารให้ผู้พักอาศัย</div>
                    </div>
                </div>

                <!-- CREATE INVITE -->
                <div class="action-card highlight" @click="openInviteModal">
                    <PlusCircle class="action-icon" />

                    <div>
                        <div class="action-title">สร้างรหัสเชิญ</div>

                        <div class="action-subtitle">สร้างรหัสสำหรับผู้พักใหม่</div>
                    </div>
                </div>
            </div>

            <!-- LATEST ANNOUNCEMENTS -->
            <div>
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold">ประกาศล่าสุด</h2>

                    <button
                        class="text-sm text-gray-400 hover:text-gray-600"
                        @click="router.push('/admin/announcements')"
                    >
                        ดูทั้งหมด
                    </button>
                </div>

                <div class="grid md:grid-cols-3 gap-5">
                    <div v-for="item in stats.latestAnnouncements" :key="item.id" class="announcement-card">
                        <div class="badge-row">
                            <div class="badge" :class="getCategoryBadgeClass(item.category_name)">
                                {{ categoryLabelMap[item.category_name] || item.category_name || "ข่าวทั้งหมด" }}
                            </div>

                            <div class="badge" :class="getTargetBadgeClass(item.target_type)">
                                {{ targetTypeLabelMap[item.target_type] || item.target_label || item.target_type }}
                            </div>
                        </div>

                        <div class="announcement-title">
                            {{ item.title }}
                        </div>

                        <div class="announcement-content">
                            {{ item.content }}
                        </div>

                        <div class="announcement-date">
                            <CalendarDays class="date-icon" />

                            {{ formatDate(item.created_at) }}
                        </div>
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
        :loading="creating"
        @cancel="
            showConfirmModal = false;
            showCreateModal = true;
        "
        @confirm="confirmCreate"
    />

    <CreateInviteModal v-if="showInviteModal" @close="showInviteModal = false" @created="fetchDashboardStats" />
</template>

<style scoped>
/*
|--------------------------------------------------------------------------
| SUMMARY CARDS
|--------------------------------------------------------------------------
*/

.stat-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 18px;
    padding: 26px;
    text-align: center;
    transition: 0.2s;
}

.stat-card:hover {
    transform: translateY(-2px);
}

.icon {
    width: 28px;
    height: 28px;
    margin: 0 auto 10px auto;
    color: #4b5563;
}

.stat-value {
    font-size: 28px;
    font-weight: bold;
}

.stat-label {
    font-size: 14px;
    color: #9ca3af;
}

/*
|--------------------------------------------------------------------------
| ACTION CARDS
|--------------------------------------------------------------------------
*/

.action-card {
    border: 2px dashed #e5e7eb;
    border-radius: 18px;
    padding: 26px;
    display: flex;
    gap: 16px;
    align-items: center;
    cursor: pointer;
    transition: 0.2s;
}

.action-card:hover {
    border-color: #6366f1;
}

.action-card.highlight {
    border-color: #3b82f6;
}

.action-icon {
    width: 28px;
    height: 28px;
    color: #4b5563;
}

.action-title {
    font-weight: 600;
}

.action-subtitle {
    font-size: 13px;
    color: #9ca3af;
}

/*
|--------------------------------------------------------------------------
| ANNOUNCEMENT CARDS
|--------------------------------------------------------------------------
*/

.announcement-card {
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 18px;
    background: white;
    transition: 0.2s;
    min-width: 0;
}

.announcement-card:hover {
    border-color: #6366f1;
}

.badge {
    display: inline-flex;
    align-items: center;
    font-size: 12px;
    border-radius: 999px;
    padding: 3px 10px;
    margin-bottom: 6px;
}

.badge-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 6px;
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

.announcement-title {
    font-weight: 600;
    margin-bottom: 6px;
    overflow: hidden;
    overflow-wrap: anywhere;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.announcement-content {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 10px;
    overflow: hidden;
    overflow-wrap: anywhere;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
}

.announcement-date {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #9ca3af;
}

.date-icon {
    width: 14px;
    height: 14px;
}
</style>
