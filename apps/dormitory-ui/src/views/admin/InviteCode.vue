<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { CheckCircle2, Copy, Home, KeyRound, Trash2 } from "lucide-vue-next";
import { deleteInviteCode, getInviteCode } from "../../api/inviteCode";
import CreateInviteModal from "../../components/invite/CreateInviteModal.vue";
import DeleteInviteModal from "../../components/invite/DeleteInviteModal.vue";
import AppContainer from "../../components/ui/AppContainer.vue";

type InviteItem = {
    id: number;
    public_id: string;
    code: string;
    room_number?: string | number | null;
    is_used: boolean;
    used_by_name?: string | null;
    created_at: string;
};

const invites = ref<InviteItem[]>([]);
const showModal = ref(false);
const showDeleteModal = ref(false);
const selectedInvite = ref<InviteItem | null>(null);

const fetchInvites = async () => {
    const res = await getInviteCode();
    invites.value = res.data;
};

onMounted(fetchInvites);

const totalCodes = computed(() => invites.value.length);
const usedCodes = computed(() => invites.value.filter((invite) => invite.is_used).length);
const availableCodes = computed(() => invites.value.filter((invite) => !invite.is_used).length);

const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    alert("คัดลอกรหัสแล้ว");
};

const openDeleteModal = (invite: InviteItem) => {
    selectedInvite.value = invite;
    showDeleteModal.value = true;
};

const closeDeleteModal = () => {
    showDeleteModal.value = false;
    selectedInvite.value = null;
};

const handleDeleteInvite = async () => {
    if (!selectedInvite.value?.id) {
        return;
    }

    try {
        await deleteInviteCode(selectedInvite.value.id);
        closeDeleteModal();
        await fetchInvites();
    } catch (error) {
        console.error("delete invite failed", error);
        alert("ไม่สามารถลบรหัสเชิญได้");
    }
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("th-TH");
};
</script>

<template>
    <AppContainer>
        <div class="page">
            <div class="header">
                <div>
                    <h1 class="title">รหัสเชิญ</h1>
                    <p class="subtitle">
                        จัดการรหัสสมัครสมาชิกสำหรับผู้พักอาศัยใหม่
                    </p>
                    <p class="caption">
                        รหัสเชิญ 1 รหัส ใช้สมัครได้เพียง 1 ครั้ง
                    </p>
                </div>

                <button class="create-btn" @click="showModal = true">
                    + สร้างรหัสใหม่
                </button>
            </div>

            <div class="summary-grid">
                <div class="stat-card">
                    <KeyRound class="icon icon-gray" />
                    <div class="stat-number">{{ totalCodes }}</div>
                    <div class="stat-label">รหัสทั้งหมด</div>
                </div>

                <div class="stat-card">
                    <CheckCircle2 class="icon icon-green" />
                    <div class="stat-number">{{ usedCodes }}</div>
                    <div class="stat-label">ใช้แล้ว</div>
                </div>

                <div class="stat-card">
                    <Home class="icon icon-orange" />
                    <div class="stat-number">{{ availableCodes }}</div>
                    <div class="stat-label">ยังไม่ได้ใช้</div>
                </div>
            </div>

            <div class="table-wrapper">
                <table class="table">
                    <thead>
                        <tr>
                            <th>รหัสเชิญ</th>
                            <th>ห้อง</th>
                            <th>สถานะ</th>
                            <th>ใช้โดย</th>
                            <th>สร้างเมื่อ</th>
                            <th>จัดการ</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="invite in invites" :key="invite.public_id">
                            <td>
                                <span class="code-badge">
                                    {{ invite.code }}
                                </span>
                            </td>

                            <td>ห้อง {{ invite.room_number || "-" }}</td>

                            <td>
                                <span :class="invite.is_used ? 'badge-used' : 'badge-available'">
                                    {{ invite.is_used ? "ใช้แล้ว" : "ยังไม่ได้ใช้" }}
                                </span>
                            </td>

                            <td>{{ invite.used_by_name || "-" }}</td>

                            <td>{{ formatDate(invite.created_at) }}</td>

                            <td>
                                <div class="action-group">
                                    <button
                                        v-if="!invite.is_used"
                                        class="icon-btn"
                                        type="button"
                                        title="คัดลอกรหัส"
                                        @click="copyCode(invite.code)"
                                    >
                                        <Copy class="w-4 h-4" />
                                    </button>

                                    <button
                                        v-if="!invite.is_used"
                                        class="icon-btn danger"
                                        type="button"
                                        title="ลบรหัสเชิญ"
                                        @click="openDeleteModal(invite)"
                                    >
                                        <Trash2 class="w-4 h-4" />
                                    </button>

                                    <span
                                        v-if="invite.is_used"
                                        class="action-placeholder"
                                    >
                                        -
                                    </span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <CreateInviteModal
            v-if="showModal"
            @close="showModal = false"
            @created="fetchInvites"
        />

        <DeleteInviteModal
            v-if="showDeleteModal"
            :invite="selectedInvite"
            @cancel="closeDeleteModal"
            @confirm="handleDeleteInvite"
        />
    </AppContainer>
</template>

<style scoped>
.page {
    max-width: 1152px;
    margin: 0 auto;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 24px;
}

.title {
    font-size: 30px;
    font-weight: 700;
}

.subtitle {
    margin-top: 6px;
    font-size: 14px;
    color: #9ca3af;
}

.caption {
    margin-top: 4px;
    font-size: 12px;
    color: #9ca3af;
}

.create-btn {
    background: #1e2b4a;
    color: white;
    padding: 10px 18px;
    border-radius: 12px;
    white-space: nowrap;
}

.summary-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
    margin-bottom: 24px;
}

.stat-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 20px;
    text-align: center;
}

.icon {
    margin: 0 auto 10px;
}

.icon-gray {
    color: #64748b;
}

.icon-green {
    color: #16a34a;
}

.icon-orange {
    color: #ea580c;
}

.stat-number {
    font-size: 24px;
    font-weight: 700;
}

.stat-label {
    font-size: 13px;
    color: #9ca3af;
}

.table-wrapper {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    overflow: hidden;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

thead {
    background: #f9fafb;
}

th {
    text-align: left;
    padding: 14px;
    font-size: 13px;
    color: #6b7280;
}

td {
    padding: 14px;
    border-top: 1px solid #f1f5f9;
}

.code-badge {
    display: inline-flex;
    align-items: center;
    background: #eef2f7;
    padding: 6px 10px;
    border-radius: 8px;
    font-weight: 600;
}

.badge-used {
    background: #dcfce7;
    color: #16a34a;
    padding: 4px 10px;
    border-radius: 999px;
}

.badge-available {
    background: #fff7ed;
    color: #ea580c;
    padding: 4px 10px;
    border-radius: 999px;
}

.action-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.icon-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #475569;
    transition: background 0.2s ease, color 0.2s ease;
}

.icon-btn:hover {
    background: #eef2f7;
    color: #1e293b;
}

.icon-btn.danger:hover {
    background: #fee2e2;
    color: #dc2626;
}

.action-placeholder {
    color: #94a3b8;
}

@media (max-width: 900px) {
    .header {
        flex-direction: column;
        align-items: stretch;
    }

    .create-btn {
        width: 100%;
    }

    .summary-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .table-wrapper {
        overflow-x: auto;
    }

    .table {
        min-width: 760px;
    }
}
</style>
