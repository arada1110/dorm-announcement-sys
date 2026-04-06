<template>
    <div class="detail-page">
        <router-link to="/resident/announcements" class="back-link">
            <ArrowLeft :size="16" />
            กลับไปหน้าข่าวสาร
        </router-link>

        <div v-if="loading" class="state-card">กำลังโหลดรายละเอียดประกาศ...</div>

        <template v-else-if="announcement">
            <section class="headline-card">
                <div class="headline-top">
                    <span class="hero-kicker text-xs font-bold">
                        <Sparkles :size="14" />
                        รายละเอียดประกาศ
                    </span>

                    <div class="badge-row">
                        <span v-if="isNew(announcement.created_at)" class="badge badge-new">ใหม่</span>
                        <span class="badge text-xs font-bold" :class="targetMeta.className">{{
                            targetMeta.label
                        }}</span>
                        <span class="badge text-xs font-bold" :class="categoryMeta.className">{{
                            categoryMeta.label
                        }}</span>
                    </div>
                </div>

                <h1 class="text-2xl font-extrabold">{{ announcement.title }}</h1>

                <div class="info-row">
                    <span class="info-item text-xs">
                        <CalendarDays :size="15" />
                        {{ formatDate(announcement.created_at) }}
                    </span>

                    <span class="info-item text-xs">
                        <ShieldCheck :size="15" />
                        ประกาศที่เกี่ยวข้องกับบัญชีของคุณ
                    </span>
                </div>
            </section>

            <section class="content-card">
                <h2 class="text-base font-extrabold text-orange-500">รายละเอียด</h2>

                <div class="content-body text-base">
                    {{ announcement.content }}
                </div>
            </section>
        </template>

        <div v-else class="state-card">ไม่พบประกาศที่ต้องการ</div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ArrowLeft, CalendarDays, ShieldCheck, Sparkles } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { getAnnouncementById } from "../../api/announcements.api";

type TargetType = "ALL" | "ROOM" | "USER";
type CategoryName = "GENERAL" | "ANNOUNCEMENT" | "EVENT" | "PAYMENT" | "MAINTENANCE";

interface AnnouncementDetail {
    public_id: string;
    title: string;
    content: string;
    created_at: string;
    category_name: CategoryName;
    target_type: TargetType;
}

const route = useRoute();
const router = useRouter();
const announcement = ref<AnnouncementDetail | null>(null);
const loading = ref(true);

const categoryMeta = computed(() => {
    const category = announcement.value?.category_name ?? "GENERAL";
    const map = {
        GENERAL: { label: "ข่าวทั่วไป", className: "category-general" },
        ANNOUNCEMENT: { label: "ประกาศสำคัญ", className: "category-annc" },
        EVENT: { label: "EVENT", className: "category-event" },
        PAYMENT: { label: "การชำระเงิน", className: "category-payment" },
        MAINTENANCE: { label: "การซ่อมบำรุง", className: "category-maintenance" },
    } satisfies Record<CategoryName, { label: string; className: string }>;

    return map[category] ?? map.GENERAL;
});

const targetMeta = computed(() => {
    const target = announcement.value?.target_type ?? "ALL";
    const map = {
        ALL: { label: "ส่งถึงทุกคน", className: "target-all" },
        ROOM: { label: "เฉพาะห้องของคุณ", className: "target-room" },
        USER: { label: "เฉพาะคุณ", className: "target-user" },
    } satisfies Record<TargetType, { label: string; className: string }>;

    return map[target] ?? map.ALL;
});

onMounted(async () => {
    window.scrollTo(0, 0);

    try {
        const res = await getAnnouncementById(route.params.id as string);
        announcement.value = res.data;
    } catch (err: any) {
        const status = err?.response?.status;
        const message = err?.response?.data?.message;

        if (status === 403 && message === "Please login to view this announcement") {
            router.push(`/login?redirect=/resident/announcements/${route.params.id}`);
            return;
        }

        if (status === 403) {
            router.push("/resident/announcements");
            return;
        }
    } finally {
        loading.value = false;
    }
});

function formatDate(date: string) {
    return new Date(date).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function isNew(createdAt?: string) {
    if (!createdAt) return false;
    const created = new Date(createdAt).getTime();
    const diffHours = (Date.now() - created) / (1000 * 60 * 60);
    return diffHours <= 24;
}
</script>

<style scoped>
.detail-page {
    padding: 0 0 2.5rem;
}

.back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-bottom: 1rem;
    color: #9a3412;
    font-weight: 700;
}

.headline-card {
    padding: 1.7rem;
    border-radius: 28px;
    background:
        radial-gradient(circle at top right, rgba(253, 186, 116, 0.52), transparent 36%),
        linear-gradient(135deg, #fff7ed 0%, #fffbeb 55%, #f0fdfa 100%);
    border: 1px solid rgba(251, 146, 60, 0.18);
    box-shadow: 0 18px 40px rgba(251, 146, 60, 0.12);
}

.headline-top {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: flex-start;
}

.hero-kicker {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    padding: 0.45rem 0.9rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.82);
    color: #c2410c;
}

.badge-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 0.5rem;
}

.badge {
    display: inline-flex;
    align-items: center;
    padding: 0.36rem 0.8rem;
    border-radius: 999px;
}

.badge-new {
    background: #f43f5e;
    color: #fff;
}

.target-all {
    background: #ffedd5;
    color: #c2410c;
}

.target-room {
    background: #ccfbf1;
    color: #0f766e;
}

.target-user {
    background: #dbeafe;
    color: #1d4ed8;
}

.category-general {
    background: #e0f2fe;
    color: #0369a1;
}

.category-annc {
    background: #ede9fe;
    color: #6d28d9;
}

.category-event {
    background: #dcfce7;
    color: #15803d;
}

.category-payment {
    background: #fee2e2;
    color: #b91c1c;
}

.category-maintenance {
    background: #fef3c7;
    color: #b45309;
}

.headline-card h1 {
    margin: 1.1rem 0 0.8rem;
    color: #1f2937;
}

.info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.4rem;
    color: #6b7280;
}

.info-item {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
}

.content-card,
.state-card {
    margin-top: 1.15rem;
    padding: 1.45rem 1.5rem;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(253, 186, 116, 0.22);
    box-shadow: 0 12px 28px rgba(148, 163, 184, 0.08);
}

.content-card h2 {
    color: #f97316;
}

.content-body {
    margin-top: 1rem;
    color: #4b5563;
    line-height: 1.9;
    white-space: pre-line;
    overflow-wrap: anywhere;
}

.state-card {
    text-align: center;
    color: #9ca3af;
}

@media (max-width: 640px) {
    .headline-card {
        padding: 1.25rem;
        border-radius: 24px;
    }

    .headline-top {
        flex-direction: column;
    }

    .badge-row {
        justify-content: flex-start;
    }

    .content-card,
    .state-card {
        padding: 1.15rem;
    }
}
</style>
